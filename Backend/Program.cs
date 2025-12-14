using ClinicManagementAPI.Data;
using ClinicManagementAPI.Repository;
using ClinicManagementAPI.Services;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// Register DbContext
builder.Services.AddSingleton<IDbContext, DbContext>();

// Register Repositories
builder.Services.AddScoped<IAppointmentRepository, AppointmentRepository>();
builder.Services.AddScoped<IDoctorRepository, DoctorRepository>();
builder.Services.AddScoped<IPatientRepository, PatientRepository>();

// Register Services
builder.Services.AddScoped<IAppointmentService, AppointmentService>();
builder.Services.AddScoped<IDoctorService, DoctorService>();
builder.Services.AddScoped<IPatientService, PatientService>();
builder.Services.AddScoped<IPdfService, PdfService>();

// Configure CORS - Must be very permissive to avoid issues
builder.Services.AddCors(options =>
{
  options.AddPolicy("AllowAngularApp",
      policy =>
      {
        policy.SetIsOriginAllowed(origin => {
          // Log the origin for debugging
          Console.WriteLine($"[CORS Policy] Allowing origin: {origin ?? "null"}");
          // Allow any origin - return true for all origins
          return true;
        })
        .AllowAnyHeader()
        .AllowAnyMethod()
        .WithExposedHeaders("*");
      });
});

var app = builder.Build();

// ⭐ Important for IIS virtual directory
app.UsePathBase("/Utilization");

// Add request logging middleware for debugging (FIRST)
app.Use(async (context, next) =>
{
    Console.WriteLine($"[Request] {context.Request.Method} {context.Request.Path}");
    Console.WriteLine($"[Request] Origin: {context.Request.Headers["Origin"]}");
    Console.WriteLine($"[Request] User-Agent: {context.Request.Headers["User-Agent"]}");
    await next();
});

// Handle OPTIONS preflight requests FIRST (before CORS middleware)
app.Use(async (context, next) =>
{
    if (context.Request.Method == "OPTIONS")
    {
        var origin = context.Request.Headers["Origin"].ToString();
        Console.WriteLine($"[CORS Preflight] Handling OPTIONS request from: {origin}");
        
        if (!string.IsNullOrEmpty(origin))
        {
            context.Response.Headers.Add("Access-Control-Allow-Origin", origin);
        }
        else
        {
            context.Response.Headers.Add("Access-Control-Allow-Origin", "*");
        }
        
        context.Response.Headers.Add("Access-Control-Allow-Methods", "GET, POST, PUT, PATCH, DELETE, OPTIONS");
        context.Response.Headers.Add("Access-Control-Allow-Headers", "Content-Type, Authorization, Accept, X-Requested-With, Origin");
        context.Response.Headers.Add("Access-Control-Max-Age", "3600");
        context.Response.StatusCode = 200;
        await context.Response.WriteAsync(string.Empty);
        return;
    }
    await next();
});

// CORS MUST be before other middleware (especially before UseAuthorization)
// This handles CORS headers for actual requests
app.UseCors("AllowAngularApp");

// Add CORS headers to all responses (as additional safety)
app.Use(async (context, next) =>
{
    await next();
    
    // Add CORS headers to response if not already present
    var origin = context.Request.Headers["Origin"].ToString();
    if (!string.IsNullOrEmpty(origin) && !context.Response.Headers.ContainsKey("Access-Control-Allow-Origin"))
    {
        context.Response.Headers.Add("Access-Control-Allow-Origin", origin);
        context.Response.Headers.Add("Access-Control-Allow-Methods", "GET, POST, PUT, PATCH, DELETE, OPTIONS");
        context.Response.Headers.Add("Access-Control-Allow-Headers", "Content-Type, Authorization, Accept, X-Requested-With, Origin");
    }
});

app.UseStaticFiles();

// Swagger
app.UseSwagger();
app.UseSwaggerUI(c =>
{
  c.SwaggerEndpoint("/Utilization/swagger/v1/swagger.json", "ClinicManagement API");
  c.RoutePrefix = "swagger"; // enables /Utilization/swagger
});

// HTTPS redirection - may cause issues with CORS, so we handle it carefully
app.UseHttpsRedirection();

// Authorization - must be after CORS
app.UseAuthorization();

app.MapControllers();

app.Run();
