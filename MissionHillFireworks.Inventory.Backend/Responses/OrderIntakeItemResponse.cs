namespace MissionHillFireworks.Inventory.Backend.Responses
{
    public class OrderIntakeItemResponse
    {
        public string Description { get; set; }
        public string UPC { get; set; }
        public long OrderedCount { get; set; }
        public long ScannedCount { get; set; }
    }
}
