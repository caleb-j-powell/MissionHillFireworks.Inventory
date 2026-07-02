namespace MissionHillFireworks.Inventory.Backend.Requests
{
    public class OrderIntakeItemRequest
    {
        public long OrderId { get; set; }
        public string UPC { get; set; }
    }
}
