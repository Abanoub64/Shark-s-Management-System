using backend.DTOs;
using backend.Models;
using Microsoft.EntityFrameworkCore;

namespace backend.Services
{
    public class BarberScheduleService : IBarberScheduleService
    {
        private readonly AppDbContext _context;

        public BarberScheduleService(AppDbContext context)
        {
            _context = context;
        }

        public async Task<List<BarberScheduleDto>> GetByBarberAsync(int barberId)
        {
            return await _context.BarberSchedules
                .Where(s => s.BarberId == barberId)
                .Select(s => new BarberScheduleDto
                {
                    Id = s.Id,
                    BarberId = barberId,
                    BarberName = s.Barber.FullName,
                    BranchId = s.BranchId,
                    BranchName = s.Branch.Name,
                    DayOfWeek = s.DayOfWeek,
                    StartTime = s.StartTime.ToString(@"hh\:mm"),
                    EndTime = s.EndTime.ToString(@"hh\:mm")
                })
                .ToListAsync();
        }

        public async Task<BarberScheduleDto> CreateAsync(CreateBarberScheduleDto dto)
        {
            // 1) Get barber and his branch
            var barber = await _context.Barbers
                .Include(b => b.Branch)
                .FirstOrDefaultAsync(b => b.Id == dto.BarberId);

            if (barber == null)
                throw new Exception("Barber not found");

            // 2) الفرع ييجي من الحلاق نفسه
            var schedule = new BarberSchedule
            {
                BarberId = dto.BarberId,
                BranchId = barber.BranchId, 
                DayOfWeek = dto.DayOfWeek,
                StartTime = dto.StartTime,
                EndTime = dto.EndTime
            };

            _context.BarberSchedules.Add(schedule);
            await _context.SaveChangesAsync();

            return new BarberScheduleDto
            {
                Id = schedule.Id,
                BarberId = schedule.BarberId,
                BarberName = barber.FullName,
                BranchId = barber.BranchId,
                BranchName = barber.Branch.Name,
                DayOfWeek = schedule.DayOfWeek,
                StartTime = schedule.StartTime.ToString(@"hh\:mm"),
                EndTime = schedule.EndTime.ToString(@"hh\:mm")
            };
        }

    }
}
