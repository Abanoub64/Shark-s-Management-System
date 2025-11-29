using System;

namespace BarberBooking.API.Models;

public class Booking
{
    public int Id { get; set; }
    public int BranchId { get; set; }
    public int ServiceId { get; set; }
    public int? BarberId { get; set; }
    public DateTime StartAt { get; set; }
    public DateTime EndAt { get; set; }
    public string CustomerId { get; set; } = string.Empty;
    // === Added for PayPal Integration ===
    public string? PaymentOrderId { get; set; }
    public string? PaymentCapturedId { get; set; }
    public string Status { get; set; } = "Pending";
}
