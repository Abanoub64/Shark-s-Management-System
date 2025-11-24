using backend.DTOs;
using backend.Models;
using backend.Repositories;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace backend.Services
{
    public class OrderService : IOrderService
    {
        private readonly IOrderRepository _repo;

        public OrderService(IOrderRepository repo)
        {
            _repo = repo;
        }

        public async Task<OrderDto> CreateBookingAsync(CreateBookingDto dto)
        {
            // Validate service and customer
            var service = await _repo.GetServiceByIdAsync(dto.ServiceId);
            if (service == null) throw new ArgumentException("Service not found");

            // calculate end time
            var endTime = dto.StartTime.Add(TimeSpan.FromMinutes(service.DurationInMinutes));

            // check availability
            var occupied = await _repo.GetSchedulesForDateAsync(dto.Date);
            var conflict = occupied.Any(s =>
                !(dto.EndTime <= s.StartTime || dto.StartTime >= s.EndTime) && s.IsBooked && s.BarberId == dto.BarberId);

            if (dto.BarberId.HasValue && conflict)
                throw new InvalidOperationException("Selected barber is not available at the chosen time");

            var order = new Order
            {
                Id = Guid.NewGuid(),
                CustomerId = dto.CustomerId,
                BarberId = dto.BarberId,
                ServiceId = dto.ServiceId,
                OrderType = OrderType.Booking,
                Date = dto.Date,
                StartTime = dto.StartTime,
                EndTime = endTime,
                Duration = service.DurationInMinutes,
                Price = service.Price,
                Status = OrderStatus.Pending
            };

            await _repo.AddAsync(order);
            await _repo.SaveChangesAsync();

            return MapToDto(order);
        }

        public async Task<OrderDto> CreateProductOrderAsync(CreateProductOrderDto dto)
        {
            var product = await _repo.GetProductByIdAsync(dto.ProductId);
            if (product == null) throw new ArgumentException("Product not found");
            if (product.Stock < dto.Quantity) throw new InvalidOperationException("Insufficient stock");

            product.Stock -= dto.Quantity;

            var order = new Order
            {
                Id = Guid.NewGuid(),
                CustomerId = dto.CustomerId,
                ProductId = dto.ProductId,
                OrderType = OrderType.Product,
                Date = DateTime.UtcNow,
                StartTime = TimeSpan.Zero,
                EndTime = TimeSpan.Zero,
                Duration = 0,
                Price = product.Price * dto.Quantity,
                Status = OrderStatus.Pending
            };

            await _repo.AddAsync(order);
            await _repo.SaveChangesAsync();

            return MapToDto(order);
        }

        public async Task<OrderDto> ConfirmOrderAsync(Guid orderId)
        {
            var order = await _repo.GetByIdAsync(orderId);
            if (order == null) throw new ArgumentException("Order not found");

            if (order.OrderType == OrderType.Booking)
            {
                // find or create schedule
                var schedules = await _repo.GetSchedulesForBarberAndDateAsync(order.BarberId!.Value, order.Date);
                var target = schedules.FirstOrDefault(s => s.StartTime <= order.StartTime && s.EndTime >= order.EndTime && !s.IsBooked);
                if (target == null)
                {
                    // create a schedule slot
                    target = new BarberSchedule
                    {
                        Id = Guid.NewGuid(),
                        BarberId = order.BarberId!.Value,
                        Date = order.Date,
                        StartTime = order.StartTime,
                        EndTime = order.EndTime,
                        IsBooked = true
                    };
                    await _repo.AddScheduleAsync(target);
                }
                else
                {
                    target.IsBooked = true;
                    await _repo.UpdateScheduleAsync(target);
                }

                order.Status = OrderStatus.Confirmed;
                order.BarberScheduleId = target.Id;
            }
            else if (order.OrderType == OrderType.Product)
            {
                order.Status = OrderStatus.Confirmed;
            }

            await _repo.UpdateAsync(order);
            await _repo.SaveChangesAsync();

            return MapToDto(order);
        }

        public async Task<OrderDto?> GetByIdAsync(Guid id)
        {
            var order = await _repo.GetByIdAsync(id);
            return order == null ? null : MapToDto(order);
        }

        public async Task<IEnumerable<OrderDto>> GetByCustomerAsync(Guid customerId)
        {
            var orders = await _repo.GetByCustomerAsync(customerId);
            return orders.Select(o => MapToDto(o));
        }

        public async Task<IEnumerable<BarberAvailabilityDto>> GetAvailableBarbersAsync(DateTime date, TimeSpan startTime, int duration)
        {
            var endTime = startTime.Add(TimeSpan.FromMinutes(duration));
            var barbers = await _repo.GetAllBarbersAsync();
            var schedules = await _repo.GetSchedulesForDateAsync(date);

            var result = new List<BarberAvailabilityDto>();

            foreach (var barber in barbers)
            {
                var barberSchedules = schedules.Where(s => s.BarberId == barber.Id && s.Date.Date == date.Date && s.IsBooked).ToList();
                var conflict = barberSchedules.Any(s => !(endTime <= s.StartTime || startTime >= s.EndTime));
                if (!conflict)
                {
                    result.Add(new BarberAvailabilityDto { BarberId = barber.Id, BarberName = barber.Name });
                }
            }

            return result;
        }

        public async Task<IEnumerable<TimeSpan>> GetBarberAvailableTimesAsync(Guid barberId, DateTime date)
        {
            // Generate list of available times as TimeSpan for the date using default duration (e.g., 30 mins)
            var slots = await GenerateAvailableTimeSlotsAsync(barberId, date, 30);
            return slots.Select(dt => dt.TimeOfDay);
        }

        public async Task<IEnumerable<DateTime>> GenerateAvailableTimeSlotsAsync(Guid barberId, DateTime date, int serviceDurationInMinutes)
        {
            // Barber works from 10:00 of given date to 02:00 next day
            var workStart = date.Date.AddHours(10); // 10:00 on date
            var workEnd = date.Date.AddDays(1).AddHours(2); // 02:00 next day

            var availability = new List<DateTime>();

            var slotDuration = TimeSpan.FromMinutes(serviceDurationInMinutes);

            // Collect booked schedules that overlap the working window
            var busySchedules = (await _repo.GetSchedulesForBarberInRangeAsync(barberId, workStart, workEnd))
                                .Where(s => s.IsBooked)
                                .Select(s =>
                                {
                                    var sStart = s.Date.Date + s.StartTime;
                                    var sEnd = s.Date.Date + s.EndTime;
                                    if (s.EndTime <= s.StartTime) sEnd = sEnd.AddDays(1);
                                    return new { Start = sStart, End = sEnd };
                                })
                                .OrderBy(s => s.Start)
                                .ToList();

            // iterate slots from workStart to workEnd - slotDuration
            for (var cursor = workStart; cursor.Add(slotDuration) <= workEnd; cursor = cursor.AddMinutes(5)) // step 5 minutes granularity
            {
                var slotStart = cursor;
                var slotEnd = cursor.Add(slotDuration);

                // check overlap with busy schedules
                var conflict = busySchedules.Any(b => !(slotEnd <= b.Start || slotStart >= b.End));
                if (!conflict)
                {
                    availability.Add(slotStart);
                }
            }

            return availability;
        }

        private OrderDto MapToDto(Order o)
        {
            return new OrderDto
            {
                Id = o.Id,
                CustomerId = o.CustomerId,
                BarberId = o.BarberId,
                ServiceId = o.ServiceId,
                ProductId = o.ProductId,
                OrderType = o.OrderType.ToString(),
                Date = o.Date,
                StartTime = o.StartTime,
                EndTime = o.EndTime,
                Duration = o.Duration,
                Price = o.Price,
                Status = o.Status.ToString(),
                BarberScheduleId = o.BarberScheduleId
            };
        }
    }
}
