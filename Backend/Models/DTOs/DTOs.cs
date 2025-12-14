namespace ClinicManagementAPI.Models.DTOs
{
    public class DoctorDto
    {
        public int DoctorId { get; set; }
        public string Name { get; set; } = string.Empty;
        public string? Qualifications { get; set; }
        public List<string> Specializations { get; set; } = new();
        public int? Experience { get; set; }
        public string? Email { get; set; }
        public string? Phone { get; set; }
        public bool IsAvailable { get; set; }
    }

    public class LocationDto
    {
        public int LocationId { get; set; }
        public string LocationName { get; set; } = string.Empty;
        public string? Address { get; set; }
        public string? AvailableHours { get; set; }
        public int DoctorCount { get; set; }
    }

    public class AppointmentDto
    {
        public int AppointmentId { get; set; }
        public string ReferenceNumber { get; set; } = string.Empty;
        public int? PatientId { get; set; }
        public string PatientName { get; set; } = string.Empty;
        public int? Age { get; set; }
        public string? Gender { get; set; }
        public string Mobile { get; set; } = string.Empty;
        public string? Email { get; set; }
        public string DoctorName { get; set; } = string.Empty;
        public string AppointmentDate { get; set; } = string.Empty;
        public string AppointmentTime { get; set; } = string.Empty;
        public string LocationName { get; set; } = string.Empty;
        public string Status { get; set; } = string.Empty;
        public string? Remarks { get; set; }
        public string? Diagnosis { get; set; }
        public string? Treatment { get; set; }
        public string? DoctorNotes { get; set; }
        public decimal? Fees { get; set; }
    }

    public class TimeSlotDto
    {
        public string Time { get; set; } = string.Empty;
        public bool IsAvailable { get; set; }
        public string? Reason { get; set; }
        public int? SlotId { get; set; }
        public int? Remaining { get; set; }
    }

    public class AvailableSlotsDto
    {
        public string Date { get; set; } = string.Empty;
        public int LocationId { get; set; }
        public List<TimeSlotDto> Slots { get; set; } = new();
        public int RemainingSlotsForDay { get; set; }
    }

    public class PatientDto
    {
        public int PatientId { get; set; }
        public string Name { get; set; } = string.Empty;
        public int? Age { get; set; }
        public string? Gender { get; set; }
        public string Mobile { get; set; } = string.Empty;
        public string? Email { get; set; }
        public string? BloodGroup { get; set; }
        public int TotalVisits { get; set; }
        public string? LastVisit { get; set; }
    }

    public class PatientHistoryDto
    {
        public int? HistoryId { get; set; }
        public int? AppointmentId { get; set; }
        public string VisitDate { get; set; } = string.Empty;
        public string VisitTime { get; set; } = string.Empty;
        public string DoctorName { get; set; } = string.Empty;
        public string LocationName { get; set; } = string.Empty;
        public string? Diagnosis { get; set; }
        public string? Treatment { get; set; }
        public string? Notes { get; set; }
        public string? Remarks { get; set; }
        public decimal? Fees { get; set; }
    }

    public class DashboardStatsDto
    {
        public int Today { get; set; }
        public int ThisWeek { get; set; }
        public int ThisMonth { get; set; }
        public int ThisYear { get; set; }
    }
}
