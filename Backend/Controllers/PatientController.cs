using Microsoft.AspNetCore.Mvc;
using ClinicManagementAPI.Services;
using ClinicManagementAPI.Models.Responses;

namespace ClinicManagementAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class PatientController : ControllerBase
    {
        private readonly IPatientService _patientService;
        private readonly IPdfService _pdfService;
        private readonly ILogger<PatientController> _logger;

        public PatientController(IPatientService patientService, IPdfService pdfService, ILogger<PatientController> logger)
        {
            _patientService = patientService;
            _pdfService = pdfService;
            _logger = logger;
        }

        [HttpGet("search")]
        public async Task<IActionResult> SearchPatient([FromQuery] string query)
        {
            try
            {
                if (string.IsNullOrWhiteSpace(query))
                {
                    return BadRequest(new ApiResponse<object>
                    {
                        Success = false,
                        Message = "Search query cannot be empty"
                    });
                }

                var patients = await _patientService.SearchPatientAsync(query);
                return Ok(new ApiResponse<object>
                {
                    Success = true,
                    Data = patients,
                    Message = "Patients retrieved successfully"
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error searching patients");
                return StatusCode(500, new ApiResponse<object>
                {
                    Success = false,
                    Message = "An error occurred while searching patients"
                });
            }
        }

        [HttpGet("history/{patientId}")]
        public async Task<IActionResult> GetPatientHistory(int patientId)
        {
            try
            {
                var history = await _patientService.GetPatientHistoryAsync(patientId);
                
                if (history.Patient == null)
                {
                    return NotFound(new ApiResponse<object>
                    {
                        Success = false,
                        Message = "Patient not found"
                    });
                }

                return Ok(new ApiResponse<object>
                {
                    Success = true,
                    Data = history,
                    Message = "Patient history retrieved successfully"
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving patient history");
                return StatusCode(500, new ApiResponse<object>
                {
                    Success = false,
                    Message = "An error occurred while retrieving patient history"
                });
            }
        }

        [HttpGet("download-pdf/{patientId}")]
        public async Task<IActionResult> DownloadPatientHistoryPdf(int patientId)
        {
            try
            {
                var history = await _patientService.GetPatientHistoryAsync(patientId);
                
                if (history.Patient == null)
                {
                    return NotFound(new ApiResponse<object>
                    {
                        Success = false,
                        Message = "Patient not found"
                    });
                }

                var pdfBytes = _pdfService.GeneratePatientHistoryPdf(history);
                var fileName = $"PatientHistory_{history.Patient.Name.Replace(" ", "_")}_{DateTime.Now:yyyyMMdd}.pdf";
                
                return File(pdfBytes, "application/pdf", fileName);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error generating PDF");
                return StatusCode(500, new ApiResponse<object>
                {
                    Success = false,
                    Message = "An error occurred while generating PDF"
                });
            }
        }

        [HttpGet("appointments")]
        public async Task<IActionResult> GetAppointmentHistoryByMobile([FromQuery] string mobile)
        {
            try
            {
                if (string.IsNullOrWhiteSpace(mobile))
                {
                    return BadRequest(new ApiResponse<object> { Success = false, Message = "Mobile number is required" });
                }

                var history = await _patientService.GetAppointmentHistoryByMobileAsync(mobile);

                return Ok(new ApiResponse<object>
                {
                    Success = true,
                    Data = history,
                    Message = history.Patient != null ? "Appointments retrieved successfully" : "No patient found with this mobile number"
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving appointment history");
                return StatusCode(500, new ApiResponse<object> { Success = false, Message = "Error retrieving history: " + ex.Message });
            }
        }

        [HttpGet("download-appointments-pdf")]
        public async Task<IActionResult> DownloadAppointmentHistoryPdf([FromQuery] string mobile)
        {
            try
            {
                var history = await _patientService.GetAppointmentHistoryByMobileAsync(mobile);

                if (history.Patient == null)
                {
                    return NotFound(new ApiResponse<object> { Success = false, Message = "Patient not found" });
                }

                var pdfBytes = _pdfService.GenerateAppointmentHistoryPdf(history);
                var fileName = $"Appointments_{history.Patient.Mobile}_{DateTime.Now:yyyyMMdd}.pdf";

                return File(pdfBytes, "application/pdf", fileName);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error generating PDF");
                return StatusCode(500, new ApiResponse<object> { Success = false, Message = "Error generating PDF" });
            }
        }
    }
}
