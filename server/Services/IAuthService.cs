using backend.DTOs;

namespace backend.Services
{
    public interface IAuthService
    {
        Task<AuthResponseDto> RegisterAsync(RegisterDto model);
        Task<AuthResponseDto> LoginAsync(LoginDto model);
        Task<AuthResponseDto> RefreshTokenAsync(TokenRequestDto model);
        Task<AuthResponseDto> LoginWithExternalAsync(string email, string? firstName = null, string? lastName = null);

    }
}