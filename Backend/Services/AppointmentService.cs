using ClinicManagementAPI.Repository;
using ClinicManagementAPI.Models.DTOs;
using ClinicManagementAPI.Models.Requests;
using ClinicManagementAPI.Models.Responses;

namespace ClinicManagementAPI.Services
{
    public interface IAppointmentService
    {
        Task<IEnumerable<LocationDto>> GetLocationsAsync();
        Task<IEnumerable<DoctorDto>> GetDoctorsByLocationAsync(int locationId);
        Task<AvailableSlotsDto> GetAvailableSlotsAsync(int doctorId, int locationId, DateTime date);
        Task<BookAppointmentResponse> BookAppointmentAsync(BookAppointmentRequest request);
        Task<bool> UpdateAppointmentAsync(UpdateAppointmentRequest request);
    }

    public class AppointmentService : IAppointmentService
    {
        private readonly IAppointmentRepository _appointmentRepository;
        private readonly IDoctorRepository _doctorRepository;

        public AppointmentService(IAppointmentRepository appointmentRepository, IDoctorRepository doctorRepository)
        {
            _appointmentRepository = appointmentRepository;
            _doctorRepository = doctorRepository;
        }

        public async Task<IEnumerable<LocationDto>> GetLocationsAsync()
        {
            var locations = await _appointmentRepository.GetLocationsAsync();
            return locations.Select(l => new LocationDto
            {
                LocationId = l.LocationId,
                LocationName = l.LocationName,
                Address = l.Address,
                AvailableHours = l.AvailableHours
            });
        }

        public async Task<IEnumerable<DoctorDto>> GetDoctorsByLocationAsync(int locationId)
        {
            var doctors = await _appointmentRepository.GetDoctorsByLocationAsync(locationId);
            return doctors.Select(d => new DoctorDto
            {
                DoctorId = d.DoctorId,
                Name = d.Name,
                Qualifications = d.Qualifications,
                Specializations = d.Specializations?.Split(',').Select(s => s.Trim()).ToList() ?? new List<string>(),
                Experience = d.Experience,
                Email = d.Email,
                Phone = d.Phone,
                IsAvailable = d.IsActive
            });
        }

        public async Task<AvailableSlotsDto> GetAvailableSlotsAsync(int doctorId, int locationId, DateTime date)
        {
            var (availability, bookedSlots) = await _appointmentRepository.GetAvailableSlotsAsync(doctorId, locationId, date);
            var slots = new List<TimeSlotDto>();
            int slotIdCounter = 1;

      foreach (var avail in availability)
      {
        var startTime = avail.StartTime; // TimeSpan
        var endTime = avail.EndTime;     // TimeSpan

        var slotDuration = TimeSpan.FromMinutes(
            avail.SlotDuration > 0 ? avail.SlotDuration : 30
        );

        // ✅ BUSINESS FIX: If EndTime < StartTime, assume PM (add 12 hours)
        if (endTime < startTime)
        {
          endTime = endTime.Add(TimeSpan.FromHours(12));
        }

        var currentTime = startTime;

        while (currentTime < endTime)
        {
          var isBooked = bookedSlots.Any(b => b == currentTime);

          // 12-hour display
          var displayTime = DateTime.Today
              .Add(currentTime)
              .ToString("hh:mm tt");

          slots.Add(new TimeSlotDto
          {
            Time = displayTime,
            IsAvailable = !isBooked,
            SlotId = slotIdCounter++,
            Remaining = isBooked ? 0 : 1,
            Reason = isBooked ? "Booked" : null
          });

          currentTime = currentTime.Add(slotDuration);
        }
      }


      var availableSlots = slots.Where(s => s.IsAvailable).ToList();

            return new AvailableSlotsDto
            {
                Date = date.ToString("yyyy-MM-dd"),
                LocationId = locationId,
                Slots = availableSlots,
                RemainingSlotsForDay = availableSlots.Count
            };
        }

        public async Task<BookAppointmentResponse> BookAppointmentAsync(BookAppointmentRequest request)
        {
            try
            {
                var appointmentDate = DateTime.Parse(request.AppointmentDate);
                var appointmentTime = TimeSpan.Parse(request.AppointmentTime);

                // Check if slot is still available BEFORE booking (race condition handling)
                var (availability, bookedSlots) = await _appointmentRepository
                    .GetAvailableSlotsAsync(request.DoctorId, request.LocationId, appointmentDate);
                
                if (bookedSlots.Any(b => b == appointmentTime))
                {
                    return new BookAppointmentResponse
                    {
                        Success = false,
                        Message = "Selected slot was just taken — please choose another slot"
                    };
                }

                var (referenceNumber, appointmentId) = await _appointmentRepository.BookAppointmentAsync(
                    request.PatientName,
                    request.Age,
                    request.Mobile,
                    request.Email,
                    request.BloodGroup,
                    request.DoctorId,
                    request.LocationId,
                    appointmentDate,
                    appointmentTime,
                    request.Remarks
                );

                // Get doctor and location details
                var doctor = await _doctorRepository.GetDoctorByIdAsync(request.DoctorId);
                var locations = await _appointmentRepository.GetLocationsAsync();
                var location = locations.FirstOrDefault(l => l.LocationId == request.LocationId);

                // Calculate remaining slots after booking
                var (_, updatedBookedSlots) = await _appointmentRepository
                    .GetAvailableSlotsAsync(request.DoctorId, request.LocationId, appointmentDate);
                
                var totalSlots = availability.Sum(a => 
                    (int)((a.EndTime - a.StartTime).TotalMinutes / (a.SlotDuration > 0 ? a.SlotDuration : 30)));
                var remainingSlots = totalSlots - updatedBookedSlots.Count();

                return new BookAppointmentResponse
                {
                    Success = true,
                    ReferenceNumber = referenceNumber,
                    BookingReference = referenceNumber,
                    Message = "Appointment booked successfully",
                    RemainingSlotsForDay = remainingSlots,
                    AppointmentDetails = new AppointmentDetailsResponse
                    {
                        Doctor = doctor?.Name ?? "Unknown",
                        Location = location?.LocationName ?? "Unknown",
                        Date = appointmentDate.ToString("yyyy-MM-dd"),
                        Time = appointmentTime.ToString(@"hh\:mm")
                    }
                };
            }
            catch (Exception ex)
            {
                return new BookAppointmentResponse
                {
                    Success = false,
                    Message = ex.Message.Contains("UNIQUE") || ex.Message.Contains("duplicate") 
                        ? "Selected slot was just taken — please choose another slot"
                        : ex.Message
                };
            }
        }

        public async Task<bool> UpdateAppointmentAsync(UpdateAppointmentRequest request)
        {
            return await _appointmentRepository.UpdateAppointmentAsync(
                request.AppointmentId,
                request.Status,
                request.Remarks,
                request.Diagnosis,
                request.Treatment,
                request.DoctorNotes,
                request.Fees);
        }
    }
}
