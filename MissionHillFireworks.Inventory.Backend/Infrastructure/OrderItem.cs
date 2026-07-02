using System.ComponentModel.DataAnnotations.Schema;

namespace MissionHillFireworks.Inventory.Backend.Infrastructure
{
    public class OrderItem
    {
        public long Id { get; set; }

        [ForeignKey("Order")]
        public long OrderId { get; set; }

        public string UPC { get; set; }

        public long Count { get; set; }
    }
}
