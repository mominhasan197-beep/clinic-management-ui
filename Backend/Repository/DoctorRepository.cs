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
            return await connection.QueryFirstOrDefaultAsync<DoctorLogin>(
                "sp_Doctor_GetLogin", 
                new { Username = username },
                commandType: CommandType.StoredProcedure);
        }

        public async Task<Doctor?> GetDoctorByIdAsync(int doctorId)
        {
            using var connection = _dbContext.CreateConnection();
            return await connection.QueryFirstOrDefaultAsync<Doctor>(
                "sp_Doctor_GetById", 
                new { DoctorId = doctorId },
                commandType: CommandType.StoredProcedure);
        }

        public async Task<DashboardStatsDto> GetDashboardStatsAsync(int doctorId)
        {
            using var connection = _dbContext.CreateConnection();
            var parameters = new { DoctorId = doctorId };
            
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

        public async Task<IEnumerable<AppointmentDto>> GetAppointmentsAsync(int doctorId, string period)
        {
            using var connection = _dbContext.CreateConnection();
            var appointments = await connection.QueryAsync<dynamic>(
                "sp_Doctor_GetAppointments",
                new { DoctorId = doctorId, Period = period.ToLower() },
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

        public async Task<IEnumerable<AppointmentDto>> GetAppointmentsByDateAsync(int doctorId, DateTime date)
        {
            using var connection = _dbContext.CreateConnection();
            var parameters = new { DoctorId = doctorId, AppointmentDate = date.Date };
            
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

        public async Task<IEnumerable<AppointmentDto>> GetAppointmentsByMonthAsync(int doctorId, int month, int year)
        {
            using var connection = _dbContext.CreateConnection();
            var appointments = await connection.QueryAsync<dynamic>(
                "sp_Doctor_GetAppointmentsByMonth",
                new { DoctorId = doctorId, Month = month, Year = year },
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

        public async Task UpdateLastLoginAsync(int doctorId)
        {
            using var connection = _dbContext.CreateConnection();
            await connection.ExecuteAsync(
                "sp_Doctor_UpdateLastLogin", 
                new { DoctorId = doctorId },
                commandType: CommandType.StoredProcedure);
        }
    }
}
