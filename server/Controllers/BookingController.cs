using backend.Models;
using BarberBooking.API.DTOs;
using BarberBooking.API.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace BarberBooking.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class BookingController : ControllerBase
{
    private readonly IBookingService _bookingService;
    private readonly IBarberService _barberService;

    public BookingController(IBookingService bookingService, IBarberService barberService)
    {
        _bookingService = bookingService;
        _barberService = barberService;
    }

    // ================================
    // GET MANAGER BRANCH
    // ================================
    private int? GetManagerBranchId()
    {
        if (!User.IsInRole("BranchManager"))
            return null;

        var branchClaim = User.FindFirst("BranchId")?.Value;
        return branchClaim != null ? int.Parse(branchClaim) : null;
    }

    // ================================
    // CHECK IF BOOKING BELONGS TO MANAGER BRANCH
    // ================================
    private async Task<bool> IsBookingFromMyBranch(int bookingId)
    {
        var managerBranchId = GetManagerBranchId();
        if (managerBranchId == null)
            return true; // Admin

        var booking = await _bookingService.GetByIdAsync(bookingId);
        if (booking == null)
            return false;

        var barber = await _barberService.GetByIdAsync(booking.BarberId);
        if (barber == null)
            return false;

        return barber.BranchId == managerBranchId;
    }

    // ================================
    // GET ALL BOOKINGS
    // ================================
    [HttpGet]
    [Authorize(Roles = "Admin,BranchManager")]
    public async Task<IActionResult> GetAll()
    {
        if (User.IsInRole("Admin"))
            return Ok(await _bookingService.GetAllAsync());

        var branchId = GetManagerBranchId();
        if (branchId == null)
            return Unauthorized(new { message = "BranchId claim missing for BranchManager." });

        var all = await _bookingService.GetAllAsync();
        var filtered = all.Where(b => b.BranchId == branchId);

        return Ok(filtered);
    }

    // ================================
    // GET BOOKING BY ID
    // ================================
    [HttpGet("{id}")]
    public async Task<IActionResult> Get(int id)
    {
        var booking = await _bookingService.GetByIdAsync(id);
        if (booking == null)
            return NotFound();

        // Admin sees all
        if (User.IsInRole("Admin"))
            return Ok(booking);

        // BranchManager -- check branch match
        var branchId = GetManagerBranchId();
        if (branchId == null)
            return Unauthorized(new { message = "BranchManager must have BranchId claim." });

        if (booking.BranchId != branchId)
            return Unauthorized(new { message = "You cannot view bookings from another branch." });

        return Ok(booking);
    }

    // ================================
    // CUSTOMER HISTORY
    // ================================
    [HttpGet("my-history")]
    public async Task<IActionResult> GetMyHistory()
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (userId == null) return Unauthorized();

        return Ok(await _bookingService.GetCustomerBookingsAsync(userId));
    }

    // ================================
    // UPDATE STATUS
    // ================================
    [HttpPut("{id}/status")]
    [Authorize(Roles = "Admin,BranchManager")]
    public async Task<IActionResult> UpdateStatus(int id, [FromQuery] string status)
    {
        // BranchManager cannot modify booking outside his branch
        if (!await IsBookingFromMyBranch(id))
            return Unauthorized(new { message = "You cannot modify status of bookings from another branch." });

        var result = await _bookingService.UpdateStatusAsync(id, status);

        return result
            ? Ok(new { message = "Status updated" })
            : NotFound();
    }

    // ================================
    // CREATE BOOKING (CUSTOMER ONLY)
    // ================================
    [HttpPost]
    public async Task<IActionResult> Create(CreateBookingDto dto)
    {
        // هوية العميل
        dto.CustomerId = User.FindFirstValue(ClaimTypes.NameIdentifier);

        // هات بيانات الحلاق
        var barber = await _barberService.GetByIdAsync(dto.BarberId);
        if (barber == null)
            return BadRequest(new { message = "Invalid BarberId" });

        // مدير الفرع ممنوع يحجز لغير فرعه
        var managerBranchId = GetManagerBranchId();
        if (managerBranchId != null && managerBranchId != barber.BranchId)
            return Unauthorized(new { message = "You cannot create bookings for another branch." });

        // إنشاء الحجز
        var created = await _bookingService.CreateAsync(new CreateBookingDto
        {
            ServiceId = dto.ServiceId,
            BarberId = dto.BarberId,
            StartAt = dto.StartAt,
            EndAt = dto.EndAt,
            CustomerId = dto.CustomerId
        });

        return CreatedAtAction(nameof(Get), new { id = created.Id }, created);
    }


    // ================================
    // UPDATE BOOKING
    // ================================
    [HttpPut("{id}")]
    public async Task<IActionResult> Update(int id, UpdateBookingDto dto)
    {
        // BranchManager cannot update booking outside his branch
        if (!await IsBookingFromMyBranch(id))
            return Unauthorized(new { message = "You cannot update bookings from another branch." });

        var updated = await _bookingService.UpdateAsync(id, dto);

        return updated == null
            ? NotFound()
            : Ok(updated);
    }


    // ================================
    // AVAILABLE SLOTS BY BRANCH
    // ================================
    [HttpGet("available-slots")]
    public async Task<IActionResult> GetAvailableSlots(int branchId, int barberId, DateTime date)
    {
        var slots = await _bookingService.GetAvailableSlots(branchId, barberId, date);
        return Ok(slots);
    }

    // ================================
    // DELETE BOOKING
    // ================================
    [HttpDelete("{id}")]
    [Authorize(Roles = "Admin,BranchManager")]
    public async Task<IActionResult> Delete(int id)
    {
        // BranchManager cannot delete booking outside his branch
        if (!await IsBookingFromMyBranch(id))
            return Unauthorized(new { message = "You cannot delete bookings from another branch." });

        var deleted = await _bookingService.DeleteAsync(id);

        return deleted
            ? Ok(new { message = "Deleted" })
            : NotFound();
    }

}
