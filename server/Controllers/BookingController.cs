using System.Security.Claims;
using BarberBooking.API.DTOs;
using BarberBooking.API.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace BarberBooking.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class BookingController : ControllerBase
{
    private readonly IBookingService _bookingService;
    public BookingController(IBookingService bookingService) => _bookingService = bookingService;

    [HttpGet]
    [Authorize(Roles = "Admin,BranchManager")]
    public async Task<IActionResult> GetAll() => Ok(await _bookingService.GetAllAsync());

    [HttpGet("{id}")]
    public async Task<IActionResult> Get(int id)
    {
        var r = await _bookingService.GetByIdAsync(id);
        return r == null ? NotFound() : Ok(r);
    }

    [HttpGet("slots")]
    public async Task<IActionResult> GetSlots([FromQuery] int barberId, [FromQuery] DateTime date)
    {
        return Ok(await _bookingService.GetAvailableSlotsAsync(barberId, date));
    }

    [HttpGet("my-history")]
    public async Task<IActionResult> GetMyHistory()
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (userId == null) return Unauthorized();
        return Ok(await _bookingService.GetCustomerBookingsAsync(userId));
    }

    [HttpPut("{id}/status")]
    [Authorize(Roles = "Admin,BranchManager")]
    public async Task<IActionResult> UpdateStatus(int id, [FromQuery] string status)
    {
        var result = await _bookingService.UpdateStatusAsync(id, status);
        return result ? Ok(new { message = "Status updated" }) : NotFound();
    }

    [HttpPost]
    public async Task<IActionResult> Create(CreateBookingDto dto)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (userId == null) return Unauthorized();

        dto.CustomerId = userId;

        try
        {
            var c = await _bookingService.CreateAsync(dto);
            return CreatedAtAction(nameof(Get), new { id = c.Id }, c);
        }
        catch (Exception ex)
        {
            return BadRequest(new { error = ex.Message });
        }
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Update(int id, UpdateBookingDto dto)
    {
        try
        {
            var r = await _bookingService.UpdateAsync(id, dto);
            return r == null ? NotFound() : Ok(r);
        }
        catch (Exception ex)
        {
            return BadRequest(new { error = ex.Message });
        }
    }

    [HttpDelete("{id}")]
    [Authorize(Roles = "Admin,BranchManager")]
    public async Task<IActionResult> Delete(int id)
        => await _bookingService.DeleteAsync(id) ? Ok(new { message = "Deleted" }) : NotFound();
}