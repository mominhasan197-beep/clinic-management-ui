using ClinicManagementAPI.Models.Entities;
using ClinicManagementAPI.Models.DTOs;

namespace ClinicManagementAPI.Repository
{
    public interface IAdminRepository
    {
        Task<SuperAdmin?> GetAdminByUsernameAsync(string username);
        Task UpdateLastLoginAsync(int adminId);
        Task<AdminDashboardStatsDto> GetGlobalStatsAsync();
        Task<IEnumerable<AppointmentDto>> GetAllAppointmentsAsync(string? doctorName, string? location, string? status, DateTime? startDate, DateTime? endDate);
        Task<IEnumerable<Patient>> GetAllPatientsAsync(string? searchTerm);
    }
}
