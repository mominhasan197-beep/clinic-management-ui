using Dapper;
using ClinicManagementAPI.Data;
using ClinicManagementAPI.Models.Entities;
using ClinicManagementAPI.Models.DTOs;
using System.Data;

namespace ClinicManagementAPI.Repository
{
    public class AdminRepository : IAdminRepository
    {
        private readonly IDbContext _dbContext;

        public AdminRepository(IDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        public async Task<SuperAdmin?> GetAdminByUsernameAsync(string username)
        {
            using var connection = _dbContext.CreateConnection();
            return await connection.QueryFirstOrDefaultAsync<SuperAdmin>(
                "sp_Admin_GetByUsername", 
                new { Username = username },
                commandType: CommandType.StoredProcedure);
        }

        public async Task UpdateLastLoginAsync(int adminId)
        {
            using var connection = _dbContext.CreateConnection();
            await connection.ExecuteAsync(
                "sp_Admin_UpdateLastLogin", 
                new { AdminId = adminId },
                commandType: CommandType.StoredProcedure);
        }

        public async Task<AdminDashboardStatsDto> GetGlobalStatsAsync()
        {
            using var connection = _dbContext.CreateConnection();
            using var multi = await connection.QueryMultipleAsync(
                "sp_Admin_GetGlobalStats",
                commandType: CommandType.StoredProcedure);

            var stats = new AdminDashboardStatsDto();

            // Result Set 1: Total Counts
            var counts = await multi.ReadFirstOrDefaultAsync<dynamic>();
            if (counts != null)
            {
                stats.TotalAppointments = counts.Total;
                stats.TodayAppointments = counts.Today;
                stats.ThisWeekAppointments = counts.Week;
                stats.ThisMonthAppointments = counts.Month;
            }

            // Result Set 2: Per Doctor
            stats.AppointmentsPerDoctor = (await multi.ReadAsync<DoctorAppointmentCountDto>()).ToList();

            // Result Set 3: Per Location
            stats.AppointmentsPerLocation = (await multi.ReadAsync<LocationAppointmentCountDto>()).ToList();

            return stats;
        }

        public async Task<IEnumerable<AppointmentDto>> GetAllAppointmentsAsync(string? doctorName, string? location, string? status, DateTime? startDate, DateTime? endDate, int? patientId = null, string? searchTerm = null)
        {
            using var connection = _dbContext.CreateConnection();
            var parameters = new DynamicParameters();
            parameters.Add("@DoctorName", doctorName);
            parameters.Add("@Location", location);
            parameters.Add("@Status", status);
            parameters.Add("@StartDate", startDate?.Date);
            parameters.Add("@EndDate", endDate?.Date);
            parameters.Add("@PatientId", patientId);
            parameters.Add("@SearchTerm", searchTerm);

            var result = await connection.QueryAsync<dynamic>(
                "sp_Admin_GetAllAppointments", 
                parameters,
                commandType: CommandType.StoredProcedure);
            
            return result.Select(a => new AppointmentDto
            {
                AppointmentId = a.AppointmentId,
                ReferenceNumber = a.ReferenceNumber,
                PatientId = a.PatientId,
                PatientName = a.PatientName,
                Age = a.Age,
                Gender = a.Gender,
                Mobile = a.Mobile,
                Email = a.Email,
                DoctorName = a.DoctorName,
                AppointmentDate = ((DateTime)a.AppointmentDate).ToString("yyyy-MM-dd"),
                AppointmentTime = ((TimeSpan)a.AppointmentTime).ToString(@"hh\:mm"),
                LocationName = a.LocationName,
                Status = a.Status,
                Remarks = a.Remarks,
                Diagnosis = a.Diagnosis,
                Treatment = a.Treatment,
                DoctorNotes = a.DoctorNotes,
                Fees = a.Fees
            });
        }

        public async Task<(IEnumerable<dynamic> Patients, int TotalCount)> GetAllPatientsAsync(string? searchTerm, int page, int pageSize)
        {
            using var connection = _dbContext.CreateConnection();
            var parameters = new DynamicParameters();
            parameters.Add("@SearchTerm", searchTerm);
            parameters.Add("@Page", page);
            parameters.Add("@PageSize", pageSize);

            using var multi = await connection.QueryMultipleAsync(
                "sp_Admin_GetAllPatients", 
                parameters,
                commandType: CommandType.StoredProcedure);

            var totalCount = await multi.ReadFirstAsync<int>();
            var result = await multi.ReadAsync<dynamic>();

            var patients = result.Select(p => new 
            {
                p.PatientId,
                p.Name,
                p.Age,
                p.Gender,
                p.Mobile,
                p.Email,
                p.BloodGroup,
                TotalVisits = (int)p.TotalVisits,
                LastVisit = p.LastVisit != null ? ((DateTime)p.LastVisit).ToString("yyyy-MM-dd") : "N/A"
            });

            return (patients, totalCount);
        }
    }
}
