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
            var query = "SELECT * FROM SuperAdmins WHERE Username = @Username";
            return await connection.QueryFirstOrDefaultAsync<SuperAdmin>(query, new { Username = username });
        }

        public async Task UpdateLastLoginAsync(int adminId)
        {
            using var connection = _dbContext.CreateConnection();
            var query = "UPDATE SuperAdmins SET LastLogin = GETDATE() WHERE AdminId = @AdminId";
            await connection.ExecuteAsync(query, new { AdminId = adminId });
        }

        public async Task<AdminDashboardStatsDto> GetGlobalStatsAsync()
        {
            using var connection = _dbContext.CreateConnection();
            var stats = new AdminDashboardStatsDto();

            // Total Counts
            var queryTotal = @"
                SELECT 
                    (SELECT COUNT(*) FROM Appointments) as Total,
                    (SELECT COUNT(*) FROM Appointments WHERE CAST(AppointmentDate AS DATE) = CAST(GETDATE() AS DATE)) as Today,
                    (SELECT COUNT(*) FROM Appointments WHERE AppointmentDate >= DATEADD(day, -7, GETDATE())) as Week,
                    (SELECT COUNT(*) FROM Appointments WHERE MONTH(AppointmentDate) = MONTH(GETDATE()) AND YEAR(AppointmentDate) = YEAR(GETDATE())) as Month";
            
            var counts = await connection.QueryFirstOrDefaultAsync<dynamic>(queryTotal);
            if (counts != null)
            {
                stats.TotalAppointments = counts.Total;
                stats.TodayAppointments = counts.Today;
                stats.ThisWeekAppointments = counts.Week;
                stats.ThisMonthAppointments = counts.Month;
            }

            // Per Doctor
            var queryDoctor = @"
                SELECT d.Name as DoctorName, COUNT(a.AppointmentId) as Count
                FROM Appointments a
                JOIN Doctors d ON a.DoctorId = d.DoctorId
                GROUP BY d.Name";
            stats.AppointmentsPerDoctor = (await connection.QueryAsync<DoctorAppointmentCountDto>(queryDoctor)).ToList();

            // Per Location - Assuming hardcoded strings or Location table join if LocationName is stored
            var queryLocation = @"
                SELECT LocationName, COUNT(AppointmentId) as Count
                FROM Appointments
                GROUP BY LocationName";
            stats.AppointmentsPerLocation = (await connection.QueryAsync<LocationAppointmentCountDto>(queryLocation)).ToList();

            return stats;
        }

        public async Task<IEnumerable<AppointmentDto>> GetAllAppointmentsAsync(string? doctorName, string? location, string? status, DateTime? startDate, DateTime? endDate)
        {
            using var connection = _dbContext.CreateConnection();
            var sql = @"
                SELECT a.*, p.Name as PatientName, p.Age, p.Gender, p.Mobile, p.Email
                FROM Appointments a
                JOIN Patients p ON a.PatientId = p.PatientId
                WHERE 1=1";

            var parameters = new DynamicParameters();

            if (!string.IsNullOrEmpty(doctorName))
            {
                // Assuming we join Doctor table or filter by ID, but requirement says filter by Doctor. 
                // Since AppointmentDto has string DoctorName usually mapped, but Appointment Entity has DoctorId.
                // We'll filter via Join for accuracy.
                sql += " AND a.DoctorId IN (SELECT DoctorId FROM Doctors WHERE Name LIKE @DoctorName)";
                parameters.Add("@DoctorName", $"%{doctorName}%");
            }

            if (!string.IsNullOrEmpty(location))
            {
                sql += " AND a.LocationName LIKE @Location";
                parameters.Add("@Location", $"%{location}%");
            }

            if (!string.IsNullOrEmpty(status))
            {
                sql += " AND a.Status = @Status";
                parameters.Add("@Status", status);
            }

            if (startDate.HasValue)
            {
                sql += " AND CAST(a.AppointmentDate AS DATE) >= @StartDate";
                parameters.Add("@StartDate", startDate.Value.Date);
            }

            if (endDate.HasValue)
            {
                sql += " AND CAST(a.AppointmentDate AS DATE) <= @EndDate";
                parameters.Add("@EndDate", endDate.Value.Date);
            }

            sql += " ORDER BY a.AppointmentDate DESC, a.AppointmentTime DESC";

            var result = await connection.QueryAsync<dynamic>(sql, parameters);
            
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

        public async Task<IEnumerable<Patient>> GetAllPatientsAsync(string? searchTerm)
        {
            using var connection = _dbContext.CreateConnection();
            var sql = "SELECT * FROM Patients WHERE 1=1";
            var parameters = new DynamicParameters();

            if (!string.IsNullOrEmpty(searchTerm))
            {
                sql += " AND (Name LIKE @Search OR Mobile LIKE @Search)";
                parameters.Add("@Search", $"%{searchTerm}%");
            }
            
            sql += " ORDER BY Name";

            return await connection.QueryAsync<Patient>(sql, parameters);
        }
    }
}
