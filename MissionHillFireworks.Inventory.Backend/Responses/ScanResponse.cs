namespace MissionHillFireworks.Inventory.Backend.Responses
{
    public class ScanResponse
    {
        public string? StockNumber { get; set; }
        public string? Brand { get; set; }
        public string? Description { get; set; }
        public int? Shots { get; set; }
        public string? Packing { get; set; }
        public int? UnitsPerCase { get; set; }
        public long? UPC { get; set; }
    }
}
