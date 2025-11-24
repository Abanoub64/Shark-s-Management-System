using System;
using System.Collections.Generic;

namespace backend.Models
{
    public class Service
    {
        public Guid Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public int DurationInMinutes { get; set; }
        public decimal Price { get; set; }

        public ICollection<Order>? Orders { get; set; }
    }
}
