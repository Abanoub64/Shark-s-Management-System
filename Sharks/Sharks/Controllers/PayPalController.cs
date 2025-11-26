//using BarberBooking.API.Data;
//using Microsoft.AspNetCore.Http;
//using Microsoft.AspNetCore.Mvc;
//using Sharks.Services;

//namespace Sharks.Controllers
//{
//    [Route("api/[controller]")]
//    [ApiController]
//    public class PayPalController : ControllerBase

//    {
//        private readonly PayPalService _paypal;
//        private readonly AppDbContext _db;
//        public PayPalController(PayPalService paypal, AppDbContext db)
//        {
//            _paypal = paypal;
//            _db = db;
//        }

//        [HttpPost("create-order")]
//        public async Task<IActionResult> CreateOrder([FromBody] CreateOrderRequest req)
//        {
//            var order = await _paypal.CreateOrder(req.Amount, req.Currency ?? "USD");

//            if (req.BookingId.HasValue)
//            {
//                var booking = await _db.Bookings.FindAsync(req.BookingId.Value);
//                if (booking != null)
//                {
//                    booking.PaymentOrderId = order.Id;
//                    booking.Status = "PendingPayment";
//                    await _db.SaveChangesAsync();
//                }
//            }

//            var approvalUrl = order.Links.FirstOrDefault(x => x.Rel == "approve")?.Href;

//            return Ok(new { orderId = order.Id, approvalUrl });
//        }

//        [HttpPost("capture-order/{orderId}")]
//        public async Task<IActionResult> CaptureOrder(string orderId, [FromBody] CaptureOrderRequest req)
//        {
//            var result = await _paypal.CaptureOrder(orderId);

//            if (req.BookingId.HasValue)
//            {
//                var booking = await _db.Bookings.FindAsync(req.BookingId.Value);
//                if (booking != null)
//                {
//                    booking.Status = "Confirmed";
//                    booking.PaymentCapturedId = orderId;
//                    await _db.SaveChangesAsync();
//                }
//            }

//            return Ok(result);
//        }
//    }

//    public class CreateOrderRequest
//    {
//        public decimal Amount { get; set; }
//        public string? Currency { get; set; }
//        public int? BookingId { get; set; }
//    }

//    public class CaptureOrderRequest
//    {
//        public int? BookingId { get; set; }
//    }
//}

using BarberBooking.API.Data;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Sharks.Services;
using PayPalHttp;

namespace Sharks.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PayPalController : ControllerBase
    {
        private readonly PayPalService _paypal;
        private readonly AppDbContext _db;

        public PayPalController(PayPalService paypal, AppDbContext db)
        {
            _paypal = paypal;
            _db = db;
        }

        // ==========================
        // إنشاء طلب الدفع (Create Order)
        // ==========================
        [HttpPost("create-order")]
        public async Task<IActionResult> CreateOrder([FromBody] CreateOrderRequest req)
        {
            if (req.Amount <= 0)
                return BadRequest(new { message = "Amount must be greater than 0" });

            try
            {
                // إنشاء الطلب في PayPal
                var order = await _paypal.CreateOrder(req.Amount, req.Currency ?? "USD");

                // ربط الطلب بالحجز إن وجد
                if (req.BookingId.HasValue)
                {
                    var booking = await _db.Bookings.FindAsync(req.BookingId.Value);
                    if (booking != null)
                    {
                        booking.PaymentOrderId = order.Id;
                        booking.Status = "PendingPayment";
                        await _db.SaveChangesAsync();
                    }
                    else
                    {
                        return NotFound(new { message = "Booking not found" });
                    }
                }

                // جلب رابط الموافقة
                var approvalUrl = order.Links.FirstOrDefault(x => x.Rel == "approve")?.Href;

                return Ok(new
                {
                    orderId = order.Id,
                    approvalUrl
                });
            }
            catch (HttpException ex)
            {
                // معالجة أخطاء PayPal
                return StatusCode((int)ex.StatusCode, new { message = ex.Message });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = ex.Message });
            }
        }
        [HttpGet("return")]
        public async Task<IActionResult> PayPalReturn([FromQuery] string token)
        {
            if (string.IsNullOrEmpty(token))
                return BadRequest("Token missing");

            try
            {
                // محاولة أخذ تفاصيل الطلب قبل الـ capture
                var orderDetails = await _paypal.GetOrderDetails(token);

                if (orderDetails.Status == "COMPLETED")
                {
                    return Ok(new { message = "Order already completed", orderDetails });
                }

                var result = await _paypal.CaptureOrder(token);

                return Ok(new
                {
                    message = "Payment captured successfully",
                    data = result
                });
            }
            catch (HttpException ex)
            {
                return StatusCode((int)ex.StatusCode, new
                {
                    message = ex.Message,
 
                });
            }
        }




        // ==========================
        // صفحة الرجوع عند الإلغاء
        // ==========================
        [HttpGet("cancel")]
        public IActionResult PayPalCancel()
        {
            return Ok(new { message = "Payment was cancelled" });
        }
        // ==========================
        // تأكيد الدفع (Capture Order)
        // ==========================
        [HttpPost("capture-order/{orderId}")]
        public async Task<IActionResult> CaptureOrder(string orderId, [FromBody] CaptureOrderRequest req)
        {
            if (string.IsNullOrEmpty(orderId))
                return BadRequest(new { message = "OrderId is required" });

            try
            {
                // تنفيذ Capture في PayPal
                var result = await _paypal.CaptureOrder(orderId);

                // تحديث حالة الحجز إذا تم تمرير BookingId
                if (req.BookingId.HasValue)
                {
                    var booking = await _db.Bookings.FindAsync(req.BookingId.Value);
                    if (booking != null)
                    {
                        booking.Status = "Confirmed";
                        booking.PaymentCapturedId = orderId;
                        await _db.SaveChangesAsync();
                    }
                    else
                    {
                        return NotFound(new { message = "Booking not found" });
                    }
                }

                return Ok(result);
            }
            catch (HttpException ex)
            {
                // إذا لم يوافق المستخدم بعد
                if (ex.StatusCode == System.Net.HttpStatusCode.UnprocessableEntity)
                {
                    return BadRequest(new
                    {
                        message = "Payment not approved yet. Please make sure user has approved the order.",
                        details = ex.Message
                    });
                }

                return StatusCode((int)ex.StatusCode, new { message = ex.Message });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = ex.Message });
            }
        }
    }

    // ==========================
    // DTOs
    // ==========================
    public class CreateOrderRequest
    {
        public decimal Amount { get; set; }
        public string? Currency { get; set; }
        public int? BookingId { get; set; }
    }

    public class CaptureOrderRequest
    {
        public int? BookingId { get; set; }
    }
}
