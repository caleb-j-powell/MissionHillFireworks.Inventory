using MissionHillFireworks.Inventory.Backend.Responses;
using System.Text.Json;

namespace MissionHillFireworks.Inventory.Backend.Services
{
    public class ProductLookupService
    {
        private readonly Florence2OcrService _florence2OcrService;
        private List<ScanResponse> _products;

        public ProductLookupService(Florence2OcrService florence2OcrService)
        {
            _florence2OcrService = florence2OcrService;

            var json = File.ReadAllText(Path.Combine(AppContext.BaseDirectory, "Data\\order.json"));

            _products = JsonSerializer.Deserialize<List<ScanResponse>>(json);

            //_products.Add(new ScanResponse
            //{
            //    StockNumber = "Silent Wings 4",
            //    Brand = "Test",
            //    Description = "Caleb is stupid",
            //    Packing = "N/A",
            //    Shots = 2,
            //    UnitsPerCase = 67,
            //    UPC = 111111111111
            //});

            //_products.Add(new ScanResponse
            //{
            //    StockNumber = "BP2449",
            //    Brand = "Test",
            //    Description = "Caleb is stupid",
            //    Packing = "N/A",
            //    Shots = 2,
            //    UnitsPerCase = 67,
            //    UPC = 111111111112
            //});
        }

        public async Task<List<ScanResponse>> ScanAsync(byte[] imageBytes)
        {
            var results = await _florence2OcrService.ReadTextAsync(imageBytes);

            var response = new List<ScanResponse>();

            foreach (var result in results)
            {
                response.AddRange(_products.Where(x => x.StockNumber.ToUpper().Trim().Contains(result.ToUpper().Trim())));
            }

            return response;
        }

        public async Task<ScanResponse> LookupByStockNumberAsync(string stockNumber)
        {
            var product = _products.SingleOrDefault(p => p.StockNumber.ToUpper().EndsWith(stockNumber.ToUpper()));

            return product;
        }
    }
}
