using Microsoft.AspNetCore.Mvc;
using ClinicManagementAPI.Services;
using ClinicManagementAPI.Models.Requests;
using ClinicManagementAPI.Models.Responses;

namespace ClinicManagementAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AppointmentController : ControllerBase
    {
        private readonly IAppointmentService _appointmentService;
        private readonly ILogger<AppointmentController> _logger;

        public AppointmentController(IAppointmentService appointmentService, ILogger<AppointmentController> logger)
        {
            _appointmentService = appointmentService;
            _logger = logger;
        }

        [HttpGet("locations")]
        public async Task<IActionResult> GetLocations()
        {
            try
            {
                var locations = await _appointmentService.GetLocationsAsync();
                return Ok(new ApiResponse<object>
                {
                    Success = true,
                    Data = locations,
                    Message = "Locations retrieved successfully"
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving locations");
                return StatusCode(500, new ApiResponse<object>
                {
                    Success = false,
                    Message = "An error occurred while retrieving locations",
                    Errors = new List<string> { ex.Message }
                });
            }
        }

        [HttpGet("doctors/{locationId}")]
        public async Task<IActionResult> GetDoctorsByLocation(int locationId)
        {
            try
            {
                var doctors = await _appointmentService.GetDoctorsByLocationAsync(locationId);
                return Ok(new ApiResponse<object>
                {
                    Success = true,
                    Data = doctors,
                    Message = "Doctors retrieved successfully"
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving doctors for location {LocationId}", locationId);
                return StatusCode(500, new ApiResponse<object>
                {
                    Success = false,
                    Message = "An error occurred while retrieving doctors",
                    Errors = new List<string> { ex.Message }
                });
            }
        }

        [HttpGet("available-slots")]
        public async Task<IActionResult> GetAvailableSlots([FromQuery] int doctorId, [FromQuery] int locationId, [FromQuery] string date)
        {
            try
            {
                if (!DateTime.TryParse(date, out DateTime parsedDate))
                {
                    return BadRequest(new ApiResponse<object>
                    {
                        Success = false,
                        Message = "Invalid date format. Use YYYY-MM-DD"
                    });
                }

                var slots = await _appointmentService.GetAvailableSlotsAsync(doctorId, locationId, parsedDate);
                return Ok(new ApiResponse<object>
                {
                    Success = true,
                    Data = slots,
                    Message = "Available slots retrieved successfully"
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving available slots");
                return StatusCode(500, new ApiResponse<object>
                {
                    Success = false,
                    Message = "An error occurred while retrieving available slots",
                    Errors = new List<string> { ex.Message }
                });
            }
        }

        [HttpPost("book")]
        public async Task<IActionResult> BookAppointment([FromBody] BookAppointmentRequest request)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(new ApiResponse<object>
                    {
                        Success = false,
                        Message = "Invalid request data",
                        Errors = ModelState.Values.SelectMany(v => v.Errors.Select(e => e.ErrorMessage)).ToList()
                    });
                }

                var result = await _appointmentService.BookAppointmentAsync(request);
                
                if (!result.Success)
                {
                    return BadRequest(new ApiResponse<object>
                    {
                        Success = false,
                        Message = result.Message
                    });
                }

                return Ok(result);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error booking appointment");
                return StatusCode(500, new ApiResponse<object>
                {
                    Success = false,
                    Message = "An error occurred while booking the appointment",
                    Errors = new List<string> { ex.Message }
                });
            }
        }

        [HttpPatch("{appointmentId}")]
        public async Task<IActionResult> UpdateAppointment(int appointmentId, [FromBody] UpdateAppointmentRequest request)
        {
            try
            {
                if (appointmentId != request.AppointmentId)
                {
                    return BadRequest(new ApiResponse<object>
                    {
                        Success = false,
                        Message = "Appointment ID mismatch"
                    });
                }

                var updated = await _appointmentService.UpdateAppointmentAsync(request);

                if (!updated)
                {
                    return NotFound(new ApiResponse<object>
                    {
                        Success = false,
                        Message = "Appointment not found"
                    });
                }

                return Ok(new ApiResponse<object>
                {
                    Success = true,
                    Message = "Appointment updated successfully"
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error updating appointment {AppointmentId}", appointmentId);
                return StatusCode(500, new ApiResponse<object>
                {
                    Success = false,
                    Message = "An error occurred while updating the appointment",
                    Errors = new List<string> { ex.Message }
                });
            }
        }
    }
}
