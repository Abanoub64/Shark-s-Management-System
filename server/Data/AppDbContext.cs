using backend.Models;
using Microsoft.EntityFrameworkCore;

namespace backend.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
        {
        }

        public DbSet<Order> Orders => Set<Order>();
        public DbSet<Customer> Customers => Set<Customer>();
        public DbSet<Barber> Barbers => Set<Barber>();
        public DbSet<Service> Services => Set<Service>();
        public DbSet<Product> Products => Set<Product>();
        public DbSet<BarberSchedule> BarberSchedules => Set<BarberSchedule>();

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<Order>(entity =>
            {
                entity.HasKey(o => o.Id);

                entity.HasOne(o => o.Customer).WithMany(c => c.Orders).HasForeignKey(o => o.CustomerId).OnDelete(DeleteBehavior.Restrict);
                entity.HasOne(o => o.Barber).WithMany(b => b.Orders).HasForeignKey(o => o.BarberId).OnDelete(DeleteBehavior.Restrict);
                entity.HasOne(o => o.Service).WithMany(s => s.Orders).HasForeignKey(o => o.ServiceId).OnDelete(DeleteBehavior.Restrict);
                entity.HasOne(o => o.Product).WithMany(p => p.Orders).HasForeignKey(o => o.ProductId).OnDelete(DeleteBehavior.Restrict);
                entity.HasOne(o => o.BarberSchedule).WithOne(bs => bs.Order).HasForeignKey<Order>(o => o.BarberScheduleId).IsRequired(false);

                entity.Property(o => o.Price).HasColumnType("decimal(18,2)");
            });

            modelBuilder.Entity<Customer>(entity =>
            {
                entity.HasKey(c => c.Id);
            });

            modelBuilder.Entity<Barber>(entity =>
            {
                entity.HasKey(b => b.Id);
            });

            modelBuilder.Entity<Service>(entity =>
            {
                entity.HasKey(s => s.Id);
                entity.Property(s => s.Price).HasColumnType("decimal(18,2)");
            });

            modelBuilder.Entity<Product>(entity =>
            {
                entity.HasKey(p => p.Id);
                entity.Property(p => p.Price).HasColumnType("decimal(18,2)");
            });

            modelBuilder.Entity<BarberSchedule>(entity =>
            {
                entity.HasKey(bs => bs.Id);
                entity.HasOne(bs => bs.Barber).WithMany(b => b.Schedules).HasForeignKey(bs => bs.BarberId).OnDelete(DeleteBehavior.Cascade);
            });
        }
    }
}
