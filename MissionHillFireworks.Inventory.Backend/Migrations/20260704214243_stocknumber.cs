using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace MissionHillFireworks.Inventory.Backend.Migrations
{
    /// <inheritdoc />
    public partial class stocknumber : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "UPC",
                table: "OrderItems",
                newName: "StockNumber");

            migrationBuilder.RenameColumn(
                name: "UPC",
                table: "OrderIntakeItems",
                newName: "StockNumber");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "StockNumber",
                table: "OrderItems",
                newName: "UPC");

            migrationBuilder.RenameColumn(
                name: "StockNumber",
                table: "OrderIntakeItems",
                newName: "UPC");
        }
    }
}
