using backend.DTOs;

namespace backend.Services
{
    public interface IBarberScheduleService
    {
        Task<List<BarberScheduleDto>> GetByBarberAsync(int barberId);
        Task<BarberScheduleDto> CreateAsync(CreateBarberScheduleDto dto);
    }
}
