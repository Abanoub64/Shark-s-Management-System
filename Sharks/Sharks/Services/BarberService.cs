using BarberBooking.API.Data;
using BarberBooking.API.DTOs;
using BarberBooking.API.Models;
using Microsoft.EntityFrameworkCore;

namespace BarberBooking.API.Services;

public class BarberService : IBarberService
{
    private readonly AppDbContext _db;

    public BarberService(AppDbContext db) => _db = db;

    public async Task<BarberDto> CreateAsync(CreateBarberDto dto)
    {
        var ent = new Barber { FullName = dto.FullName, BranchId = dto.BranchId };
        _db.Barbers.Add(ent);
        await _db.SaveChangesAsync();
        return new BarberDto { Id = ent.Id, FullName = ent.FullName, BranchId = ent.BranchId };
    }

    public async Task<bool> DeleteAsync(int id)
    {
        var b = await _db.Barbers.FindAsync(id);
        if (b == null) return false;
        _db.Barbers.Remove(b);
        await _db.SaveChangesAsync();
        return true;
    }

    public async Task<List<BarberDto>> GetAllAsync()
    {
        return await _db.Barbers.Select(b => new BarberDto { Id = b.Id, FullName = b.FullName, BranchId = b.BranchId }).ToListAsync();
    }

    public async Task<BarberDto?> GetByIdAsync(int id)
    {
        var b = await _db.Barbers.FindAsync(id);
        if (b == null) return null;
        return new BarberDto { Id = b.Id, FullName = b.FullName, BranchId = b.BranchId };
    }

    public async Task<BarberDto?> UpdateAsync(int id, UpdateBarberDto dto)
    {
        var b = await _db.Barbers.FindAsync(id);
        if (b == null) return null;
        b.FullName = dto.FullName;
        b.BranchId = dto.BranchId;
        await _db.SaveChangesAsync();
        return new BarberDto { Id = b.Id, FullName = b.FullName, BranchId = b.BranchId };
    }
}
