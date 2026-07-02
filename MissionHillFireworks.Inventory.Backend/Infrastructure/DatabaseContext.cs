using Microsoft.EntityFrameworkCore;

namespace MissionHillFireworks.Inventory.Backend.Infrastructure
{
    public class DatabaseContext : DbContext
    {
        public DbSet<Order> Orders { get; set; }
        public DbSet<OrderItem> OrderItems { get; set; }
        public DbSet<OrderIntakeItem> OrderIntakeItems { get; set; }

        public DatabaseContext(DbContextOptions<DatabaseContext> options) : base(options)
        {
        }
    }
}
