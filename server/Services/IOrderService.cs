using backend.DTOs;
using backend.Models;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace backend.Services
{
    public interface IOrderService
    {
        Task<OrderDto> CreateBookingAsync(CreateBookingDto dto);
        Task<OrderDto> CreateProductOrderAsync(CreateProductOrderDto dto);
        Task<OrderDto> ConfirmOrderAsync(Guid orderId);
        Task<OrderDto?> GetByIdAsync(Guid id);
        Task<IEnumerable<OrderDto>> GetByCustomerAsync(Guid customerId);
        Task<IEnumerable<BarberAvailabilityDto>> GetAvailableBarbersAsync(DateTime date, TimeSpan startTime, int duration);
        Task<IEnumerable<TimeSpan>> GetBarberAvailableTimesAsync(Guid barberId, DateTime date);
        Task<IEnumerable<DateTime>> GenerateAvailableTimeSlotsAsync(Guid barberId, DateTime date, int serviceDurationInMinutes);
    }
}
