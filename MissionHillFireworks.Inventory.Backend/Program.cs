using Florence2;
using Microsoft.EntityFrameworkCore;
using MissionHillFireworks.Inventory.Backend.Infrastructure;
using MissionHillFireworks.Inventory.Backend.Services;
using MissionHillFireworks.Inventory.Backend.Services.DataServices;

var builder = WebApplication.CreateBuilder(args);

var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");

builder.Services.AddDbContext<DatabaseContext>(options =>
    options.UseSqlite(connectionString));

// Add services to the container.

builder.Services.AddControllers();
// Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
builder.Services.AddOpenApi();

builder.Services.AddSingleton<Florence2Model>(_ =>
{
    var downloader = new FlorenceModelDownloader("models");

    // ensure model exists (blocking at startup is fine here)
    downloader.DownloadModelsAsync(_ => { })
              .GetAwaiter()
              .GetResult();

    return new Florence2Model(downloader);
});

builder.Services.AddSingleton<Florence2OcrService>();
builder.Services.AddSingleton<ProductLookupService>();
builder.Services.AddScoped<OrderService>();
builder.Services.AddScoped<OrderIntakeItemService>();

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", policy =>
    {
        policy.WithOrigins("https://192.168.1.68:5173")
              .AllowAnyHeader()
              .AllowAnyMethod()
              .AllowCredentials(); // only if you use cookies/auth
    });
});

var app = builder.Build();

using (var scope = app.Services.CreateScope())
{
    var services = scope.ServiceProvider;
    try
    {
        var context = services.GetRequiredService<DatabaseContext>();

        // This will automatically apply any pending migrations
        context.Database.Migrate();
    }
    catch (Exception ex)
    {
        var logger = services.GetRequiredService<ILogger<Program>>();
        logger.LogError(ex, "An error occurred while migrating the database.");

        // Optional: Terminate the app if the database cannot update
        throw;
    }
}

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

app.UseHttpsRedirection();

app.UseCors("AllowFrontend");

app.UseAuthorization();

app.MapControllers();

app.Run();
