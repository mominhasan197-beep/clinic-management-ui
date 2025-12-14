using Dapper;
using ClinicManagementAPI.Data;
using ClinicManagementAPI.Models.Entities;
using ClinicManagementAPI.Models.DTOs;
using System.Data;

namespace ClinicManagementAPI.Repository
{
    public interface IPatientRepository
    {
        Task<IEnumerable<PatientDto>> SearchPatientAsync(string query);
        Task<Patient?> GetPatientByIdAsync(int patientId);
        Task<IEnumerable<PatientHistoryDto>> GetPatientHistoryAsync(int patientId);
        Task<(PatientDto? patient, IEnumerable<AppointmentDto> appointments)> GetAppointmentHistoryByMobileAsync(string mobile);
    }

    public class PatientRepository : IPatientRepository
    {
        private readonly IDbContext _dbContext;

        public PatientRepository(IDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        public async Task<IEnumerable<PatientDto>> SearchPatientAsync(string query)
        {
            using var connection = _dbContext.CreateConnection();
            var parameters = new { SearchQuery = query };
            
            var patients = await connection.QueryAsync<dynamic>(
                "sp_SearchPatient",
                parameters,
                commandType: CommandType.StoredProcedure);
            
            return patients.Select(p => new PatientDto
            {
                PatientId = p.PatientId,
                Name = p.Name,
                Age = p.Age,
                Gender = p.Gender,
                Mobile = p.Mobile,
                Email = p.Email,
                BloodGroup = p.BloodGroup,
                TotalVisits = p.TotalVisits,
                LastVisit = p.LastVisit != null ? ((DateTime)p.LastVisit).ToString("yyyy-MM-dd") : null
            });
        }

        public async Task<Patient?> GetPatientByIdAsync(int patientId)
        {
            using var connection = _dbContext.CreateConnection();
            var query = @"
                SELECT PatientId, Name, Age, Gender, Mobile, Email, BloodGroup, Address, CreatedOn
                FROM Patients
                WHERE PatientId = @PatientId";
            
            return await connection.QueryFirstOrDefaultAsync<Patient>(query, new { PatientId = patientId });
        }

        public async Task<IEnumerable<PatientHistoryDto>> GetPatientHistoryAsync(int patientId)
        {
            using var connection = _dbContext.CreateConnection();
            var parameters = new { PatientId = patientId };
            
            using var multi = await connection.QueryMultipleAsync(
                "sp_GetPatientHistory",
                parameters,
                commandType: CommandType.StoredProcedure);
            
            // Skip patient details (first result set)
            await multi.ReadAsync();
            
            // Get history (second result set)
            var history = await multi.ReadAsync<dynamic>();
            
            return history.Select(h => new PatientHistoryDto
            {
                HistoryId = h.HistoryId,
                AppointmentId = h.AppointmentId,
                VisitDate = ((DateTime)h.VisitDate).ToString("yyyy-MM-dd"),
                VisitTime = ((TimeSpan)h.VisitTime).ToString(@"hh\:mm"),
                DoctorName = h.DoctorName,
                LocationName = h.LocationName,
                Diagnosis = h.Diagnosis,
                Treatment = h.Treatment,
                Notes = h.Notes,
                Remarks = h.Remarks,
                Fees = h.Fees
            });
        }
        
        public async Task<(PatientDto? patient, IEnumerable<AppointmentDto> appointments)>GetAppointmentHistoryByMobileAsync(string mobile)
    {
      using var connection = _dbContext.CreateConnection();

      var sql = @"
        -- Fetch Patient
        SELECT TOP 1 *
        FROM Patients
        WHERE REPLACE(Mobile, ' ', '') LIKE '%' + @Mobile + '%';

        -- Fetch Appointments
        SELECT 
            a.AppointmentId, a.ReferenceNumber, a.Status, a.Remarks,
            a.AppointmentDate, a.AppointmentTime,
            a.PatientId,
            a.Diagnosis, a.Treatment, a.DoctorNotes, a.Fees,
            p.Name as PatientName, p.Age, p.Mobile, p.Email,
            d.Name as DoctorName,
            l.LocationName
        FROM Appointments a
        INNER JOIN Patients p ON a.PatientId = p.PatientId
        INNER JOIN Doctors d ON a.DoctorId = d.DoctorId
        INNER JOIN Locations l ON a.LocationId = l.LocationId
        WHERE REPLACE(p.Mobile, ' ', '') LIKE '%' + @Mobile + '%'
        ORDER BY a.AppointmentDate DESC, a.AppointmentTime DESC;
    ";

      using var multi = await connection.QueryMultipleAsync(sql, new { Mobile = mobile });

      // -------------------------
      // Patient Mapping
      // -------------------------
      // -------------------------
      // Patient Mapping
      // -------------------------
      var patientRaw = await multi.ReadFirstOrDefaultAsync<dynamic>();

      PatientDto? patient = null;

      if (patientRaw != null)
      {
        patient = new PatientDto
        {
          PatientId = patientRaw.PatientId != null ? Convert.ToInt32(patientRaw.PatientId) : 0,
          Name = patientRaw.Name != null ? Convert.ToString(patientRaw.Name) : string.Empty,
          Age = patientRaw.Age != null ? Convert.ToInt32(patientRaw.Age) : (int?)null,
          Gender = patientRaw.Gender != null ? Convert.ToString(patientRaw.Gender) : null,
          Mobile = patientRaw.Mobile != null ? Convert.ToString(patientRaw.Mobile) : string.Empty,
          Email = patientRaw.Email != null ? Convert.ToString(patientRaw.Email) : null,
          BloodGroup = patientRaw.BloodGroup != null ? Convert.ToString(patientRaw.BloodGroup) : null
        };
      }

      // -------------------------
      // Appointment Mapping
      // -------------------------
      var appointmentRaw = await multi.ReadAsync<dynamic>();
      var appointments = new List<AppointmentDto>();

      foreach (var a in appointmentRaw)
      {
        var dto = new AppointmentDto();

        // Safer mapping using Convert to handle potential type mismatches
        try 
        {
             dto.AppointmentId = a.AppointmentId != null ? Convert.ToInt32(a.AppointmentId) : 0;
             dto.ReferenceNumber = a.ReferenceNumber != null ? Convert.ToString(a.ReferenceNumber) : string.Empty;
             dto.PatientId = a.PatientId != null ? Convert.ToInt32(a.PatientId) : 0;
             dto.Status = a.Status != null ? Convert.ToString(a.Status) : string.Empty;
             dto.Remarks = a.Remarks != null ? Convert.ToString(a.Remarks) : null;
             dto.Diagnosis = a.Diagnosis != null ? Convert.ToString(a.Diagnosis) : null;
             dto.Treatment = a.Treatment != null ? Convert.ToString(a.Treatment) : null;
             dto.DoctorNotes = a.DoctorNotes != null ? Convert.ToString(a.DoctorNotes) : null;
             dto.Fees = a.Fees != null ? Convert.ToDecimal(a.Fees) : (decimal?)null;
             dto.PatientName = a.PatientName != null ? Convert.ToString(a.PatientName) : string.Empty;
             dto.Age = a.Age != null ? Convert.ToInt32(a.Age) : (int?)null;
             dto.Mobile = a.Mobile != null ? Convert.ToString(a.Mobile) : string.Empty;
             dto.Email = a.Email != null ? Convert.ToString(a.Email) : null;
             dto.DoctorName = a.DoctorName != null ? Convert.ToString(a.DoctorName) : string.Empty;
             dto.LocationName = a.LocationName != null ? Convert.ToString(a.LocationName) : string.Empty;

            // Date Parsing
            if (a.AppointmentDate != null)
            {
                if (a.AppointmentDate is DateTime dt) dto.AppointmentDate = dt.ToString("yyyy-MM-dd");
                else if (DateTime.TryParse(Convert.ToString(a.AppointmentDate), out DateTime dtParse)) dto.AppointmentDate = dtParse.ToString("yyyy-MM-dd");
            }

            // Time Parsing
            if (a.AppointmentTime != null)
            {
                if (a.AppointmentTime is TimeSpan ts) dto.AppointmentTime = ts.ToString(@"hh\:mm");
                else if (a.AppointmentTime is DateTime dt) dto.AppointmentTime = dt.ToString("HH:mm");
                else if (TimeSpan.TryParse(Convert.ToString(a.AppointmentTime), out TimeSpan tsParse)) dto.AppointmentTime = tsParse.ToString(@"hh\:mm");
            }

            appointments.Add(dto);
        }
        catch
        {
             // If a single row fails, skip it instead of crashing the entire request
             continue;
        }
      }

      return (patient, appointments);
    }

  }
}
