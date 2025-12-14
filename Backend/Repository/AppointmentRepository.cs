using Dapper;
using ClinicManagementAPI.Data;
using ClinicManagementAPI.Models.Entities;
using ClinicManagementAPI.Models.DTOs;
using System.Data;

namespace ClinicManagementAPI.Repository
{
    public interface IAppointmentRepository
    {
        Task<IEnumerable<Location>> GetLocationsAsync();
        Task<IEnumerable<Doctor>> GetDoctorsByLocationAsync(int locationId);
        Task<(IEnumerable<DoctorAvailability> availability, IEnumerable<TimeSpan> bookedSlots)> GetAvailableSlotsAsync(int doctorId, int locationId, DateTime date);
        Task<(string referenceNumber, int appointmentId)> BookAppointmentAsync(
            string patientName, int age, string mobile, string? email, string? bloodGroup,
            int doctorId, int locationId, DateTime appointmentDate, TimeSpan appointmentTime, string? remarks);
        Task<Appointment?> GetAppointmentByIdAsync(int appointmentId);
        Task<bool> UpdateAppointmentAsync(int appointmentId, string? status, string? remarks, string? diagnosis, string? treatment, string? doctorNotes, decimal? fees);
    }

    public class AppointmentRepository : IAppointmentRepository
    {
        private readonly IDbContext _dbContext;

