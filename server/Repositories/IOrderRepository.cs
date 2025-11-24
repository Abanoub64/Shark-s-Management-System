using backend.Models;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace backend.Repositories
{
    public interface IOrderRepository
    {
        Task<Order?> GetByIdAsync(Guid id);
        Task<IEnumerable<Order>> GetByCustomerAsync(Guid customerId);
        Task AddAsync(Order order);
        Task UpdateAsync(Order order);
        Task<IEnumerable<Barber>> GetAllBarbersAsync();
        Task<Barber?> GetBarberByIdAsync(Guid barberId);
        Task<Service?> GetServiceByIdAsync(Guid serviceId);
        Task<Product?> GetProductByIdAsync(Guid productId);
        Task<IEnumerable<BarberSchedule>> GetSchedulesForBarberAndDateAsync(Guid barberId, DateTime date);
        Task<IEnumerable<BarberSchedule>> GetSchedulesForDateAsync(DateTime date);
        Task AddScheduleAsync(BarberSchedule schedule);
        Task UpdateScheduleAsync(BarberSchedule schedule);
        Task SaveChangesAsync();
        Task<IEnumerable<BarberSchedule>> GetSchedulesForBarberInRangeAsync(Guid barberId, DateTime rangeStart, DateTime rangeEnd);
    }
}
