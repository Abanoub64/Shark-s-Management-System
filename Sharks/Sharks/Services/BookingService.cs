using BarberBooking.API.Data;
using BarberBooking.API.DTOs;
using BarberBooking.API.Models;
using Microsoft.EntityFrameworkCore;

namespace BarberBooking.API.Services;

public class BookingService : IBookingService
{
    private readonly AppDbContext _db;
    public BookingService(AppDbContext db) => _db = db;

    public async Task<BookingDto> CreateAsync(CreateBookingDto dto)
    {
        // basic overlap check
        var overlap = await _db.Bookings.AnyAsync(b =>
            b.BranchId == dto.BranchId &&
            ((dto.BarberId == null) || b.BarberId == dto.BarberId) &&
            !(dto.EndAt <= b.StartAt || dto.StartAt >= b.EndAt));
        if (overlap) throw new Exception("Time slot not available");

        var ent = new Booking
        {
            BranchId = dto.BranchId,
            ServiceId = dto.ServiceId,
            BarberId = dto.BarberId,
            StartAt = dto.StartAt,
            EndAt = dto.EndAt,
            CustomerId = dto.CustomerId
        };
        _db.Bookings.Add(ent);
        await _db.SaveChangesAsync();
        return new BookingDto { Id = ent.Id, BranchId = ent.BranchId, ServiceId = ent.ServiceId, BarberId = ent.BarberId, StartAt = ent.StartAt, EndAt = ent.EndAt, CustomerId = ent.CustomerId };
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
        return await _db.Bookings.Select(b => new BookingDto { Id = b.Id, BranchId = b.BranchId, ServiceId = b.ServiceId, BarberId = b.BarberId, StartAt = b.StartAt, EndAt = b.EndAt, CustomerId = b.CustomerId, PaymentOrderId=b.PaymentOrderId , PaymentCapturedId =b.PaymentCapturedId,Status=b.Status}).ToListAsync();
    }

    public async Task<BookingDto?> GetByIdAsync(int id)
    {
        var b = await _db.Bookings.FindAsync(id);
        if (b == null) return null;
        return new BookingDto { Id = b.Id, BranchId = b.BranchId, ServiceId = b.ServiceId, BarberId = b.BarberId, StartAt = b.StartAt, EndAt = b.EndAt, CustomerId = b.CustomerId, PaymentOrderId = b.PaymentOrderId, PaymentCapturedId = b.PaymentCapturedId, Status = b.Status };
    }

    public async Task<BookingDto?> UpdateAsync(int id, UpdateBookingDto dto)
    {
        var b = await _db.Bookings.FindAsync(id);
        if (b == null) return null;

        var overlap = await _db.Bookings.AnyAsync(x =>
            x.Id != id &&
            x.BranchId == b.BranchId &&
            ((b.BarberId == null) || x.BarberId == b.BarberId) &&
            !(dto.EndAt <= x.StartAt || dto.StartAt >= x.EndAt));
        if (overlap) throw new Exception("Time slot not available");

        b.StartAt = dto.StartAt;
        b.EndAt = dto.EndAt;
        await _db.SaveChangesAsync();
        return new BookingDto { Id = b.Id, BranchId = b.BranchId, ServiceId = b.ServiceId, BarberId = b.BarberId, StartAt = b.StartAt, EndAt = b.EndAt, CustomerId = b.CustomerId };
    }
}
