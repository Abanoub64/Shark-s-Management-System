using System;

namespace backend.DTOs
{
    public class CreateProductOrderDto
    {
        public Guid CustomerId { get; set; }
        public Guid ProductId { get; set; }
        public int Quantity { get; set; }
    }
}
