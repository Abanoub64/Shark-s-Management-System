using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace backend.Models
{
    public enum OrderType
    {
        Booking,
        Product
    }

    public enum OrderStatus
    {
        Pending,
        Confirmed,
        Done,
        Canceled
    }

    public class Order
    {
        public Guid Id { get; set; }

        public Guid CustomerId { get; set; }
        public Customer? Customer { get; set; }

        public Guid? BarberId { get; set; }
        public Barber? Barber { get; set; }

        public Guid? ServiceId { get; set; }
        public Service? Service { get; set; }

        public Guid? ProductId { get; set; }
        public Product? Product { get; set; }

        public OrderType OrderType { get; set; }

        public DateTime Date { get; set; }

        public TimeSpan StartTime { get; set; }
        public TimeSpan EndTime { get; set; }
        public int Duration { get; set; }

        [Column(TypeName = "decimal(18,2)")]
        public decimal Price { get; set; }

        public OrderStatus Status { get; set; } = OrderStatus.Pending;

        public Guid? BarberScheduleId { get; set; }
        public BarberSchedule? BarberSchedule { get; set; }
    }
}
