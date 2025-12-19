using ClinicManagementAPI.Models.Entities;
using ClinicManagementAPI.Models.DTOs;

namespace ClinicManagementAPI.Repository
{
    public interface IAdminRepository
    {
        Task<SuperAdmin?> GetAdminByUsernameAsync(string username);
        Task UpdateLastLoginAsync(int adminId);
        Task<AdminDashboardStatsDto> GetGlobalStatsAsync();
        Task<IEnumerable<AppointmentDto>> GetAllAppointmentsAsync(string? doctorName, string? location, string? status, DateTime? startDate, DateTime? endDate, int? patientId = null, string? searchTerm = null);
        Task<(IEnumerable<dynamic> Patients, int TotalCount)> GetAllPatientsAsync(string? searchTerm, int page, int pageSize);
    }
}
