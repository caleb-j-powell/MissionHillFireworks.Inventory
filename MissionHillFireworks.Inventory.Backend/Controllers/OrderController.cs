using Microsoft.AspNetCore.Mvc;
using MissionHillFireworks.Inventory.Backend.Services.DataServices;

namespace MissionHillFireworks.Inventory.Backend.Controllers
{
    [ApiController]
    [Route("api/order")]
    public class OrderController(OrderService orderService) : ControllerBase
    {
        [HttpGet]
        public async Task<IActionResult> Get()
        {
            var orders = await orderService.GetAllAsync();

            return Ok(orders);
        }
    }
}
