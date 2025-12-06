namespace backend.Models
{
    public class BarberSchedule
    {
        public int Id { get; set; }

        public int BarberId { get; set; }
        public Barber Barber { get; set; } = null!;

        public int BranchId { get; set; }
        public Branch Branch { get; set; } = null!;

        public int DayOfWeek { get; set; }
        public TimeSpan StartTime { get; set; }
        public TimeSpan EndTime { get; set; }
    }

}
