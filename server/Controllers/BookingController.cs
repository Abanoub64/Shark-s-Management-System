using backend.Models;
using BarberBooking.API.DTOs;
using BarberBooking.API.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace BarberBooking.API.Controllers;


[ApiController]
[Route("api/[controller]")]
public class BookingController : ControllerBase
{
    private readonly IBookingService _bookingService;
    public BookingController(IBookingService bookingService) => _bookingService = bookingService;

    [HttpGet]
    public async Task<IActionResult> GetAll() => Ok(await _bookingService.GetAllAsync());

    [HttpGet("{id}")]
    public async Task<IActionResult> Get(int id)
    {
        var r = await _bookingService.GetByIdAsync(id);
        return r == null ? NotFound() : Ok(r);
    }

    [HttpPost]
    public async Task<IActionResult> Create(CreateBookingDto dto)
    {
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
    [HttpGet("available-slots")]
    public async Task<IActionResult> GetAvailableSlots(int branchId, int barberId, DateTime date)
    {
        var slots = await _bookingService.GetAvailableSlots(branchId, barberId, date);

        return Ok(slots);
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
        => await _bookingService.DeleteAsync(id) ? Ok(new { message = "Deleted" }) : NotFound();
}
