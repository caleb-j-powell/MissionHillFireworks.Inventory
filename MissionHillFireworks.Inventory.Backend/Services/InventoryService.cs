using MissionHillFireworks.Inventory.Backend.Responses;
using System.Text.Json;

namespace MissionHillFireworks.Inventory.Backend.Services
{
    public class InventoryService
    {
        private readonly Florence2OcrService _florence2OcrService;

        public InventoryService(Florence2OcrService florence2OcrService)
        {
            _florence2OcrService = florence2OcrService;
        }

        public async Task<ScanResponse> ScanAsync(byte[] imageBytes)
        {
            var json = File.ReadAllText(Path.Combine(AppContext.BaseDirectory, "Data\\order.json"));

            var items = JsonSerializer.Deserialize<List<ScanResponse>>(json);

            items.Add(new ScanResponse
            {
                StockNumber = "Silent Wings",
                Brand = "Test",
                Description = "Caleb is stupid",
                Packing = "N/A",
                Shots = 2,
                UnitsPerCase = 67,
                UPC = 111111111111
            });

            var results = await _florence2OcrService.ReadTextAsync(imageBytes);

            foreach (var result in results)
            {
                var response = items.FirstOrDefault(x => x.StockNumber.ToUpper().Trim().Contains(result.ToUpper().Trim()));

                return response;
            }

            return null;
        }
    }
}
