namespace ClinicManagementAPI.Models.Entities
{
    public class Doctor
    {
        public int DoctorId { get; set; }
        public string Name { get; set; } = string.Empty;
        public string? Qualifications { get; set; }
        public string? Specializations { get; set; }
        public int? Experience { get; set; }
        public string? Email { get; set; }
        public string? Phone { get; set; }
        public bool IsActive { get; set; } = true;
        public DateTime CreatedOn { get; set; }
    }

    public class Location
    {
        public int LocationId { get; set; }
        public string LocationName { get; set; } = string.Empty;
        public string? Address { get; set; }
        public string? City { get; set; }
        public string? State { get; set; }
        public string? Phone { get; set; }
        public string? AvailableHours { get; set; }
        public bool IsActive { get; set; } = true;
        public DateTime CreatedOn { get; set; }
    }

    public class Patient
    {
        public int PatientId { get; set; }
        public string Name { get; set; } = string.Empty;
        public int? Age { get; set; }
        public string? Gender { get; set; }
        public string Mobile { get; set; } = string.Empty;
        public string? Email { get; set; }
        public string? BloodGroup { get; set; }
        public string? Address { get; set; }
        public DateTime CreatedOn { get; set; }
    }

    public class Appointment
    {
        public int AppointmentId { get; set; }
        public string ReferenceNumber { get; set; } = string.Empty;
        public int PatientId { get; set; }
        public int DoctorId { get; set; }
        public int LocationId { get; set; }
        public DateTime AppointmentDate { get; set; }
        public TimeSpan AppointmentTime { get; set; }
        public string Status { get; set; } = "Upcoming";
        public string? Remarks { get; set; }
        public string? Diagnosis { get; set; }
        public string? Treatment { get; set; }
        public string? DoctorNotes { get; set; }
        public decimal? Fees { get; set; }
        public DateTime CreatedOn { get; set; }
    }

    public class DoctorAvailability
    {
        public int AvailabilityId { get; set; }
        public int DoctorId { get; set; }
        public int LocationId { get; set; }
        public int? DayOfWeek { get; set; }
        public TimeSpan StartTime { get; set; }
        public TimeSpan EndTime { get; set; }
        public int SlotDuration { get; set; } = 30;
        public bool IsActive { get; set; } = true;
    }

    public class PatientHistory
    {
        public int HistoryId { get; set; }
        public int PatientId { get; set; }
        public int DoctorId { get; set; }
        public int LocationId { get; set; }
        public DateTime VisitDate { get; set; }
        public TimeSpan VisitTime { get; set; }
        public string? Diagnosis { get; set; }
        public string? Treatment { get; set; }
        public string? Notes { get; set; }
        public DateTime CreatedOn { get; set; }
    }

    public class DoctorLogin
    {
        public int LoginId { get; set; }
        public int DoctorId { get; set; }
        public string Username { get; set; } = string.Empty;
        public string PasswordHash { get; set; } = string.Empty;
        public DateTime? LastLogin { get; set; }
        public DateTime CreatedOn { get; set; }
        public DateTime? ModifiedOn { get; set; }
    }

    public class SuperAdmin
    {
        public int AdminId { get; set; }
        public string Username { get; set; } = string.Empty;
        public string PasswordHash { get; set; } = string.Empty;
        public bool IsActive { get; set; } = true;
        public DateTime CreatedOn { get; set; }
        public DateTime? LastLogin { get; set; }
    }
}
