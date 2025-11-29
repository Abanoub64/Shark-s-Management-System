namespace BarberBooking.API.Models;

public class Branch
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Location { get; set; } = string.Empty;

    public List<Barber> Staff { get; set; } = new();
    public List<Service> Services { get; set; } = new();
}
