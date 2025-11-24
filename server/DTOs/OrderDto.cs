using System;

namespace backend.DTOs
{
    public class OrderDto
    {
        public Guid Id { get; set; }
        public Guid CustomerId { get; set; }
        public Guid? BarberId { get; set; }
        public Guid? ServiceId { get; set; }
        public Guid? ProductId { get; set; }
        public string OrderType { get; set; } = string.Empty;
        public DateTime Date { get; set; }
        public TimeSpan StartTime { get; set; }
        public TimeSpan EndTime { get; set; }
        public int Duration { get; set; }
        public decimal Price { get; set; }
        public string Status { get; set; } = string.Empty;
        public Guid? BarberScheduleId { get; set; }
    }
}
