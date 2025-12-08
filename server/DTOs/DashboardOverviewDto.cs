// backend.DTOs/DashboardDtos.cs
namespace backend.DTOs
{
    public class DashboardOverviewDto
    {
        public decimal TotalRevenueYTD { get; set; }
        public int TotalBookings { get; set; }
        public int ActiveBranches { get; set; }
        public double AvgWaitMinutes { get; set; }

        public decimal DailyRevenue { get; set; }
        public decimal WeeklyRevenue { get; set; }
        public decimal MonthlyRevenue { get; set; }
        public int CompletedBookings { get; set; }

        // Small widgets
        public int NewCustomersCount { get; set; }
        public int ReturningCustomersCount { get; set; }
        public int CancelledBookingsCount { get; set; }
        public double AverageRating { get; set; }
    }

    public class TimeSeriesPointDto
    {
        public string Label { get; set; } = string.Empty; // e.g. "Jan" or "2025-12-01"
        public decimal Value { get; set; }
    }

    public class RevenueByBranchDto
    {
        public int BranchId { get; set; }
        public string BranchName { get; set; } = string.Empty;
        public decimal Revenue { get; set; }
    }

    public class RevenueByServiceDto
    {
        public int ServiceId { get; set; }
        public string ServiceName { get; set; } = string.Empty;
        public decimal Revenue { get; set; }
    }

    public class TopBarberDto
    {
        public int BarberId { get; set; }
        public string BarberName { get; set; } = string.Empty;
        public decimal Revenue { get; set; }
        public int CompletedBookings { get; set; }
    }

    public class AvailableSlotStatsDto
    {
        public string Time { get; set; } = string.Empty; // "10:00"
        public decimal Revenue { get; set; }
    }

    public class DashboardFullDto
    {
        public DashboardOverviewDto Overview { get; set; } = new();
        public List<TimeSeriesPointDto> RevenueTrends { get; set; } = new();
        public List<RevenueByBranchDto> RevenueByBranch { get; set; } = new();
        public List<RevenueByServiceDto> RevenueByService { get; set; } = new();
        public List<TopBarberDto> TopBarbers { get; set; } = new();
        public List<AvailableSlotStatsDto> RevenueByTimeOfDay { get; set; } = new();
    }
}
