namespace backend.Models
{
    public class BranchRating
    {
        public int Id { get; set; }

        public int BranchId { get; set; }
        public Branch Branch { get; set; }

        public string Mobile { get; set; } // رقم الموبايل

        public float Rating { get; set; } // من 1 لـ 5

        public DateTime CreatedAt { get; set; } = DateTime.Now;
    }
}
