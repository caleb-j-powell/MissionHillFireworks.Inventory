using MissionHillFireworks.Inventory.Backend.Responses;
using System.Text.Json;

namespace MissionHillFireworks.Inventory.Backend.Services
{
    public class ProductLookupService
    {
        private readonly Florence2OcrService _florence2OcrService;

        public ProductLookupService(Florence2OcrService florence2OcrService)
        {
            _florence2OcrService = florence2OcrService;
        }

        public async Task<List<ScanResponse>> ScanAsync(byte[] imageBytes)
        {
            var json = File.ReadAllText(Path.Combine(AppContext.BaseDirectory, "Data\\order.json"));

            var items = JsonSerializer.Deserialize<List<ScanResponse>>(json);

            items.Add(new ScanResponse
            {
                StockNumber = "Silent Wings 4",
                Brand = "Test",
                Description = "Caleb is stupid",
                Packing = "N/A",
                Shots = 2,
                UnitsPerCase = 67,
                UPC = 111111111111
            });

            items.Add(new ScanResponse
            {
                StockNumber = "BP2449",
                Brand = "Test",
                Description = "Caleb is stupid",
                Packing = "N/A",
                Shots = 2,
                UnitsPerCase = 67,
                UPC = 111111111112
            });

            var results = await _florence2OcrService.ReadTextAsync(imageBytes);

            var response = new List<ScanResponse>();

            foreach (var result in results)
            {
                response.AddRange(items.Where(x => x.StockNumber.ToUpper().Trim().Contains(result.ToUpper().Trim())));
            }

            return response;
        }
    }
}
