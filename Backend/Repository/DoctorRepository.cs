using Dapper;
using ClinicManagementAPI.Data;
using ClinicManagementAPI.Models.Entities;
using ClinicManagementAPI.Models.DTOs;
using System.Data;

namespace ClinicManagementAPI.Repository
{
    public interface IDoctorRepository
    {
        Task<DoctorLogin?> GetDoctorLoginAsync(string username);
        Task<Doctor?> GetDoctorByIdAsync(int doctorId);
        Task<DashboardStatsDto> GetDashboardStatsAsync(int doctorId);
        Task<IEnumerable<AppointmentDto>> GetAppointmentsAsync(int doctorId, string period);
        Task<IEnumerable<AppointmentDto>> GetAppointmentsByDateAsync(int doctorId, DateTime date);
        Task<IEnumerable<AppointmentDto>> GetAppointmentsByMonthAsync(int doctorId, int month, int year);
        Task UpdateLastLoginAsync(int doctorId);
    }

    public class DoctorRepository : IDoctorRepository
    {
        private readonly IDbContext _dbContext;

        public DoctorRepository(IDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        public async Task<DoctorLogin?> GetDoctorLoginAsync(string username)
        {
            using var connection = _dbContext.CreateConnection();
            var query = @"
                SELECT LoginId, DoctorId, Username, PasswordHash, LastLogin, CreatedOn, ModifiedOn
                FROM DoctorsLogin
                WHERE LOWER(Username) = LOWER(@Username)";
            
            return await connection.QueryFirstOrDefaultAsync<DoctorLogin>(query, new { Username = username });
        }

        public async Task<Doctor?> GetDoctorByIdAsync(int doctorId)
        {
            using var connection = _dbContext.CreateConnection();
            var query = @"
                SELECT DoctorId, Name, Qualifications, Specializations, Experience, Email, Phone, IsActive, CreatedOn
                FROM Doctors
                WHERE DoctorId = @DoctorId";
            
            return await connection.QueryFirstOrDefaultAsync<Doctor>(query, new { DoctorId = doctorId });
        }

        public async Task<DashboardStatsDto> GetDashboardStatsAsync(int doctorId)
        {
            using var connection = _dbContext.CreateConnection();
            var parameters = new { DoctorId = doctorId };
            
            // The stored procedure returns TodayCount, WeekCount, MonthCount, YearCount
            // We need to map them to Today, ThisWeek, ThisMonth, ThisYear
            var result = await connection.QueryFirstOrDefaultAsync<dynamic>(
                "sp_GetDashboardStats",
                parameters,
                commandType: CommandType.StoredProcedure);
            
            if (result == null)
            {
                return new DashboardStatsDto();
            }
            
            return new DashboardStatsDto
            {
                Today = result.TodayCount ?? 0,
                ThisWeek = result.WeekCount ?? 0,
                ThisMonth = result.MonthCount ?? 0,
                ThisYear = result.YearCount ?? 0
            };
        }

        public async Task<IEnumerable<AppointmentDto>> GetAppointmentsForDoctorAsync(int doctorId, string period)
        {
            using var connection = _dbContext.CreateConnection();
            var parameters = new DynamicParameters();
            parameters.Add("@DoctorId", doctorId);
            parameters.Add("@Period", period);
            parameters.Add("@StartDate", dbType: DbType.Date, direction: ParameterDirection.Output);
            parameters.Add("@EndDate", dbType: DbType.Date, direction: ParameterDirection.Output);
            
            var appointments = await connection.QueryAsync<dynamic>(
                "sp_GetAppointmentsForDoctor",
                parameters,
                commandType: CommandType.StoredProcedure);
            
            return appointments.Select(a => new AppointmentDto
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

        public async Task<IEnumerable<AppointmentDto>> GetAppointmentsForDoctorByDateAsync(int doctorId, DateTime appointmentDate)
        {
            using var connection = _dbContext.CreateConnection();
            var parameters = new DynamicParameters();
            parameters.Add("@DoctorId", doctorId);
            parameters.Add("@AppointmentDate", appointmentDate.Date);
            
            var appointments = await connection.QueryAsync<dynamic>(
                "sp_GetAppointmentsForDoctorByDate",
                parameters,
                commandType: CommandType.StoredProcedure);
            
            return appointments.Select(a => new AppointmentDto
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
                Status = a.Status ?? "Upcoming",
                Remarks = a.Remarks,
                Diagnosis = a.Diagnosis,
                Treatment = a.Treatment,
                DoctorNotes = a.DoctorNotes,
                Fees = a.Fees
            });
        }

        public async Task<IEnumerable<AppointmentDto>> GetAppointmentsAsync(int doctorId, string period)
        {
            using var connection = _dbContext.CreateConnection();
            string query = period.ToLower() switch
            {
                "today" => @"
                    SELECT * FROM Appointments 
                    WHERE DoctorId = @DoctorId 
                    AND CAST(AppointmentDate AS DATE) = CAST(GETDATE() AS DATE)
                    ORDER BY AppointmentTime",
                "week" => @"
                    SELECT * FROM Appointments 
                    WHERE DoctorId = @DoctorId 
                    AND AppointmentDate >= CAST(GETDATE() AS DATE)
                    AND AppointmentDate <= DATEADD(day, 7, CAST(GETDATE() AS DATE))
                    ORDER BY AppointmentDate, AppointmentTime",
                "month" => @"
                    SELECT * FROM Appointments 
                    WHERE DoctorId = @DoctorId 
                    AND MONTH(AppointmentDate) = MONTH(GETDATE())
                    AND YEAR(AppointmentDate) = YEAR(GETDATE())
                    ORDER BY AppointmentDate, AppointmentTime",
                _ => "SELECT * FROM Appointments WHERE DoctorId = @DoctorId ORDER BY AppointmentDate DESC"
            };

            return await connection.QueryAsync<AppointmentDto>(query, new { DoctorId = doctorId });
        }

        public async Task<IEnumerable<AppointmentDto>> GetAppointmentsByDateAsync(int doctorId, DateTime date)
        {
            using var connection = _dbContext.CreateConnection();
            var query = @"
                SELECT * FROM Appointments 
                WHERE DoctorId = @DoctorId 
                AND CAST(AppointmentDate AS DATE) = CAST(@Date AS DATE)
                ORDER BY AppointmentTime";

            return await connection.QueryAsync<AppointmentDto>(query, new { DoctorId = doctorId, Date = date });
        }

        public async Task<IEnumerable<AppointmentDto>> GetAppointmentsByMonthAsync(int doctorId, int month, int year)
        {
            using var connection = _dbContext.CreateConnection();
            var query = @"
                SELECT 
                    AppointmentId, ReferenceNumber, PatientId, PatientName, Age, Gender, Mobile, Email,
                    AppointmentDate, AppointmentTime, LocationName, Status, Remarks, Diagnosis, Treatment,
                    DoctorNotes, Fees
                FROM Appointments 
                WHERE DoctorId = @DoctorId 
                AND MONTH(AppointmentDate) = @Month
                AND YEAR(AppointmentDate) = @Year
                ORDER BY AppointmentDate, AppointmentTime";

            return await connection.QueryAsync<AppointmentDto>(query, new { DoctorId = doctorId, Month = month, Year = year });
        }

        public async Task UpdateLastLoginAsync(int doctorId)
        {
            using var connection = _dbContext.CreateConnection();
            var query = @"
                UPDATE DoctorsLogin
                SET LastLogin = GETDATE()
                WHERE DoctorId = @DoctorId";
            
            await connection.ExecuteAsync(query, new { DoctorId = doctorId });
        }
    }
}
