using backend.DTOs;
using backend.Services;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class BarberScheduleController : ControllerBase
    {
        private readonly IBarberScheduleService _service;

        public BarberScheduleController(IBarberScheduleService service)
        {
            _service = service;
        }

        [HttpGet("by-barber/{barberId}")]
        public async Task<IActionResult> GetByBarber(int barberId)
        {
            return Ok(await _service.GetByBarberAsync(barberId));
        }

        [HttpPost]
        public async Task<IActionResult> Create(CreateBarberScheduleDto dto)
        {
            return Ok(await _service.CreateAsync(dto));
        }
    }
}
