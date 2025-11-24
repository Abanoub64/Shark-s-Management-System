using System;

namespace backend.DTOs
{
    public class BarberAvailabilityDto
    {
        public Guid BarberId { get; set; }
        public string BarberName { get; set; } = string.Empty;
    }
}
