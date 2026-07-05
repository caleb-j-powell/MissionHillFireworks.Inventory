using Microsoft.AspNetCore.Mvc;
using MissionHillFireworks.Inventory.Backend.Requests;
using MissionHillFireworks.Inventory.Backend.Services.DataServices;

namespace MissionHillFireworks.Inventory.Backend.Controllers
{
    [ApiController]
    [Route("api/order")]
    public class OrderController(OrderService orderService) : ControllerBase
    {
        [HttpPost]
        public async Task<IActionResult> Post([FromBody] OrderRequest request)
        {
            var order = await orderService.CreateOrUpdateAsync(null, request.Name);

            return Ok(order);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Put([FromRoute] long id, [FromBody] OrderRequest request)
        {
            var order = await orderService.CreateOrUpdateAsync(id, request.Name);

            return Ok(order);
        }

        [HttpGet]
        public async Task<IActionResult> Get()
        {
            var orders = await orderService.GetAllAsync();

            return Ok(orders);
        }

        [HttpGet("{orderId}/Intake")]
        public async Task<IActionResult> GetIntake([FromRoute] long orderId)
        {
            var orders = await orderService.GetIntakeAsync(orderId);

            return Ok(orders);
        }

        [HttpPost("{orderId}/import")]
        public async Task<IActionResult> Import([FromRoute] int orderId,
        [FromBody] OrderImportRequest request)
        {
            await orderService.ImportAsync(orderId, request.Items);

            return Ok();
        }
    }
}
