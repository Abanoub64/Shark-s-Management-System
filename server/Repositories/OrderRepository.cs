using backend.Data;
using backend.Models;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace backend.Repositories
{
    public class OrderRepository : IOrderRepository
    {
        private readonly AppDbContext _db;

        public OrderRepository(AppDbContext db)
        {
            _db = db;
        }

        public async Task AddAsync(Order order)
        {
            await _db.Orders.AddAsync(order);
        }

        public async Task AddScheduleAsync(BarberSchedule schedule)
        {
            await _db.BarberSchedules.AddAsync(schedule);
        }

        public async Task<Product?> GetProductByIdAsync(Guid productId)
        {
            return await _db.Products.FirstOrDefaultAsync(p => p.Id == productId);
        }

        public async Task<Service?> GetServiceByIdAsync(Guid serviceId)
        {
            return await _db.Services.FirstOrDefaultAsync(s => s.Id == serviceId);
        }

        public async Task<IEnumerable<Barber>> GetAllBarbersAsync()
        {
            return await _db.Barbers.Include(b => b.Schedules).ToListAsync();
        }

        public async Task<Barber?> GetBarberByIdAsync(Guid barberId)
        {
            return await _db.Barbers.Include(b => b.Schedules).FirstOrDefaultAsync(b => b.Id == barberId);
        }

        public async Task<IEnumerable<Order>> GetByCustomerAsync(Guid customerId)
        {
            return await _db.Orders.Where(o => o.CustomerId == customerId).ToListAsync();
        }

        public async Task<Order?> GetByIdAsync(Guid id)
        {
            return await _db.Orders.Include(o => o.Service).Include(o => o.Product).Include(o => o.Barber).FirstOrDefaultAsync(o => o.Id == id);
        }

        public async Task<IEnumerable<BarberSchedule>> GetSchedulesForBarberAndDateAsync(Guid barberId, DateTime date)
        {
            return await _db.BarberSchedules.Where(s => s.BarberId == barberId && s.Date.Date == date.Date).ToListAsync();
        }

        public async Task<IEnumerable<BarberSchedule>> GetSchedulesForDateAsync(DateTime date)
        {
            return await _db.BarberSchedules.Where(s => s.Date.Date == date.Date).ToListAsync();
        }

        public async Task UpdateAsync(Order order)
        {
            _db.Orders.Update(order);
        }

        public async Task UpdateScheduleAsync(BarberSchedule schedule)
        {
            _db.BarberSchedules.Update(schedule);
        }

        public async Task SaveChangesAsync()
        {
            await _db.SaveChangesAsync();
        }

        public async Task<IEnumerable<BarberSchedule>> GetSchedulesForBarberInRangeAsync(Guid barberId, DateTime rangeStart, DateTime rangeEnd)
        {
            // BarberSchedule stores Date (date only) plus StartTime and EndTime as TimeSpan.
            // We need to compare them in absolute DateTime space to correctly handle cross-midnight slots.

            var schedules = await _db.BarberSchedules.Where(s => s.BarberId == barberId).ToListAsync();
            var result = new List<BarberSchedule>();

            foreach (var s in schedules)
            {
                // Build absolute datetimes for schedule start/end
                var schedStart = s.Date.Date + s.StartTime;
                var schedEnd = s.Date.Date + s.EndTime;

                // If EndTime <= StartTime, treat as next-day end (cross-midnight)
                if (s.EndTime <= s.StartTime)
                {
                    schedEnd = schedEnd.AddDays(1);
                }

                // Check overlap
                if (!(rangeEnd <= schedStart || rangeStart >= schedEnd))
                {
                    result.Add(s);
                }
            }

            return result;
        }
    }
}
