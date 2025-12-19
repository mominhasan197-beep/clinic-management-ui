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
            // Per Location
            var queryLocation = @"
                SELECT l.LocationName, COUNT(a.AppointmentId) as Count
                FROM Appointments a
                JOIN Locations l ON a.LocationId = l.LocationId
                GROUP BY l.LocationName";
            stats.AppointmentsPerLocation = (await connection.QueryAsync<LocationAppointmentCountDto>(queryLocation)).ToList();

            return stats;
        }

        public async Task<IEnumerable<AppointmentDto>> GetAllAppointmentsAsync(string? doctorName, string? location, string? status, DateTime? startDate, DateTime? endDate, int? patientId = null, string? searchTerm = null)
        {
            using var connection = _dbContext.CreateConnection();
            var sql = @"
                SELECT a.*, p.Name as PatientName, p.Age, p.Gender, p.Mobile, p.Email, l.LocationName, d.Name as DoctorName
                FROM Appointments a
                JOIN Patients p ON a.PatientId = p.PatientId
                JOIN Locations l ON a.LocationId = l.LocationId
                JOIN Doctors d ON a.DoctorId = d.DoctorId
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
                sql += " AND l.LocationName LIKE @Location";
                parameters.Add("@Location", $"%{location}%");
            }

            if (!string.IsNullOrEmpty(status))
            {
                sql += " AND a.Status = @Status";
                parameters.Add("@Status", status);
            }

            if (startDate.HasValue)
            {
                parameters.Add("@StartDate", startDate.Value.Date);
            }

            if (endDate.HasValue)
            {
                sql += " AND CAST(a.AppointmentDate AS DATE) <= @EndDate";
                parameters.Add("@EndDate", endDate.Value.Date);
            }

            if (patientId.HasValue)
            {
                sql += " AND a.PatientId = @PatientId";
                parameters.Add("@PatientId", patientId.Value);
            }

            if (!string.IsNullOrEmpty(searchTerm))
            {
                sql += " AND (p.Name LIKE @SearchTerm OR a.ReferenceNumber LIKE @SearchTerm)";
                parameters.Add("@SearchTerm", $"%{searchTerm}%");
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
            var sql = @"
                SELECT 
                    p.PatientId,
                    p.Name,
                    p.Age,
                    p.Gender,
                    p.Mobile as Mobile,
                    p.Email,
                    p.BloodGroup,
                    (SELECT COUNT(*) FROM Appointments a WHERE a.PatientId = p.PatientId) as TotalVisits,
                    (SELECT TOP 1 AppointmentDate FROM Appointments a WHERE a.PatientId = p.PatientId ORDER BY AppointmentDate DESC) as LastVisit
                FROM Patients p 
                WHERE 1=1";
            
            var countSql = "SELECT COUNT(*) FROM Patients p WHERE 1=1";

            var parameters = new DynamicParameters();

            if (!string.IsNullOrEmpty(searchTerm))
            {
                var filter = " AND (p.Name LIKE @Search OR p.Mobile LIKE @Search)";
                sql += filter;
                countSql += filter;
                parameters.Add("@Search", $"%{searchTerm}%");
            }
            
            sql += " ORDER BY p.Name OFFSET @Offset ROWS FETCH NEXT @PageSize ROWS ONLY";
            parameters.Add("@Offset", (page - 1) * pageSize);
            parameters.Add("@PageSize", pageSize);

            var totalCount = await connection.ExecuteScalarAsync<int>(countSql, parameters);
            var result = await connection.QueryAsync<dynamic>(sql, parameters);

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
