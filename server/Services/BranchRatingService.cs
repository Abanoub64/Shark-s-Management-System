using backend.DTOs;
using backend.Models;
using Microsoft.EntityFrameworkCore;

namespace backend.Services
{
    public class BranchRatingService
    {
        private readonly AppDbContext _context;

        public BranchRatingService(AppDbContext context)
        {
            _context = context;
        }

        public async Task<string> AddRatingAsync(BranchRatingDto dto)
        {
            // Check if user rated today
            bool alreadyRatedToday = await _context.BranchRatings
                .AnyAsync(r =>
                    r.BranchId == dto.BranchId &&
                    r.Mobile == dto.Mobile &&
                    r.CreatedAt.Date == DateTime.Today
                );

            if (alreadyRatedToday)
                return "You already rated this branch today.";

            var rating = new BranchRating
            {
                BranchId = dto.BranchId,
                Mobile = dto.Mobile,
                Rating = dto.Rating
            };

            await _context.BranchRatings.AddAsync(rating);
            await _context.SaveChangesAsync();

            return "Rating submitted successfully.";
        }

        public async Task<double> GetBranchAverageRating(int branchId)
        {
            return await _context.BranchRatings
                .Where(r => r.BranchId == branchId)
                .AverageAsync(r => (double)r.Rating);
        }
    }
}
