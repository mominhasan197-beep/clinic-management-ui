using ClinicManagementAPI.Models.DTOs;
using ClinicManagementAPI.Models.Entities;

namespace ClinicManagementAPI.Services
{
    public interface IAdminService
    {
        Task<AdminLoginResponse> LoginAsync(AdminLoginRequest request);
        Task<AdminDashboardStatsDto> GetDashboardStatsAsync();
        Task<IEnumerable<AppointmentDto>> GetAllAppointmentsAsync(string? doctorName, string? location, string? status, DateTime? startDate, DateTime? endDate);
        Task<IEnumerable<Patient>> GetAllPatientsAsync(string? searchTerm);
    }
}
