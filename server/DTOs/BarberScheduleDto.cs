namespace backend.DTOs // تأكد من الـ Namespace الصحيح عندك
{
    public class BarberScheduleDto
    {
        public int Id { get; set; }
        public int BarberId { get; set; }
        public string BarberName { get; set; } = string.Empty;

        public int BranchId { get; set; }
        public string BranchName { get; set; } = string.Empty; 

        public int DayOfWeek { get; set; }

        public string StartTime { get; set; } = string.Empty;
        public string EndTime { get; set; } = string.Empty;
    }
}