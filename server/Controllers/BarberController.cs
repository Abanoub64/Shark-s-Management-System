using BarberBooking.API.DTOs;
using BarberBooking.API.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace BarberBooking.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class BarberController : ControllerBase
{
    private readonly IBarberService _barberService;

    public BarberController(IBarberService barberService) => _barberService = barberService;

    [HttpGet]
    public async Task<IActionResult> GetAll() => Ok(await _barberService.GetAllAsync());

    [HttpGet("{id}")]
    public async Task<IActionResult> Get(int id)
    {
        var r = await _barberService.GetByIdAsync(id);
        return r == null ? NotFound() : Ok(r);
    }

    [HttpGet("by-branch/{branchId}")]
    public async Task<IActionResult> GetByBranch(int branchId)
    {
        var allBarbers = await _barberService.GetAllAsync();
        var branchBarbers = allBarbers.Where(b => b.BranchId == branchId).ToList();
        return Ok(branchBarbers);
    }

    [HttpPost]
    [Authorize(Roles = "Admin,BranchManager")]
    public async Task<IActionResult> Create(CreateBarberDto dto)
    {
        var c = await _barberService.CreateAsync(dto);
        return CreatedAtAction(nameof(Get), new { id = c.Id }, c);
    }

    [HttpPut("{id}")]
    [Authorize(Roles = "Admin,BranchManager")]
    public async Task<IActionResult> Update(int id, UpdateBarberDto dto)
    {
        var r = await _barberService.UpdateAsync(id, dto);
        return r == null ? NotFound() : Ok(r);
    }

    [HttpDelete("{id}")]
    [Authorize(Roles = "Admin,BranchManager")]
    public async Task<IActionResult> Delete(int id)
        => await _barberService.DeleteAsync(id) ? Ok(new { message = "Deleted" }) : NotFound();
}