using Serilog;

Log.Logger = new LoggerConfiguration()
    .MinimumLevel.Debug() 
    .WriteTo.Console()     // Logging للـ Console
    .WriteTo.File("logs/log-.txt",     // مسار ملفات اللوج
        rollingInterval: RollingInterval.Day,  // ملف جديد كل يوم
        retainedFileCountLimit: 10,     // يحتفظ بـ آخر 10 ملفات
        shared: true,
        buffered: true)
    .CreateLogger();    
var builder = WebApplication.CreateBuilder(args);

///Logging Middleware
builder.Host.UseSerilog();

// Add services to the container.
// Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
builder.Services.AddOpenApi();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

app.UseHttpsRedirection();

var summaries = new[]
{
    "Freezing", "Bracing", "Chilly", "Cool", "Mild", "Warm", "Balmy", "Hot", "Sweltering", "Scorching"
};

app.MapGet("/weatherforecast", () =>
{
    var forecast =  Enumerable.Range(1, 5).Select(index =>
        new WeatherForecast
        (
            DateOnly.FromDateTime(DateTime.Now.AddDays(index)),
            Random.Shared.Next(-20, 55),
            summaries[Random.Shared.Next(summaries.Length)]
        ))
        .ToArray();
    return forecast;
})
.WithName("GetWeatherForecast");

app.Run();

record WeatherForecast(DateOnly Date, int TemperatureC, string? Summary)
{
    public int TemperatureF => 32 + (int)(TemperatureC / 0.5556);
}
