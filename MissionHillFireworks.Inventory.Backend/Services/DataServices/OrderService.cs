using Microsoft.EntityFrameworkCore;
using MissionHillFireworks.Inventory.Backend.Infrastructure;

namespace MissionHillFireworks.Inventory.Backend.Services.DataServices
{
    public class OrderService
    {
        private readonly DatabaseContext _context;

        public OrderService(DatabaseContext context)
        {
            _context = context;
        }

        public async Task<List<Order>> GetAllAsync()
        {
            var results = await _context.Orders.ToListAsync();

            return results;
        }

        public async Task<Order> CreateOrUpdateAsync(long? id, string name)
        {
            Order order;

            if (id.HasValue)
            {
                order = await _context.Orders.SingleAsync(o => o.Id == id);
                order.Name = name;
            }
            else
            {
                order = new Order
                {
                    Name = name
                };

                _context.Orders.Add(order);
            }

            await _context.SaveChangesAsync();

            return order;
        }
    }
}
