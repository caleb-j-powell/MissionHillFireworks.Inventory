using Microsoft.EntityFrameworkCore;
using MissionHillFireworks.Inventory.Backend.Infrastructure;

namespace MissionHillFireworks.Inventory.Backend.Services.DataServices
{
    public class OrderIntakeItemService
    {
        private readonly DatabaseContext _context;

        public OrderIntakeItemService(DatabaseContext context)
        {
            _context = context;
        }

        public async Task<OrderIntakeItem> AddAsync(long orderId, string upc)
        {
            var item = await _context.OrderIntakeItems.SingleOrDefaultAsync(o => o.UPC == upc);

            if (item is null)
            {
                item = new OrderIntakeItem
                {
                    Count = 1,
                    OrderId = orderId,
                    UPC = upc,
                };

                _context.OrderIntakeItems.Add(item);
            }
            else
            {
                item.Count++;
            }    

            await _context.SaveChangesAsync();

            return item;
        }
    }
}
