namespace BarberBooking.API.DTOs;

public class BarberDto
{
    public int Id { get; set; }
    public string FullName { get; set; } = string.Empty;
    public int BranchId { get; set; }
}

public class CreateBarberDto
{
    public string FullName { get; set; } = string.Empty;
    public int BranchId { get; set; }
}

public class UpdateBarberDto
{
    public string FullName { get; set; } = string.Empty;
    public int BranchId { get; set; }
}
