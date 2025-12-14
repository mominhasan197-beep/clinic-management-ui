using ClinicManagementAPI.Repository;
using ClinicManagementAPI.Models.DTOs;
using ClinicManagementAPI.Models.Responses;

namespace ClinicManagementAPI.Services
{
    public interface IPatientService
    {
        Task<IEnumerable<PatientDto>> SearchPatientAsync(string query);
        Task<PatientHistoryResponse> GetPatientHistoryAsync(int patientId);
        Task<PatientAppointmentHistoryResponse> GetAppointmentHistoryByMobileAsync(string mobile);
    }

    public class PatientService : IPatientService
    {
        private readonly IPatientRepository _patientRepository;

        public PatientService(IPatientRepository patientRepository)
        {
            _patientRepository = patientRepository;
        }

        public async Task<IEnumerable<PatientDto>> SearchPatientAsync(string query)
        {
            return await _patientRepository.SearchPatientAsync(query);
        }

        public async Task<PatientHistoryResponse> GetPatientHistoryAsync(int patientId)
        {
            var patient = await _patientRepository.GetPatientByIdAsync(patientId);
            var history = await _patientRepository.GetPatientHistoryAsync(patientId);

            if (patient == null)
            {
                return new PatientHistoryResponse
                {
                    Patient = null,
                    History = new List<PatientHistoryDto>()
                };
            }

            return new PatientHistoryResponse
            {
                Patient = new PatientDetailsResponse
                {
                    PatientId = patient.PatientId,
                    Name = patient.Name,
                    Age = patient.Age,
                    Gender = patient.Gender,
                    Mobile = patient.Mobile,
                    Email = patient.Email,
                    BloodGroup = patient.BloodGroup
                },
                History = history.ToList()
            };
        }

        public async Task<PatientAppointmentHistoryResponse> GetAppointmentHistoryByMobileAsync(string mobile)
        {
            var (patient, appointments) = await _patientRepository.GetAppointmentHistoryByMobileAsync(mobile);

            if (patient == null)
            {
                return new PatientAppointmentHistoryResponse
                {
                    Patient = null,
                    Appointments = new List<AppointmentDto>()
                };
            }

            return new PatientAppointmentHistoryResponse
            {
                Patient = patient,
                Appointments = appointments.ToList()
            };
        }
    }
}
