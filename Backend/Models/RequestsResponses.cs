namespace ClinicManagementAPI.Models.Requests
{
    public class BookAppointmentRequest
    {
        public string PatientName { get; set; } = string.Empty;
        public int Age { get; set; }
        public string Mobile { get; set; } = string.Empty;
        public string? Email { get; set; }
        public string? BloodGroup { get; set; }
        public int DoctorId { get; set; }
        public int LocationId { get; set; }
        public string AppointmentDate { get; set; } = string.Empty; // Format: YYYY-MM-DD
        public string AppointmentTime { get; set; } = string.Empty; // Format: HH:mm
        public string? Remarks { get; set; }
    }

    public class LoginRequest
    {
        public string Username { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty;
    }

    public class UpdateAppointmentRequest
    {
        public int AppointmentId { get; set; }
        public string? Status { get; set; }
        public string? Remarks { get; set; }
        public string? Diagnosis { get; set; }
        public string? Treatment { get; set; }
        public string? DoctorNotes { get; set; }
        public decimal? Fees { get; set; }
    }

    public class SearchPatientRequest
    {
        public string Query { get; set; } = string.Empty;
    }
}

namespace ClinicManagementAPI.Models.Responses
{
    public class ApiResponse<T>
    {
        public bool Success { get; set; }
        public string Message { get; set; } = string.Empty;
        public T? Data { get; set; }
        public List<string> Errors { get; set; } = new();
    }

    public class BookAppointmentResponse
    {
        public bool Success { get; set; }
        public string ReferenceNumber { get; set; } = string.Empty;
        public string Message { get; set; } = string.Empty;
        public string? BookingReference { get; set; }
        public int? RemainingSlotsForDay { get; set; }
        public AppointmentDetailsResponse? AppointmentDetails { get; set; }
    }

    public class AppointmentDetailsResponse
    {
        public string Doctor { get; set; } = string.Empty;
        public string Location { get; set; } = string.Empty;
        public string Date { get; set; } = string.Empty;
        public string Time { get; set; } = string.Empty;
    }

    public class LoginResponse
    {
        public bool Success { get; set; }
        public string Message { get; set; } = string.Empty;
        public DoctorInfo? Doctor { get; set; }
        public string? SessionId { get; set; }
    }

    public class DoctorInfo
    {
        public int DoctorId { get; set; }
        public string Name { get; set; } = string.Empty;
        public string? Email { get; set; }
    }

    public class PatientHistoryResponse
    {
        public PatientDetailsResponse? Patient { get; set; }
        public List<ClinicManagementAPI.Models.DTOs.PatientHistoryDto> History { get; set; } = new();
    }

    public class PatientDetailsResponse
    {
        public int PatientId { get; set; }
        public string Name { get; set; } = string.Empty;
        public int? Age { get; set; }
        public string? Gender { get; set; }
        public string Mobile { get; set; } = string.Empty;
        public string? Email { get; set; }
        public string? BloodGroup { get; set; }
    }

    public class PatientAppointmentHistoryResponse
    {
        public ClinicManagementAPI.Models.DTOs.PatientDto? Patient { get; set; }
        public List<ClinicManagementAPI.Models.DTOs.AppointmentDto> Appointments { get; set; } = new();
    }
}
