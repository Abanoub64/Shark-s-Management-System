using backend.DTOs;
using BarberBooking.API.DTOs;

namespace BarberBooking.API.Services;

public interface IBookingService
{
    Task<List<BookingDto>> GetAllAsync();
    Task<BookingDto?> GetByIdAsync(int id);
    Task<BookingDto> CreateAsync(CreateBookingDto dto);
    Task<BookingDto?> UpdateAsync(int id, UpdateBookingDto dto);
    Task<bool> DeleteAsync(int id);
    Task<List<BookingSlotDto>> GetAvailableSlotsAsync(int barberId, DateTime date);
    Task<List<BookingDto>> GetCustomerBookingsAsync(string customerId);
    Task<bool> UpdateStatusAsync(int id, string status);
}
    Task<List<AvailableSlotDto>> GetAvailableSlots(int branchId, int barberId, DateTime date);
}
