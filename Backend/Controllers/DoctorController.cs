using Microsoft.AspNetCore.Mvc;
using ClinicManagementAPI.Services;
using ClinicManagementAPI.Models.Requests;
using ClinicManagementAPI.Models.Responses;

namespace ClinicManagementAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class DoctorController : ControllerBase
    {
        private readonly IDoctorService _doctorService;
        private readonly ILogger<DoctorController> _logger;

        public DoctorController(IDoctorService doctorService, ILogger<DoctorController> logger)
        {
            _doctorService = doctorService;
            _logger = logger;
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginRequest request)
        {
            try
            {
                _logger.LogInformation("Login attempt for username: {Username}", request?.Username ?? "null");
                
                if (!ModelState.IsValid)
                {
                    _logger.LogWarning("Invalid model state for login request");
                    return BadRequest(new ApiResponse<object>
                    {
                        Success = false,
                        Message = "Invalid request data"
                    });
                }

                var result = await _doctorService.LoginAsync(request);
                
                if (!result.Success)
                {
                    _logger.LogWarning("Login failed for username: {Username}, Reason: {Message}", request.Username, result.Message);
                    return Unauthorized(result);
                }

                _logger.LogInformation("Login successful for username: {Username}, DoctorId: {DoctorId}", request.Username, result.Doctor?.DoctorId);
                return Ok(result);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error during doctor login for username: {Username}", request?.Username ?? "null");
                return StatusCode(500, new LoginResponse
                {
                    Success = false,
                    Message = "An error occurred during login"
                });
            }
        }

        [HttpGet("test")]
        public IActionResult Test()
        {
            return Ok(new { 
                message = "Doctor API is working", 
                timestamp = DateTime.UtcNow,
                path = Request.Path,
                origin = Request.Headers["Origin"].ToString()
            });
        }
    }

    [ApiController]
    [Route("api/[controller]")]
    public class DashboardController : ControllerBase
    {
        private readonly IDoctorService _doctorService;
        private readonly ILogger<DashboardController> _logger;

        public DashboardController(IDoctorService doctorService, ILogger<DashboardController> logger)
        {
            _doctorService = doctorService;
            _logger = logger;
        }

        [HttpGet("stats/{doctorId}")]
        public async Task<IActionResult> GetStats(int doctorId)
        {
            try
            {
                _logger.LogInformation("Getting dashboard stats for doctorId: {DoctorId}", doctorId);
                var stats = await _doctorService.GetDashboardStatsAsync(doctorId);
                _logger.LogInformation("Dashboard stats retrieved: Today={Today}, ThisWeek={ThisWeek}, ThisMonth={ThisMonth}, ThisYear={ThisYear}", 
                    stats?.Today ?? 0, stats?.ThisWeek ?? 0, stats?.ThisMonth ?? 0, stats?.ThisYear ?? 0);
                return Ok(new ApiResponse<object>
                {
                    Success = true,
                    Data = stats,
                    Message = "Dashboard stats retrieved successfully"
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving dashboard stats for doctorId: {DoctorId}", doctorId);
                return StatusCode(500, new ApiResponse<object>
                {
                    Success = false,
                    Message = "An error occurred while retrieving stats"
                });
            }
        }

        [HttpGet("appointments/{doctorId}")]
        public async Task<IActionResult> GetAppointments(int doctorId, [FromQuery] string period = "today")
        {
            try
            {
                _logger.LogInformation("Getting appointments for doctorId: {DoctorId}, period: {Period}", doctorId, period);
                var appointments = await _doctorService.GetAppointmentsAsync(doctorId, period);
                _logger.LogInformation("Retrieved {Count} appointments for doctorId: {DoctorId}", appointments?.Count() ?? 0, doctorId);
                return Ok(new ApiResponse<object>
                {
                    Success = true,
                    Data = appointments,
                    Message = "Appointments retrieved successfully"
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving appointments for doctorId: {DoctorId}, period: {Period}", doctorId, period);
                return StatusCode(500, new ApiResponse<object>
                {
                    Success = false,
                    Message = "An error occurred while retrieving appointments"
                });
            }
        }

        [HttpGet("appointments/{doctorId}/date/{date}")]
        public async Task<IActionResult> GetAppointmentsByDate(int doctorId, string date)
        {
            try
            {
                if (!DateTime.TryParse(date, out DateTime appointmentDate))
                {
                    return BadRequest(new ApiResponse<object>
                    {
                        Success = false,
                        Message = "Invalid date format. Use YYYY-MM-DD"
                    });
                }

                _logger.LogInformation("Getting appointments for doctorId: {DoctorId}, date: {Date}", doctorId, appointmentDate.ToString("yyyy-MM-dd"));
                var appointments = await _doctorService.GetAppointmentsByDateAsync(doctorId, appointmentDate);
                _logger.LogInformation("Retrieved {Count} appointments for doctorId: {DoctorId} on {Date}", appointments?.Count() ?? 0, doctorId, appointmentDate.ToString("yyyy-MM-dd"));
                
                return Ok(new ApiResponse<object>
                {
                    Success = true,
                    Data = appointments,
                    Message = "Appointments retrieved successfully"
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving appointments for doctorId: {DoctorId}, date: {Date}", doctorId, date);
                return StatusCode(500, new ApiResponse<object>
                {
                    Success = false,
                    Message = "An error occurred while retrieving appointments"
                });
            }
        }

        [HttpGet("appointments/{doctorId}/month")]
        public async Task<IActionResult> GetAppointmentsByMonth(int doctorId, [FromQuery] int month, [FromQuery] int year)
        {
            try
            {
                _logger.LogInformation("Getting appointments for doctorId: {DoctorId}, month: {Month}, year: {Year}", doctorId, month, year);
                var appointments = await _doctorService.GetAppointmentsByMonthAsync(doctorId, month, year);
                _logger.LogInformation("Retrieved {Count} appointments for doctorId: {DoctorId} in {Month}/{Year}", appointments?.Count() ?? 0, doctorId, month, year);
                
                return Ok(new ApiResponse<object>
                {
                    Success = true,
                    Data = appointments,
                    Message = "Appointments retrieved successfully"
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving appointments for doctorId: {DoctorId}, month: {Month}, year: {Year}", doctorId, month, year);
                return StatusCode(500, new ApiResponse<object>
                {
                    Success = false,
                    Message = "An error occurred while retrieving appointments"
                });
            }
        }
    }
}
