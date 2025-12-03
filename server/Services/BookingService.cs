using backend.Models;
using BarberBooking.API.DTOs;
using Microsoft.EntityFrameworkCore;

namespace BarberBooking.API.Services;

public class BookingService : IBookingService
{
    private readonly AppDbContext _db;
    public BookingService(AppDbContext db) => _db = db;

    public async Task<BookingDto> CreateAsync(CreateBookingDto dto)
    {
        var overlap = await _db.Bookings.AnyAsync(b =>
            b.BranchId == dto.BranchId &&
            ((dto.BarberId == null) || b.BarberId == dto.BarberId) &&
            !(dto.EndAt <= b.StartAt || dto.StartAt >= b.EndAt) &&
            b.Status != "Rejected");

        if (overlap) throw new Exception("Time slot not available");

        var ent = new Booking
        {
            BranchId = dto.BranchId,
            ServiceId = dto.ServiceId,
            BarberId = dto.BarberId,
            StartAt = dto.StartAt,
            EndAt = dto.EndAt,
            CustomerId = dto.CustomerId,
            Status = "Pending"
        };
        _db.Bookings.Add(ent);
        await _db.SaveChangesAsync();

        return new BookingDto
        {
            Id = ent.Id,
            BranchId = ent.BranchId,
            ServiceId = ent.ServiceId,
            BarberId = ent.BarberId,
            StartAt = ent.StartAt,
            EndAt = ent.EndAt,
            CustomerId = ent.CustomerId,
            Status = ent.Status
        };
    }

    public async Task<bool> DeleteAsync(int id)
    {
        var b = await _db.Bookings.FindAsync(id);
        if (b == null) return false;
        _db.Bookings.Remove(b);
        await _db.SaveChangesAsync();
        return true;
    }

    public async Task<List<BookingDto>> GetAllAsync()
    {
        return await _db.Bookings.Select(b => new BookingDto
        {
            Id = b.Id,
            BranchId = b.BranchId,
            ServiceId = b.ServiceId,
            BarberId = b.BarberId,
            StartAt = b.StartAt,
            EndAt = b.EndAt,
            CustomerId = b.CustomerId,
            PaymentOrderId = b.PaymentOrderId,
            PaymentCapturedId = b.PaymentCapturedId,
            Status = b.Status
        }).ToListAsync();
    }

    public async Task<BookingDto?> GetByIdAsync(int id)
    {
        var b = await _db.Bookings.FindAsync(id);
        if (b == null) return null;
        return new BookingDto
        {
            Id = b.Id,
            BranchId = b.BranchId,
            ServiceId = b.ServiceId,
            BarberId = b.BarberId,
            StartAt = b.StartAt,
            EndAt = b.EndAt,
            CustomerId = b.CustomerId,
            PaymentOrderId = b.PaymentOrderId,
            PaymentCapturedId = b.PaymentCapturedId,
            Status = b.Status
        };
    }

    public async Task<BookingDto?> UpdateAsync(int id, UpdateBookingDto dto)
    {
        var b = await _db.Bookings.FindAsync(id);
        if (b == null) return null;

        var overlap = await _db.Bookings.AnyAsync(x =>
            x.Id != id &&
            x.BranchId == b.BranchId &&
            ((b.BarberId == null) || x.BarberId == b.BarberId) &&
            !(dto.EndAt <= x.StartAt || dto.StartAt >= x.EndAt) &&
            x.Status != "Rejected");

        if (overlap) throw new Exception("Time slot not available");

        b.StartAt = dto.StartAt;
        b.EndAt = dto.EndAt;
        await _db.SaveChangesAsync();
        return new BookingDto
        {
            Id = b.Id,
            BranchId = b.BranchId,
            ServiceId = b.ServiceId,
            BarberId = b.BarberId,
            StartAt = b.StartAt,
            EndAt = b.EndAt,
            CustomerId = b.CustomerId,
            Status = b.Status
        };
    }

    public async Task<List<BookingSlotDto>> GetAvailableSlotsAsync(int barberId, DateTime date)
    {
        var startHour = 10;
        var endHour = 22;
        var slots = new List<BookingSlotDto>();

        var existingBookings = await _db.Bookings
            .Where(b => b.BarberId == barberId
                     && b.StartAt.Date == date.Date
                     && b.Status != "Rejected")
            .ToListAsync();

        for (int hour = startHour; hour < endHour; hour++)
        {
            var slotTime = date.Date.AddHours(hour);
            var slotEnd = slotTime.AddHours(1);

            var isTaken = existingBookings.Any(b =>
                (slotTime >= b.StartAt && slotTime < b.EndAt) ||
                (slotEnd > b.StartAt && slotEnd <= b.EndAt) ||
                (slotTime <= b.StartAt && slotEnd >= b.EndAt));

            slots.Add(new BookingSlotDto
            {
                Time = slotTime,
                IsAvailable = !isTaken
            });
        }
        return slots;
    }

    public async Task<List<BookingDto>> GetCustomerBookingsAsync(string customerId)
    {
        return await _db.Bookings
            .Where(b => b.CustomerId == customerId)
            .Select(b => new BookingDto
            {
                Id = b.Id,
                BranchId = b.BranchId,
                ServiceId = b.ServiceId,
                BarberId = b.BarberId,
                StartAt = b.StartAt,
                EndAt = b.EndAt,
                CustomerId = b.CustomerId,
                PaymentOrderId = b.PaymentOrderId,
                PaymentCapturedId = b.PaymentCapturedId,
                Status = b.Status
            })
            .ToListAsync();
    }

    public async Task<bool> UpdateStatusAsync(int id, string status)
    {
        var booking = await _db.Bookings.FindAsync(id);
        if (booking == null) return false;

        booking.Status = status;
        await _db.SaveChangesAsync();
        return true;
    }
}