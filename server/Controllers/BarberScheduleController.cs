using backend.DTOs;
using backend.Services;
using BarberBooking.API.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class BarberScheduleController : ControllerBase
    {
        private readonly IBarberScheduleService _service;
        private readonly IBarberService _barberService; 

        public BarberScheduleController(
            IBarberScheduleService service,
            IBarberService barberService)
        {
            _service = service;
            _barberService = barberService;
        }

        [HttpGet("by-barber/{barberId}")]
        public async Task<IActionResult> GetByBarber(int barberId)
        {
            return Ok(await _service.GetByBarberAsync(barberId));
        }

        [HttpPost]
        [Authorize(Roles = "Admin,BranchManager")]
        public async Task<IActionResult> Create(CreateBarberScheduleDto dto)
        {
            if (User.IsInRole("BranchManager"))
            {
                var managerBranchId = User.FindFirst("BranchId")?.Value;
                if (managerBranchId == null)
                    return Unauthorized(new { message = "Branch not assigned." });


                var barber = await _barberService.GetByIdAsync(dto.BarberId);
                if (barber == null)
                    return NotFound(new { message = "Barber not found." });

             
                if (barber.BranchId.ToString() != managerBranchId)
                {
                    return Unauthorized(new
                    {
                        message = "You cannot create schedules for barbers in another branch."
                    });
                }
            }

            var result = await _service.CreateAsync(dto);
            return Ok(result);
        }
    }
}
