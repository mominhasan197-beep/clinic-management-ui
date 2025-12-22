import { AfterViewInit, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ClinicApiService } from '../../services/clinic-api.service';
import { BookAppointmentRequest, Location, Doctor } from '../../models/api.models';
import { Router } from '@angular/router';
import AOS from 'aos';

@Component({
  selector: 'app-book-appointment',
  templateUrl: './book-appointment.component.html',
  styleUrls: ['./book-appointment.component.scss']
})
export class BookAppointmentComponent implements OnInit, AfterViewInit {
  currentStep = 1;
  locations: Location[] = [];
  doctors: Doctor[] = [];
  availableSlots: string[] = [];
  selectedLocation: Location | null = null;
  selectedDoctor: Doctor | null = null;
  selectedDate: string = '';
  selectedSlot: string = '';
  bookingForm: FormGroup;
  minDate: string;
  isLoading = false;
  errorMessage: string = '';
  successMessage: string = '';
  showSuccess: boolean = false;
  remainingSlotsForDay: number = 0;
  showMobileDoctorPanel: boolean = false;
  mobileOverlayState: 'enter' | 'exit' | null = null;

  constructor(
    private clinicApi: ClinicApiService,
    private fb: FormBuilder,
    private router: Router
  ) {
    this.bookingForm = this.fb.group({
      patientName: ['', [Validators.required, Validators.pattern(/^[a-zA-Z\s]*$/)]],
      age: ['', [Validators.required, Validators.min(0), Validators.max(120), Validators.pattern(/^[0-9]*$/)]],
      mobile: ['', [Validators.required, Validators.pattern(/^[0-9]{10}$/)]]
    });

    const today = new Date();
    this.minDate = today.toISOString().split('T')[0];
  }

  ngOnInit() {
    this.loadLocations();
  }

  ngAfterViewInit() {
    AOS.init({
      duration: 1000,
      once: true
    });
  }

  loadLocations() {
    this.isLoading = true;
    this.clinicApi.getLocations().subscribe({
      next: (data) => {
        this.locations = data;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error loading locations', err);
        this.errorMessage = 'Failed to load locations. Please try again.';
        this.isLoading = false;
      }
    });
  }

  selectLocation(location: Location) {
    this.selectedLocation = location;
    this.loadDoctors(location.locationId);
    this.currentStep = 2;
  }

  loadDoctors(locationId: number) {
    this.isLoading = true;
    this.clinicApi.getDoctors(locationId).subscribe({
      next: (data) => {
        this.doctors = data;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error loading doctors', err);
        this.errorMessage = 'Failed to load doctors.';
        this.isLoading = false;
      }
    });
  }

  selectDoctor(doctor: Doctor) {
    this.selectedDoctor = doctor;
    this.currentStep = 3;
    // Set default date to today
    this.selectedDate = this.minDate;
    this.loadSlots();
  }

  // Mobile flow: open a bottom sheet-like panel for slots without navigating away
  showDoctorSlotsMobile(doctor: Doctor) {
    this.selectedDoctor = doctor;
    this.selectedDate = this.minDate;
    this.loadSlots();
    this.showMobileDoctorPanel = true;
    // trigger enter animation
    this.mobileOverlayState = 'enter';
  }

  closeDoctorSlotsMobile() {
    // play exit animation then hide
    this.mobileOverlayState = 'exit';
    setTimeout(() => {
      this.showMobileDoctorPanel = false;
      this.mobileOverlayState = null;
    }, 300);
    // we keep selectedDoctor so user can continue if they choose
  }

  proceedFromMobileOverlay() {
    if (!this.selectedSlot) return;
    this.mobileOverlayState = 'exit';
    setTimeout(() => {
      this.showMobileDoctorPanel = false;
      this.mobileOverlayState = null;
      this.currentStep = 4;
    }, 300);
  }

  onDateChange(event: any) {
    this.selectedDate = event.target.value;
    this.loadSlots();
  }

  loadSlots() {
    if (!this.selectedDoctor || !this.selectedDate || !this.selectedLocation) return;

    this.isLoading = true;
    this.clinicApi.getAvailableSlots(
      this.selectedDoctor.doctorId,
      this.selectedLocation.locationId,
      this.selectedDate
    ).subscribe({
      next: (data) => {
        this.availableSlots = data.slots.map((s: any) => s.time);
        this.remainingSlotsForDay = data.remainingSlotsForDay || 0;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error loading slots', err);
        this.availableSlots = [];
        this.remainingSlotsForDay = 0;
        this.isLoading = false;
      }
    });
  }

  selectSlot(slot: string) {
    console.log('Slot selected:', slot);
    this.selectedSlot = slot;
  }

  goToStep4() {
    if (this.selectedSlot) {
      this.currentStep = 4;
    }
  }

  back() {
    if (this.currentStep > 1) {
      this.currentStep--;
      this.errorMessage = '';
    }
  }

  confirmBooking() {
    if (this.bookingForm.invalid) {
      this.bookingForm.markAllAsTouched();
      return;
    }

    if (!this.selectedLocation || !this.selectedDoctor) return;

    this.isLoading = true;
    const request: BookAppointmentRequest = {
      patientName: this.bookingForm.value.patientName,
      age: Number(this.bookingForm.value.age),
      mobile: this.bookingForm.value.mobile,
      locationId: Number(this.selectedLocation.locationId),
      doctorId: Number(this.selectedDoctor.doctorId),
      appointmentDate: this.selectedDate,
      appointmentTime: this.selectedSlot.includes(':') && this.selectedSlot.length === 5 ? this.selectedSlot + ':00' : this.selectedSlot
    };

    this.clinicApi.bookAppointment(request).subscribe({
      next: (res) => {
        this.isLoading = false;
        if (res.success) {
          this.successMessage = `Appointment booked successfully! Reference Number: ${res.bookingReference || res.referenceNumber || 'N/A'}`;
          this.showSuccess = true;
          // Auto-redirect after 3 seconds
          setTimeout(() => this.router.navigate(['/']), 3000);
        } else {
          // Race condition or booking failed
          this.errorMessage = res.message || 'Booking failed. Please try again.';
          this.loadSlots(); // Refresh slots
        }
      },
      error: (err) => {
        console.error('Booking failed', err);
        this.errorMessage = err.error?.message || 'Booking failed. Please try again.';
        this.loadSlots(); // Refresh slots on error
        this.isLoading = false;
      }
    });
  }
}
