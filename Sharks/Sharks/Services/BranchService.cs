using BarberBooking.API.Data;
using BarberBooking.API.DTOs;
using BarberBooking.API.Models;
using Microsoft.EntityFrameworkCore;

namespace BarberBooking.API.Services;

public class BranchService : IBranchService
{
    private readonly AppDbContext _db;

    public BranchService(AppDbContext db)
    {
        _db = db;
    }

    public async Task<BranchDto> CreateAsync(CreateBranchDto dto)
    {
        var ent = new Branch
        {
            Name = dto.Name,
            Location = dto.Location
        };
        _db.Add(ent);
        await _db.SaveChangesAsync();
        return new BranchDto { Id = ent.Id, Name = ent.Name, Location = ent.Location };
    }

    public async Task<bool> DeleteAsync(int id)
    {
        var b = await _db.Branches.FindAsync(id);
        if (b == null) return false;
        _db.Branches.Remove(b);
        await _db.SaveChangesAsync();
        return true;
    }

    public async Task<List<BranchDto>> GetAllAsync()
    {
        return await _db.Branches
            .Select(b => new BranchDto { Id = b.Id, Name = b.Name, Location = b.Location })
            .ToListAsync();
    }

    public async Task<BranchDto?> GetByIdAsync(int id)
    {
        var b = await _db.Branches.FindAsync(id);
        if (b == null) return null;
        return new BranchDto { Id = b.Id, Name = b.Name, Location = b.Location };
    }

    public async Task<BranchDto?> UpdateAsync(int id, UpdateBranchDto dto)
    {
        var b = await _db.Branches.FindAsync(id);
        if (b == null) return null;
        b.Name = dto.Name;
        b.Location = dto.Location;
        await _db.SaveChangesAsync();
        return new BranchDto { Id = b.Id, Name = b.Name, Location = b.Location };
    }
}
