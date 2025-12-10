using backend.DTOs;
using backend.Models;
using Microsoft.EntityFrameworkCore;

namespace backend.Services
{
    public class DashboardService : IDashboardService
    {
        private readonly AppDbContext _context;

        // الحالات التي نعتبرها "مؤكدة" للإيرادات
        private static readonly string[] RevenueStatuses = new[] { "Confirmed", "Completed" };

        public DashboardService(AppDbContext context)
        {
            _context = context;
        }

        public async Task<DashboardFullDto> GetDashboardAsync(int? branchId = null)
        {
            // نجيب الحجوزات المراد التعامل معها (نستخدم Where لاحقاً)
            var allBookingsQuery = _context.Bookings.AsQueryable();

            // ===========================
            // Overview
            // ===========================
            // لجانِب تعقيدات الـ SQL نجيب البيانات التي نحتاجها للحسابات المعقدة إلى الذاكرة
            // لكن نحتفظ بالفلترة الأساسية على الفرع إذا تم تمريره
            if (branchId != null)
            {
                allBookingsQuery = allBookingsQuery.Where(b => b.BranchId == branchId);
            }

            // جلب الحجوزات الموجودة (حسب الفلترة أعلاه) مرة واحدة لتقليل الاستعلامات
            var allBookings = await allBookingsQuery.ToListAsync();

            // جلب الخدمات كلها لأننا نحتاج السعر لكل serviceId
            var allServices = await _context.Services.ToListAsync();

            // تحويلها إلى dictionary لسرعة الوصول
            var servicePriceById = allServices.ToDictionary(s => s.Id, s => s.Price);

            // bookings considered for revenue (Confirmed / Completed)
            var revenueBookings = allBookings
                .Where(b => RevenueStatuses.Contains(b.Status))
                .ToList();

            // حسابات Overview
            var now = DateTime.Now;
            var yearStart = new DateTime(now.Year, 1, 1);
            var monthStart = new DateTime(now.Year, now.Month, 1);

            decimal totalRevenueYtd = revenueBookings
                .Where(b => b.StartAt >= yearStart && b.StartAt <= DateTime.Now)
                .Sum(b => servicePriceById.TryGetValue(b.ServiceId, out var p) ? p : 0m);

            int totalBookings = allBookings.Count;

            int activeBranches = await _context.Branches.CountAsync();

            decimal dailyRevenue = await RevenueRange(startDate: DateTime.Today, endDate: DateTime.Today.AddDays(1), branchId, servicePriceById);
            decimal weeklyRevenue = await RevenueRange(startDate: DateTime.Today.AddDays(-7), endDate: DateTime.Today.AddDays(1), branchId, servicePriceById);
            decimal monthlyRevenue = await RevenueRange(startDate: monthStart, endDate: DateTime.Today.AddDays(1), branchId, servicePriceById);

            int completedBookingsCount = allBookings.Count(b => b.Status == "Completed" || b.Status == "Confirmed"); // حسب الحاجة

            int newCustomersCount = allBookings.Select(b => b.CustomerId).Distinct().Count();
            int returningCustomersCount = allBookings.GroupBy(b => b.CustomerId).Count(g => g.Count() > 1);
            int cancelledCount = allBookings.Count(b => string.Equals(b.Status, "Cancelled", StringComparison.OrdinalIgnoreCase));

            var overview = new DashboardOverviewDto
            {
                TotalRevenueYTD = totalRevenueYtd,
                TotalBookings = totalBookings,
                ActiveBranches = activeBranches,
                AvgWaitMinutes = 0, // يحتاج منطق إضافي إن وُجد (مثلاً من متوسط مدة الحجز)
                DailyRevenue = dailyRevenue,
                WeeklyRevenue = weeklyRevenue,
                MonthlyRevenue = monthlyRevenue,
                CompletedBookings = completedBookingsCount,
                NewCustomersCount = newCustomersCount,
                ReturningCustomersCount = returningCustomersCount,
                CancelledBookingsCount = cancelledCount,
                AverageRating = await _context.BranchRatings
                    .Where(r => branchId == null || r.BranchId == branchId)
                    .AverageAsync(r => (double?)r.Rating) ?? 0

            };

            // ===========================
            // Revenue trends by Year-Month
            // ===========================
            var revenueGroupedByMonth = revenueBookings
                .GroupBy(b => new { Year = b.StartAt.Year, Month = b.StartAt.Month })
                .Select(g => new
                {
                    Year = g.Key.Year,
                    Month = g.Key.Month,
                    Revenue = g.Sum(b => servicePriceById.TryGetValue(b.ServiceId, out var p) ? p : 0m)
                })
                .OrderBy(x => x.Year).ThenBy(x => x.Month)
                .ToList();

            var revenueTrends = revenueGroupedByMonth
                .Select(x => new TimeSeriesPointDto { Label = $"{x.Year}-{x.Month:D2}", Value = x.Revenue })
                .ToList();

            // ===========================
            // Revenue by Branch
            // ===========================
            // نقوم بجلب كل الفروع ثم نحسب الإيراد لكل فرع من الذاكرة (باستخدام allBookings)
            var branches = await _context.Branches.ToListAsync();
            var revenueByBranch = branches
                .Select(br =>
                {
                    var rev = revenueBookings
                        .Where(b => b.BranchId == br.Id)
                        .Sum(b => servicePriceById.TryGetValue(b.ServiceId, out var p) ? p : 0m);

                    return new RevenueByBranchDto
                    {
                        BranchId = br.Id,
                        BranchName = br.Name,
                        Revenue = rev
                    };
                })
                .ToList();

            // ===========================
            // Revenue by Service
            // ===========================
            var revenueByService = allServices
                .Select(s =>
                {
                    var cnt = revenueBookings.Count(b => b.ServiceId == s.Id);
                    return new RevenueByServiceDto
                    {
                        ServiceId = s.Id,
                        ServiceName = s.Name,
                        Revenue = cnt * s.Price
                    };
                })
                .ToList();

            // ===========================
            // Top Barbers
            // ===========================
            var barbers = await _context.Barbers.ToListAsync();
            var topBarbers = barbers
                .Select(barber =>
                {
                    var completedCount = allBookings.Count(b => b.BarberId == barber.Id && (b.Status == "Completed" || b.Status == "Confirmed"));
                    var revenue = revenueBookings.Where(b => b.BarberId == barber.Id).Sum(b => servicePriceById.TryGetValue(b.ServiceId, out var p) ? p : 0m);
                    return new TopBarberDto
                    {
                        BarberId = barber.Id,
                        BarberName = barber.FullName,
                        CompletedBookings = completedCount,
                        Revenue = revenue
                    };
                })
                .OrderByDescending(x => x.Revenue)
                .Take(5)
                .ToList();

            // ===========================
            // Revenue by time of day
            // ===========================
            var revenueByTime = revenueBookings
                .GroupBy(b => b.StartAt.Hour)
                .Select(g => new AvailableSlotStatsDto
                {
                    Time = $"{g.Key:00}:00",
                    Revenue = g.Sum(b => servicePriceById.TryGetValue(b.ServiceId, out var p) ? p : 0m)
                })
                .OrderBy(x => x.Time)
                .ToList();

            return new DashboardFullDto
            {
                Overview = overview,
                RevenueTrends = revenueTrends,
                RevenueByBranch = revenueByBranch,
                RevenueByService = revenueByService,
                TopBarbers = topBarbers,
                RevenueByTimeOfDay = revenueByTime
            };
        }

        // ======================================
        // Helper: compute revenue between startDate (inclusive) and endDate (exclusive)
        // ======================================
        private async Task<decimal> RevenueRange(DateTime startDate, DateTime endDate, int? branchId, Dictionary<int, decimal> servicePriceById)
        {
            // نجلب الحجوزات ضمن الفترة وضمن فرع إذا وُجد
            var q = _context.Bookings
                .Where(b => b.StartAt >= startDate && b.StartAt < endDate && RevenueStatuses.Contains(b.Status));

            if (branchId != null)
                q = q.Where(b => b.BranchId == branchId);

            var list = await q.ToListAsync();

            decimal sum = 0m;
            foreach (var b in list)
            {
                if (servicePriceById.TryGetValue(b.ServiceId, out var p))
                    sum += p;
            }

            return sum;
        }
    }
}
