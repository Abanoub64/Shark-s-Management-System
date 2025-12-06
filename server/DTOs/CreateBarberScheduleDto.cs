namespace backend.DTOs
{
    public class CreateBarberScheduleDto
    {
        public int BarberId { get; set; }
 
        public int DayOfWeek { get; set; }
        public TimeSpan StartTime { get; set; }
        public TimeSpan EndTime { get; set; }
    }
}
