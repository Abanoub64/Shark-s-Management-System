using backend.DTOs;
using backend.Services;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Threading.Tasks;

namespace backend.Controllers
{
    [ApiController]
    [Route("orders")]
    public class OrdersController : ControllerBase
    {
        private readonly IOrderService _service;

        public OrdersController(IOrderService service)
        {
            _service = service;
        }

        [HttpPost("create-booking")]
        public async Task<IActionResult> CreateBooking([FromBody] CreateBookingDto dto)
        {
            try
            {
                var order = await _service.CreateBookingAsync(dto);
                return CreatedAtAction(nameof(GetById), new { id = order.Id }, order);
            }
            catch (ArgumentException ex)
            {
                return BadRequest(ex.Message);
            }
            catch (InvalidOperationException ex)
            {
                return Conflict(ex.Message);
            }
        }

        [HttpPost("create-product")]
        public async Task<IActionResult> CreateProduct([FromBody] CreateProductOrderDto dto)
        {
            try
            {
                var order = await _service.CreateProductOrderAsync(dto);
                return CreatedAtAction(nameof(GetById), new { id = order.Id }, order);
            }
            catch (ArgumentException ex)
            {
                return BadRequest(ex.Message);
            }
            catch (InvalidOperationException ex)
            {
                return Conflict(ex.Message);
            }
        }

        [HttpPost("confirm/{id}")]
        public async Task<IActionResult> Confirm(Guid id)
        {
            try
            {
                var updated = await _service.ConfirmOrderAsync(id);
                return Ok(updated);
            }
            catch (ArgumentException ex)
            {
                return NotFound(ex.Message);
            }
            catch (InvalidOperationException ex)
            {
                return Conflict(ex.Message);
            }
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(Guid id)
        {
            var order = await _service.GetByIdAsync(id);
            if (order == null) return NotFound();
            return Ok(order);
        }

        [HttpGet("customer/{customerId}")]
        public async Task<IActionResult> GetByCustomer(Guid customerId)
        {
            var orders = await _service.GetByCustomerAsync(customerId);
            return Ok(orders);
        }

        [HttpGet("available-barbers")]
        public async Task<IActionResult> GetAvailableBarbers([FromQuery] DateTime date, [FromQuery] TimeSpan startTime, [FromQuery] int duration)
        {
            var result = await _service.GetAvailableBarbersAsync(date, startTime, duration);
            return Ok(result);
        }

        [HttpGet("barber-available-times")]
        public async Task<IActionResult> GetBarberAvailableTimes([FromQuery] Guid barberId, [FromQuery] DateTime date)
        {
            var times = await _service.GetBarberAvailableTimesAsync(barberId, date);
            return Ok(times);
        }

        [HttpGet("barber-timeslots")]
        public async Task<IActionResult> GetBarberTimeSlots([FromQuery] Guid barberId, [FromQuery] DateTime date, [FromQuery] int duration)
        {
            var slots = await _service.GenerateAvailableTimeSlotsAsync(barberId, date, duration);
            return Ok(slots);
        }
    }
}
