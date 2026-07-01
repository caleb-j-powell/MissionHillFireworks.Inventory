using Microsoft.AspNetCore.Mvc;
using MissionHillFireworks.Inventory.Backend.Responses;
using MissionHillFireworks.Inventory.Backend.Services;

namespace MissionHillFireworks.Inventory.Backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class InventoryController(InventoryService inventoryService) : ControllerBase
    {
        [HttpPost("Scan")]
        public async Task<IActionResult> Scan([FromForm] IFormFile file)
        {
            if (file == null || file.Length == 0)
                return BadRequest("No file uploaded");

            // Example: read the file into a byte array
            using var ms = new MemoryStream();
            await file.CopyToAsync(ms);
            var bytes = ms.ToArray();

            var response = await inventoryService.ScanAsync(bytes);

            return Ok(response);
        }
    }
}
