using System;
using System.Collections.Generic;

namespace backend.Models
{
    public class Customer
    {
        public Guid Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string Phone { get; set; } = string.Empty;

        public ICollection<Order>? Orders { get; set; }
    }
}
