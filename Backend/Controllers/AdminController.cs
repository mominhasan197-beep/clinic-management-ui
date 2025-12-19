using Microsoft.AspNetCore.Mvc;
using ClinicManagementAPI.Services;
using ClinicManagementAPI.Models.DTOs;
using ClinicManagementAPI.Models.Responses;

namespace ClinicManagementAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AdminController : ControllerBase
    {
        private readonly IAdminService _adminService;
        private readonly ILogger<AdminController> _logger;

        public AdminController(IAdminService adminService, ILogger<AdminController> logger)
        {
            _adminService = adminService;
            _logger = logger;
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] AdminLoginRequest request)
        {
            var result = await _adminService.LoginAsync(request);
            if (!result.Success)
            {
                return Unauthorized(result);
            }
            return Ok(result);
        }

        [HttpGet("dashboard/stats")]
        public async Task<IActionResult> GetDashboardStats()
        {
            var stats = await _adminService.GetDashboardStatsAsync();
            return Ok(new ApiResponse<AdminDashboardStatsDto>
            {
                Success = true,
                Data = stats,
                Message = "Dashboard stats retrieved"
            });
        }

        [HttpGet("appointments")]
        public async Task<IActionResult> GetAllAppointments(
            [FromQuery] string? doctorName,
            [FromQuery] string? location,
            [FromQuery] string? status,
            [FromQuery] DateTime? startDate,
            [FromQuery] DateTime? endDate,
            [FromQuery] int? patientId,
            [FromQuery] string? searchTerm)
        {
            var appointments = await _adminService.GetAllAppointmentsAsync(doctorName, location, status, startDate, endDate, patientId, searchTerm);
            return Ok(new ApiResponse<IEnumerable<AppointmentDto>>
            {
                Success = true,
                Data = appointments,
                Message = "Appointments retrieved"
            });
        }

        [HttpGet("patients")]
        public async Task<IActionResult> GetAllPatients([FromQuery] string? search, [FromQuery] int page = 1, [FromQuery] int pageSize = 10)
        {
            var (patients, totalCount) = await _adminService.GetAllPatientsAsync(search, page, pageSize);
            return Ok(new ApiResponse<dynamic>
            {
                Success = true,
                Data = new 
                {
                    Items = patients,
                    TotalCount = totalCount,
                    Page = page,
                    PageSize = pageSize
                },
                Message = "Patients retrieved"
            });
        }
    }
}
