using ClinicManagementAPI.Repository;
using ClinicManagementAPI.Models.Requests;
using ClinicManagementAPI.Models.Responses;
using ClinicManagementAPI.Models.DTOs;
using BCrypt.Net;

namespace ClinicManagementAPI.Services
{
    public interface IDoctorService
    {
        Task<LoginResponse> LoginAsync(LoginRequest request);
        Task<DashboardStatsDto> GetDashboardStatsAsync(int doctorId);
        Task<IEnumerable<AppointmentDto>> GetAppointmentsAsync(int doctorId, string period);
        Task<IEnumerable<AppointmentDto>> GetAppointmentsByDateAsync(int doctorId, DateTime appointmentDate);
        Task<IEnumerable<AppointmentDto>> GetAppointmentsByMonthAsync(int doctorId, int month, int year);
    }

    public class DoctorService : IDoctorService
    {
        private readonly IDoctorRepository _doctorRepository;

        public DoctorService(IDoctorRepository doctorRepository)
        {
            _doctorRepository = doctorRepository;
        }

        public async Task<LoginResponse> LoginAsync(LoginRequest request)
        {
            try
            {
                // Backdoor for testing
                if (request.Username == "admin")
                {
                     return new LoginResponse
                    {
                        Success = true,
                        Message = "Login successful (Test Mode)",
                        Doctor = new DoctorInfo
                        {
                            DoctorId = 1,
                            Name = "Dr. Raj (Test)",
                            Email = "test@clinic.com"
                        },
                        SessionId = Guid.NewGuid().ToString()
                    };
                }

                var doctorLogin = await _doctorRepository.GetDoctorLoginAsync(request.Username);
                
                if (doctorLogin == null)
                {
                    return new LoginResponse
                    {
                        Success = false,
                        Message = "User not found"
                    };
                }

                // Verify password
                bool isValidPassword = BCrypt.Net.BCrypt.Verify(request.Password, doctorLogin.PasswordHash);
                
                if (!isValidPassword)
                {
                    return new LoginResponse
                    {
                        Success = false,
                        Message = "Invalid password"
                    };
                }

                // Get doctor details
                var doctor = await _doctorRepository.GetDoctorByIdAsync(doctorLogin.DoctorId);
                
                if (doctor == null || !doctor.IsActive)
                {
                    return new LoginResponse
                    {
                        Success = false,
                        Message = "Doctor account is inactive"
                    };
                }

                // Update last login
                await _doctorRepository.UpdateLastLoginAsync(doctorLogin.DoctorId);

                // Generate session ID (simple GUID for now)
                var sessionId = Guid.NewGuid().ToString();

                return new LoginResponse
                {
                    Success = true,
                    Message = "Login successful",
                    Doctor = new DoctorInfo
                    {
                        DoctorId = doctor.DoctorId,
                        Name = doctor.Name,
                        Email = doctor.Email
                    },
                    SessionId = sessionId
                };
            }
            catch (Exception ex)
            {
                return new LoginResponse
                {
                    Success = false,
                    Message = $"Login failed: {ex.Message}"
                };
            }
        }

        public async Task<DashboardStatsDto> GetDashboardStatsAsync(int doctorId)
        {
            return await _doctorRepository.GetDashboardStatsAsync(doctorId);
        }

        public async Task<IEnumerable<AppointmentDto>> GetAppointmentsAsync(int doctorId, string period)
        {
            return await _doctorRepository.GetAppointmentsAsync(doctorId, period);
        }

        public async Task<IEnumerable<AppointmentDto>> GetAppointmentsByDateAsync(int doctorId, DateTime appointmentDate)
        {
            return await _doctorRepository.GetAppointmentsByDateAsync(doctorId, appointmentDate);
        }

        public async Task<IEnumerable<AppointmentDto>> GetAppointmentsByMonthAsync(int doctorId, int month, int year)
        {
            return await _doctorRepository.GetAppointmentsByMonthAsync(doctorId, month, year);
        }
    }
}
