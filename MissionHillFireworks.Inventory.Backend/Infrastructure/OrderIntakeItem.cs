using System.ComponentModel.DataAnnotations.Schema;

namespace MissionHillFireworks.Inventory.Backend.Infrastructure
{
    public class OrderIntakeItem
    {
        public long Id { get; set; }

        [ForeignKey("Order")]
        public long OrderId { get; set; }

        public long Count { get; set; }

        public string UPC { get; set; }
    }
}
