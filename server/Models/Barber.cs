using System;
using System.Collections.Generic;

namespace backend.Models
{
    public class Barber
    {
        public Guid Id { get; set; }
        public string Name { get; set; } = string.Empty;

        // Working hours maybe represented as e.g. "09:00-17:00" or other structure; for simplicity use string
        public string AvailableWorkingHours { get; set; } = string.Empty;

        public ICollection<Order>? Orders { get; set; }
        public ICollection<BarberSchedule>? Schedules { get; set; }
    }
}
