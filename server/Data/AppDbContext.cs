using backend.Models;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace backend.Models
{
    public class AppDbContext : IdentityDbContext<ApplicationUser>
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

        public DbSet<Branch> Branches => Set<Branch>();
        public DbSet<Barber> Barbers => Set<Barber>();
        public DbSet<Service> Services => Set<Service>();
        public DbSet<Booking> Bookings => Set<Booking>();
        public DbSet<BarberSchedule> BarberSchedules => Set<BarberSchedule>();
        public DbSet<Product> Products => Set<Product>();


        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // ========== Branch ==========
            modelBuilder.Entity<Branch>(b =>
            {
                b.HasKey(x => x.Id);
                b.Property(x => x.Name).IsRequired().HasMaxLength(200);
            });

            // ========== Service ==========
            modelBuilder.Entity<Service>(s =>
            {
                s.HasKey(x => x.Id);
                s.Property(x => x.Name).IsRequired().HasMaxLength(200);
                s.Property(x => x.Price).HasPrecision(18, 2);
            });

            modelBuilder.Entity<Barber>()
              .HasOne(b => b.Branch)
              .WithMany(br => br.Staff) 
              .HasForeignKey(b => b.BranchId)
              .OnDelete(DeleteBehavior.Restrict);


            modelBuilder.Entity<BarberSchedule>()
                .HasOne(bs => bs.Branch)
                .WithMany() 
                .HasForeignKey(bs => bs.BranchId)
                .OnDelete(DeleteBehavior.Restrict);

            
            modelBuilder.Entity<BarberSchedule>()
                .HasOne(bs => bs.Barber)
                .WithMany(b => b.Schedules) 
                .HasForeignKey(bs => bs.BarberId)
                .OnDelete(DeleteBehavior.Restrict);
        }
    }
}
