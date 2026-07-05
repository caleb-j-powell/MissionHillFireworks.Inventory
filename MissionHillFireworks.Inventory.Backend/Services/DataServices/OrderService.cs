using Microsoft.EntityFrameworkCore;
using MissionHillFireworks.Inventory.Backend.Infrastructure;
using MissionHillFireworks.Inventory.Backend.Requests;
using MissionHillFireworks.Inventory.Backend.Responses;

namespace MissionHillFireworks.Inventory.Backend.Services.DataServices
{
    public class OrderService
    {
        private readonly DatabaseContext _context;
        private readonly ProductLookupService _productLookupService;

        public OrderService(DatabaseContext context, ProductLookupService productLookupService)
        {
            _context = context;
            _productLookupService = productLookupService;
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

        public async Task<OrderIntakeResponse> GetIntakeAsync(long orderId)
        {
            var orderItems = await _context.OrderItems.Where(o => o.OrderId == orderId).ToListAsync();
            var orderIntakeItems = await _context.OrderIntakeItems.Where(o => o.OrderId == orderId).ToListAsync();

            var items = new List<OrderIntakeItemResponse>();

            foreach(var orderItem in orderItems)
            {
                var product = await _productLookupService.LookupByStockNumberAsync(orderItem.StockNumber);

                if (product is null) continue;//remove this before it even gets added to the db

                var item = new OrderIntakeItemResponse
                {
                    UPC = product.UPC.ToString(),
                    Description = product.Description,
                    OrderedCount = orderItem.Count,
                };

                items.Add(item);
            }

            foreach (var orderIntakeItem in orderIntakeItems)
            {
                var product = await _productLookupService.LookupByStockNumberAsync(orderIntakeItem.StockNumber);

                var item = items.SingleOrDefault(i => i.UPC == product.UPC.ToString());

                if (item is null)
                {
                    item = new OrderIntakeItemResponse
                    {
                        UPC = product.UPC.ToString(),
                        Description = product.Description,
                        ScannedCount = orderIntakeItem.Count,
                    };

                    items.Add(item);
                }
                else
                {
                    item.ScannedCount = orderIntakeItem.Count;
                }
            }

            var response = new OrderIntakeResponse
            {
                Items = items
            };

            return response;
        }

        public async Task ImportAsync(long orderId, List<OrderImportItemRequest> items)
        {
            var orderItems = items.Select(i => new OrderItem
            {
                OrderId = orderId,
                Count = i.OrderedQuantity,
                StockNumber = i.StockNumber,
            });

            _context.OrderItems.AddRange(orderItems);
            await _context.SaveChangesAsync();
        }
    }
}
