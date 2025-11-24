using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TestController : ControllerBase
    {
        [HttpGet("secure-data")]
        [Authorize]
        public IActionResult GetSecureData()
        {
            return Ok(new { message = "welcome to secure data" });
        }

        [HttpGet("admin-only")]
        [Authorize(Roles = "Admin")]
        public IActionResult GetAdminData()
        {
            return Ok(new { message = "This is secure data for admin" });
        }
    }
}