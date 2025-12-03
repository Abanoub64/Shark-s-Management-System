namespace backend.DTOs
{
    public class BarberScheduleDto
    {
        public int Id { get; set; }
        public int BarberId { get; set; }
        public string BarberName { get; set; }
        public int BranchId { get; set; }
        public string BranchName { get; set; }
        public int DayOfWeek { get; set; }
        public string StartTime { get; set; }
        public string EndTime { get; set; }
    }
}