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
            return await connection.QueryFirstOrDefaultAsync<Patient>(
                "sp_Patient_GetById", 
                new { PatientId = patientId },
                commandType: CommandType.StoredProcedure);
        }

        public async Task<IEnumerable<PatientHistoryDto>> GetPatientHistoryAsync(int patientId)
        {
            using var connection = _dbContext.CreateConnection();
            var parameters = new { PatientId = patientId };
            
            using var multi = await connection.QueryMultipleAsync(
                "sp_GetPatientHistory",
                parameters,
                commandType: CommandType.StoredProcedure);
            
            await multi.ReadAsync(); // Skip patient details
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
        
        public async Task<(PatientDto? patient, IEnumerable<AppointmentDto> appointments)> GetAppointmentHistoryByMobileAsync(string mobile)
        {
            using var connection = _dbContext.CreateConnection();
            using var multi = await connection.QueryMultipleAsync(
                "sp_Patient_GetAppointmentHistoryByMobile", 
                new { Mobile = mobile },
                commandType: CommandType.StoredProcedure);

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

            var appointmentRaw = await multi.ReadAsync<dynamic>();
            var appointments = new List<AppointmentDto>();

            foreach (var a in appointmentRaw)
            {
                try 
                {
                    var dto = new AppointmentDto
                    {
                        AppointmentId = a.AppointmentId != null ? Convert.ToInt32(a.AppointmentId) : 0,
                        ReferenceNumber = a.ReferenceNumber != null ? Convert.ToString(a.ReferenceNumber) : string.Empty,
                        PatientId = a.PatientId != null ? Convert.ToInt32(a.PatientId) : 0,
                        Status = a.Status != null ? Convert.ToString(a.Status) : string.Empty,
                        Remarks = a.Remarks != null ? Convert.ToString(a.Remarks) : null,
                        Diagnosis = a.Diagnosis != null ? Convert.ToString(a.Diagnosis) : null,
                        Treatment = a.Treatment != null ? Convert.ToString(a.Treatment) : null,
                        DoctorNotes = a.DoctorNotes != null ? Convert.ToString(a.DoctorNotes) : null,
                        Fees = a.Fees != null ? Convert.ToDecimal(a.Fees) : (decimal?)null,
                        PatientName = a.PatientName != null ? Convert.ToString(a.PatientName) : string.Empty,
                        Age = a.Age != null ? Convert.ToInt32(a.Age) : (int?)null,
                        Mobile = a.Mobile != null ? Convert.ToString(a.Mobile) : string.Empty,
                        Email = a.Email != null ? Convert.ToString(a.Email) : null,
                        DoctorName = a.DoctorName != null ? Convert.ToString(a.DoctorName) : string.Empty,
                        LocationName = a.LocationName != null ? Convert.ToString(a.LocationName) : string.Empty
                    };

                    if (a.AppointmentDate != null)
                    {
                        if (a.AppointmentDate is DateTime dt) dto.AppointmentDate = dt.ToString("yyyy-MM-dd");
                        else if (DateTime.TryParse(Convert.ToString(a.AppointmentDate), out DateTime dtParse)) dto.AppointmentDate = dtParse.ToString("yyyy-MM-dd");
                    }

                    if (a.AppointmentTime != null)
                    {
                        if (a.AppointmentTime is TimeSpan ts) dto.AppointmentTime = ts.ToString(@"hh\:mm");
                        else if (a.AppointmentTime is DateTime dt) dto.AppointmentTime = dt.ToString("HH:mm");
                        else if (TimeSpan.TryParse(Convert.ToString(a.AppointmentTime), out TimeSpan tsParse)) dto.AppointmentTime = tsParse.ToString(@"hh\:mm");
                    }

                    appointments.Add(dto);
                }
                catch { continue; }
            }

            return (patient, appointments);
        }

  }
}
