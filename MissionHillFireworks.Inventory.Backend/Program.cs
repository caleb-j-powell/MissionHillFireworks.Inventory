using Florence2;
using MissionHillFireworks.Inventory.Backend.Services;

var builder = WebApplication.CreateBuilder(args);

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
builder.Services.AddSingleton<InventoryService>();

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
