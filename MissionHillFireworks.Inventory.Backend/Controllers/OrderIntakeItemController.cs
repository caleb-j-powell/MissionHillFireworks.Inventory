using Microsoft.AspNetCore.Mvc;
using MissionHillFireworks.Inventory.Backend.Requests;
using MissionHillFireworks.Inventory.Backend.Services.DataServices;

namespace MissionHillFireworks.Inventory.Backend.Controllers
{
    [ApiController]
    [Route("api/order-intake-item")]
    public class OrderIntakeItemController(OrderIntakeItemService orderIntakeItemService) : ControllerBase
    {
        [HttpPost]
        public async Task<IActionResult> Post([FromBody] OrderIntakeItemRequest request)
        {
            var item = await orderIntakeItemService.AddAsync(request.OrderId, request.UPC);

            return Ok(item);
        }
    }
}
