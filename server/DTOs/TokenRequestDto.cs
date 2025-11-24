using System.ComponentModel.DataAnnotations;

namespace backend.DTOs
{
    public class TokenRequestDto
    {
        [Required]
        public string Token { get; set; } = string.Empty;

        [Required]
        public string RefreshToken { get; set; } = string.Empty;
    }
}