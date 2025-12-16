namespace ClinicManagementAPI.Models.DTOs
{
    public class AdminLoginRequest
    {
        public string Username { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty;
    }

    public class AdminLoginResponse
    {
        public bool Success { get; set; }
        public string Message { get; set; } = string.Empty;
        public string Token { get; set; } = string.Empty;
        public string Username { get; set; } = string.Empty;
    }

    public class AdminDashboardStatsDto
    {
        public int TotalAppointments { get; set; }
        public int TodayAppointments { get; set; }
        public int ThisWeekAppointments { get; set; }
        public int ThisMonthAppointments { get; set; }
        public List<DoctorAppointmentCountDto> AppointmentsPerDoctor { get; set; } = new();
        public List<LocationAppointmentCountDto> AppointmentsPerLocation { get; set; } = new();
    }

    public class DoctorAppointmentCountDto
    {
        public string DoctorName { get; set; } = string.Empty;
        public int Count { get; set; }
    }

    public class LocationAppointmentCountDto
    {
        public string LocationName { get; set; } = string.Empty;
        public int Count { get; set; }
    }
}
