using System;

namespace BarberBooking.API.DTOs;

public class BookingDto
{
    public int Id { get; set; }
    public int BranchId { get; set; }
    public int ServiceId { get; set; }
    public int? BarberId { get; set; }
    public DateTime StartAt { get; set; }
    public DateTime EndAt { get; set; }
    public string CustomerId { get; set; } = string.Empty;
    public string? PaymentOrderId { get; set; }
    public string? PaymentCapturedId { get; set; }
    public string Status { get; set; } = "Pending";
}

public class CreateBookingDto
{
    public int BranchId { get; set; }
    public int ServiceId { get; set; }
    public int? BarberId { get; set; }
    public DateTime StartAt { get; set; }
    public DateTime EndAt { get; set; }
    public string CustomerId { get; set; } = string.Empty;
}

public class UpdateBookingDto
{
    public DateTime StartAt { get; set; }
    public DateTime EndAt { get; set; }
}

public class BookingSlotDto
{
    public DateTime Time { get; set; }
    public bool IsAvailable { get; set; }
}