using backend.DTOs;
using backend.Services;
using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class BranchRatingController : ControllerBase
    {
        private readonly BranchRatingService _ratingService;

        public BranchRatingController(BranchRatingService ratingService)
        {
            _ratingService = ratingService;
        }

        [HttpPost("rate")]
        public async Task<IActionResult> Rate([FromBody] BranchRatingDto dto)
        {
            var result = await _ratingService.AddRatingAsync(dto);
            return Ok(new { message = result });
        }
    }
}
