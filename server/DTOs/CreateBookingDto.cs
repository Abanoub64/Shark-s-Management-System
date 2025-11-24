using System;

namespace backend.DTOs
{
    public class CreateBookingDto
    {
        public Guid CustomerId { get; set; }
        public Guid? BarberId { get; set; }
        public Guid ServiceId { get; set; }
        public DateTime Date { get; set; }
        public TimeSpan StartTime { get; set; }

        // for convenience
        public TimeSpan EndTime => StartTime.Add(TimeSpan.FromMinutes(Duration));
        public int Duration { get; set; }
    }
}
