using backend.DTOs;

namespace backend.Services
{
    public interface IDashboardService
    {
        Task<DashboardFullDto> GetDashboardAsync(int? branchId = null);
    }
}