        public AppointmentRepository(IDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        public async Task<IEnumerable<Location>> GetLocationsAsync()
        {
            using var connection = _dbContext.CreateConnection();
            var query = @"
                SELECT LocationId, LocationName, Address, City, State, Phone, AvailableHours, IsActive
                FROM Locations
                WHERE IsActive = 1";
            
            return await connection.QueryAsync<Location>(query);
        }

        public async Task<IEnumerable<Doctor>> GetDoctorsByLocationAsync(int locationId)
        {
            using var connection = _dbContext.CreateConnection();
            var parameters = new { LocationId = locationId };
            
            return await connection.QueryAsync<Doctor>(
                "sp_GetDoctorsByLocation",
                parameters,
                commandType: CommandType.StoredProcedure);
        }

        public async Task<(IEnumerable<DoctorAvailability> availability, IEnumerable<TimeSpan> bookedSlots)> GetAvailableSlotsAsync(int doctorId, int locationId, DateTime date)
        {
            using var connection = _dbContext.CreateConnection();
            var sqlAvailability = @"
                SELECT * FROM DoctorAvailability 
                WHERE DoctorId = @DoctorId 
                  AND LocationId = @LocationId 
                  AND IsActive = 1";
            
            var sqlBooked = @"
                SELECT AppointmentTime 
                FROM Appointments 
                WHERE DoctorId = @DoctorId 
                  AND LocationId = @LocationId 
                  AND CAST(AppointmentDate AS DATE) = CAST(@Date AS DATE) 
                  AND Status != 'Cancelled'";

            using var multi = await connection.QueryMultipleAsync(
                $"{sqlAvailability}; {sqlBooked}", 
                new { DoctorId = doctorId, LocationId = locationId, Date = date });
            
            var availabilityRaw = await multi.ReadAsync<dynamic>();
            var availability = new List<DoctorAvailability>();
            
            foreach (var item in availabilityRaw)
            {
                var avail = new DoctorAvailability
                {
                    AvailabilityId = item.AvailabilityId != null ? (int)item.AvailabilityId : 0,
                    DoctorId = item.DoctorId != null ? (int)item.DoctorId : 0,
                    LocationId = item.LocationId != null ? (int)item.LocationId : 0,
                    DayOfWeek = item.DayOfWeek as int?,
                    IsActive = item.IsActive != null ? (bool)item.IsActive : true,
                    SlotDuration = item.SlotDuration != null ? (int)item.SlotDuration : 30
                };

                // Robust parsing for StartTime
                if (item.StartTime != null)
                {
                    var startVal = item.StartTime;
                    if (startVal is TimeSpan tsStart) avail.StartTime = tsStart;
                    else if (startVal is DateTime dtStart) avail.StartTime = dtStart.TimeOfDay;
                    else if (startVal is string sStart && TimeSpan.TryParse(sStart, out var ptsStart)) avail.StartTime = ptsStart;
                }

                // Robust parsing for EndTime
                if (item.EndTime != null)
                {
                    var endVal = item.EndTime;
                    if (endVal is TimeSpan tsEnd) avail.EndTime = tsEnd;
                    else if (endVal is DateTime dtEnd) avail.EndTime = dtEnd.TimeOfDay;
                    else if (endVal is string sEnd && TimeSpan.TryParse(sEnd, out var ptsEnd)) avail.EndTime = ptsEnd;
                }

                availability.Add(avail);
            }
            // Handle booked slots mapping safely
            var bookedRaw = await multi.ReadAsync<dynamic>();
            var bookedSlots = new List<TimeSpan>();
            foreach (var item in bookedRaw)
            {
                var val = item.AppointmentTime;
                if (val is TimeSpan ts) bookedSlots.Add(ts);
                else if (val is DateTime dt) bookedSlots.Add(dt.TimeOfDay);
                else if (val is string s && TimeSpan.TryParse(s, out var pts)) bookedSlots.Add(pts);
            }

            return (availability, bookedSlots);
        }

        public async Task<(string referenceNumber, int appointmentId)> BookAppointmentAsync(
            string patientName, int age, string mobile, string? email, string? bloodGroup,
            int doctorId, int locationId, DateTime appointmentDate, TimeSpan appointmentTime, string? remarks)
        {
            using var connection = _dbContext.CreateConnection();
            
            var parameters = new DynamicParameters();
            parameters.Add("@PatientName", patientName);
            parameters.Add("@Age", age);
            parameters.Add("@Mobile", mobile);
            parameters.Add("@Email", email);
            parameters.Add("@BloodGroup", bloodGroup);
            parameters.Add("@DoctorId", doctorId);
            parameters.Add("@LocationId", locationId);
            parameters.Add("@AppointmentDate", appointmentDate);
            parameters.Add("@AppointmentTime", appointmentTime);
            parameters.Add("@Remarks", remarks);
            parameters.Add("@ReferenceNumber", dbType: DbType.String, direction: ParameterDirection.Output, size: 50);
            parameters.Add("@AppointmentId", dbType: DbType.Int32, direction: ParameterDirection.Output);
            
            await connection.ExecuteAsync(
                "sp_BookAppointment",
                parameters,
                commandType: CommandType.StoredProcedure);
            
            var referenceNumber = parameters.Get<string>("@ReferenceNumber");
            var appointmentId = parameters.Get<int>("@AppointmentId");
            
            return (referenceNumber, appointmentId);
        }

        public async Task<Appointment?> GetAppointmentByIdAsync(int appointmentId)
        {
            using var connection = _dbContext.CreateConnection();
            var query = @"
                SELECT AppointmentId, ReferenceNumber, PatientId, DoctorId, LocationId,
                       AppointmentDate, AppointmentTime, Status, Remarks, Diagnosis, Treatment, DoctorNotes, Fees, CreatedOn
                FROM Appointments
                WHERE AppointmentId = @AppointmentId";
            
            return await connection.QueryFirstOrDefaultAsync<Appointment>(query, new { AppointmentId = appointmentId });
        }

        public async Task<bool> UpdateAppointmentAsync(int appointmentId, string? status, string? remarks, string? diagnosis, string? treatment, string? doctorNotes, decimal? fees)
        {
            using var connection = _dbContext.CreateConnection();
            var query = @"
                UPDATE Appointments
                SET
                    Status = COALESCE(@Status, Status),
                    Remarks = COALESCE(@Remarks, Remarks),
                    Diagnosis = COALESCE(@Diagnosis, Diagnosis),
                    Treatment = COALESCE(@Treatment, Treatment),
                    DoctorNotes = COALESCE(@DoctorNotes, DoctorNotes),
                    Fees = COALESCE(@Fees, Fees)
                WHERE AppointmentId = @AppointmentId";

            var rows = await connection.ExecuteAsync(query, new
            {
                AppointmentId = appointmentId,
                Status = status,
                Remarks = remarks,
                Diagnosis = diagnosis,
                Treatment = treatment,
                DoctorNotes = doctorNotes,
                Fees = fees
            });

            return rows > 0;
        }
    }
}
