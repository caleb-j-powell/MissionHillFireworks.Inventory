using MissionHillFireworks.Inventory.Backend.Requests;
using MissionHillFireworks.Inventory.Backend.Responses;
using System.Text.Json;
using System.Text.Json.Serialization;
using Tesseract;

namespace MissionHillFireworks.Inventory.Backend.Services
{
    public class InventoryService
    {
        public async Task<ScanResponse> ScanAsync(byte[] imageBytes)
        {
            using var engine = new TesseractEngine(Path.Combine(AppContext.BaseDirectory, "tessdata"), "eng", EngineMode.Default);

            using var image = Pix.LoadFromMemory(imageBytes);
            using var gray = image.ConvertRGBToGray();
            using var page = engine.Process(gray);

            var value = page.GetText();

            //value = "Silent Wings";

            Console.WriteLine($"Confidence: {page.GetMeanConfidence()}");
            Console.WriteLine($"Text: [{value}]");

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

            var response = items.FirstOrDefault(x => value.Contains(x.StockNumber.Trim()));

            return response;
        }
    }
}
