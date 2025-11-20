namespace BarberBooking.API.Models;

public class Service
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public decimal Price { get; set; }
    public int BranchId { get; set; }
    public Branch? Branch { get; set; }
}
