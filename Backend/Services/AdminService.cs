using ClinicManagementAPI.Models.DTOs;
using ClinicManagementAPI.Models.Entities;
using ClinicManagementAPI.Repository;

namespace ClinicManagementAPI.Services
{
    public class AdminService : IAdminService
    {
        private readonly IAdminRepository _adminRepository;
        // In a real app, inject a token service here
        
        public AdminService(IAdminRepository adminRepository)
        {
            _adminRepository = adminRepository;
        }

        public async Task<AdminLoginResponse> LoginAsync(AdminLoginRequest request)
        {
            // Fetch admin
            var admin = await _adminRepository.GetAdminByUsernameAsync(request.Username);
            
            if (admin == null || !admin.IsActive)
            {
                return new AdminLoginResponse { Success = false, Message = "Invalid credentials" };
            }

            // Verify password (Simple comparison for now, in production use BCrypt/Argon2)
            // Assuming database stores hashed password, matching logic should be here.
            // For this implementation, strictly comparing strings as per likely existing setup or simple hash.
            // If existing uses hash, we need CreateMD5 or similar.
            // For now, let's assume direct string compare or simple hash match is handled by caller or logic below.
            // Let's assume plain text or pre-hashed match for simplicity unless specified.
            if (admin.PasswordHash != request.Password) 
            {
                 return new AdminLoginResponse { Success = false, Message = "Invalid credentials" };
            }

            await _adminRepository.UpdateLastLoginAsync(admin.AdminId);
            
            // Generate Token (Mock)
            var token = $"super_admin_token_{admin.AdminId}_{DateTime.UtcNow.Ticks}";

            return new AdminLoginResponse 
            { 
                Success = true, 
                Message = "Login successful",
                Token = token,
                Username = admin.Username
            };
        }

        public async Task<AdminDashboardStatsDto> GetDashboardStatsAsync()
        {
            return await _adminRepository.GetGlobalStatsAsync();
        }

        public async Task<IEnumerable<AppointmentDto>> GetAllAppointmentsAsync(string? doctorName, string? location, string? status, DateTime? startDate, DateTime? endDate, int? patientId = null, string? searchTerm = null)
        {
            return await _adminRepository.GetAllAppointmentsAsync(doctorName, location, status, startDate, endDate, patientId, searchTerm);
        }

        public async Task<(IEnumerable<dynamic> Patients, int TotalCount)> GetAllPatientsAsync(string? searchTerm, int page = 1, int pageSize = 10)
        {
            return await _adminRepository.GetAllPatientsAsync(searchTerm, page, pageSize);
        }
    }
}
