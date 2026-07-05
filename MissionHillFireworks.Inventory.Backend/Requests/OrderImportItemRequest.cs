namespace MissionHillFireworks.Inventory.Backend.Requests
{
    public class OrderImportItemRequest
    {
        public string StockNumber { get; set; }
        public int OrderedQuantity { get; set; }
    }
}
