using System;

namespace backend.Models
{
    public class BarberSchedule
    {
        public Guid Id { get; set; }
        public Guid BarberId { get; set; }
        public Barber? Barber { get; set; }

        public DateTime Date { get; set; }
        public TimeSpan StartTime { get; set; }
        public TimeSpan EndTime { get; set; }
        public bool IsBooked { get; set; }

        public Order? Order { get; set; }
    }
}
