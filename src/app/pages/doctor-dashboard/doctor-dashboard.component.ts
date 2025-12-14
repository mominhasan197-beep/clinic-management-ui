import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ClinicApiService } from '../../services/clinic-api.service';
import { DashboardStats } from '../../models/api.models';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import AOS from 'aos';

@Component({
    selector: 'app-doctor-dashboard',
    templateUrl: './doctor-dashboard.component.html',
    styleUrls: ['./doctor-dashboard.component.scss']
})
export class DoctorDashboardComponent implements OnInit {
    stats: DashboardStats | null = null;
    appointments: any[] = [];
    currentMonthAppointments: any[] = [];
    viewMode: 'dashboard' | 'month' = 'dashboard';
    isLoading = false;
    doctorId: number = 1;
    selectedDate: string = new Date().toISOString().split('T')[0]; // Default to today (YYYY-MM-DD)
    editForm: FormGroup;
    editingAppointment: any | null = null;
    isSaving = false;
    errorMessage: string = '';
    statsError: boolean = false;
    appointmentsError: boolean = false;
    currentMonthName: string = '';

    constructor(
        private clinicApi: ClinicApiService,
        private router: Router,
        private fb: FormBuilder
    ) {
        this.editForm = this.fb.group({
            status: [''],
            remarks: [''],
            diagnosis: [''],
            treatment: [''],
            doctorNotes: [''],
            fees: [null, [Validators.min(0)]]
        });

        const date = new Date();
        this.currentMonthName = date.toLocaleString('default', { month: 'long', year: 'numeric' });
    }

    ngOnInit() {
        AOS.init();

        const storedId = localStorage.getItem('doctorId');
        if (storedId) {
            const parsedId = parseInt(storedId, 10);
            if (!isNaN(parsedId) && parsedId > 0) {
                this.doctorId = parsedId;
            } else {
                console.error('Invalid doctorId in localStorage:', storedId);
                this.router.navigate(['/doctor-login']);
                return;
            }
        } else {
            console.warn('No doctorId found in localStorage, redirecting to login');
            this.router.navigate(['/doctor-login']);
            return;
        }

        this.loadDashboardData();
    }

    loadDashboardData() {
        this.isLoading = true;
        this.errorMessage = '';
        this.statsError = false;
        this.appointmentsError = false;

        let statsLoaded = false;
        let appointmentsLoaded = false;

        const checkLoadingComplete = () => {
            if (statsLoaded && appointmentsLoaded) {
                this.isLoading = false;
            }
        };

        // Load Stats
        console.log(`[Dashboard] Loading stats for doctorId: ${this.doctorId}`);
        this.clinicApi.getDashboardStats(this.doctorId).subscribe({
            next: (data) => {
                console.log('[Dashboard] Stats response received:', data);
                // Map backend response to frontend interface
                this.stats = data ? {
                    today: data.today || data.Today || 0,
                    thisWeek: data.thisWeek || data.ThisWeek || 0,
                    thisMonth: data.thisMonth || data.ThisMonth || 0,
                    thisYear: data.thisYear || data.ThisYear || 0,
                    // Legacy compatibility
                    appointmentsToday: data.today || data.Today || data.appointmentsToday || 0,
                    totalAppointments: data.thisYear || data.ThisYear || data.totalAppointments || 0,
                    totalPatients: data.totalPatients || 0
                } : { today: 0, thisWeek: 0, thisMonth: 0, thisYear: 0 };
                console.log('[Dashboard] Mapped stats:', this.stats);
                statsLoaded = true;
                checkLoadingComplete();
            },
            error: (err) => {
                console.error('[Dashboard] Error loading stats:', err);
                console.error('[Dashboard] Error details:', JSON.stringify(err, null, 2));
                this.stats = { today: 0, thisWeek: 0, thisMonth: 0, thisYear: 0 };
                this.statsError = true;
                statsLoaded = true;
                checkLoadingComplete();
            }
        });

        // Load Appointments by Date (default: today)
        console.log(`[Dashboard] Loading appointments for doctorId: ${this.doctorId}, date: ${this.selectedDate}`);
        this.clinicApi.getAppointmentsByDate(this.doctorId, this.selectedDate).subscribe({
            next: (data) => {
                console.log('[Dashboard] Appointments response received:', data);
                console.log('[Dashboard] Appointments count:', Array.isArray(data) ? data.length : 'Not an array');

                // Ensure data is an array and sort by time (earliest to latest)
                const appointmentsArray = Array.isArray(data) ? data : [];

                // Map and normalize data to ensure camelCase properties for template
                this.appointments = appointmentsArray.map(item => ({
                    appointmentId: item.appointmentId || item.AppointmentId,
                    appointmentTime: item.appointmentTime || item.AppointmentTime || '00:00',
                    patientId: item.patientId || item.PatientId,
                    patientName: item.patientName || item.PatientName || 'Unknown',
                    age: item.age || item.Age,
                    gender: item.gender || item.Gender,
                    mobile: item.mobile || item.Mobile,
                    locationName: item.locationName || item.LocationName,
                    status: item.status || item.Status || 'Upcoming',
                    fees: item.fees || item.Fees,
                    diagnosis: item.diagnosis || item.Diagnosis,
                    treatment: item.treatment || item.Treatment,
                    doctorNotes: item.doctorNotes || item.DoctorNotes,
                    remarks: item.remarks || item.Remarks
                })).sort((a, b) => {
                    const timeA = a.appointmentTime;
                    const timeB = b.appointmentTime;
                    return timeA.localeCompare(timeB);
                });

                console.log('[Dashboard] Final sorted appointments array:', this.appointments);
                appointmentsLoaded = true;
                checkLoadingComplete();
            },
            error: (err) => {
                console.error('[Dashboard] Error loading appointments:', err);
                console.error('[Dashboard] Error details:', JSON.stringify(err, null, 2));
                this.appointments = [];
                this.appointmentsError = true;
                this.errorMessage = 'Failed to load appointments. Please try again.';
                appointmentsLoaded = true;
                checkLoadingComplete();
            }
        });
    }

    onDateChange(date: string) {
        if (!date) return;
        console.log('[Dashboard] Date changed to:', date);
        this.selectedDate = date;
        this.loadDashboardData();
    }

    navigateToPatientDetails(patientId: number, appointmentId: number) {
        console.log(`[Dashboard] Navigating to patient details - patientId: ${patientId}, appointmentId: ${appointmentId}`);
        this.router.navigate(['/patient-details'], {
            queryParams: {
                patientId: patientId,
                appointmentId: appointmentId
            }
        });
    }

    startEdit(appt: any) {
        this.editingAppointment = appt;
        this.editForm.patchValue({
            status: appt.status || 'Upcoming',
            remarks: appt.remarks || '',
            diagnosis: appt.diagnosis || '',
            treatment: appt.treatment || '',
            doctorNotes: appt.doctorNotes || '',
            fees: appt.fees ?? null
        });
    }

    cancelEdit() {
        this.editingAppointment = null;
        this.editForm.reset();
    }

    saveEdit() {
        if (!this.editingAppointment) return;
        this.isSaving = true;
        const payload = {
            appointmentId: this.editingAppointment.appointmentId,
            status: this.editForm.value.status,
            remarks: this.editForm.value.remarks,
            diagnosis: this.editForm.value.diagnosis,
            treatment: this.editForm.value.treatment,
            doctorNotes: this.editForm.value.doctorNotes,
            fees: this.editForm.value.fees
        };

        this.clinicApi.updateAppointment(payload).subscribe({
            next: () => {
                // update local list
                this.appointments = this.appointments.map(a =>
                    a.appointmentId === this.editingAppointment.appointmentId
                        ? { ...a, ...payload }
                        : a);
                this.isSaving = false;
                this.cancelEdit();
            },
            error: (err) => {
                console.error('Error updating appointment', err);
                this.isSaving = false;
            }
        });
    }

    downloadHistory(patientId: number) {
        this.clinicApi.downloadPatientPdf(patientId).subscribe({
            next: (blob) => {
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `Patient_History_${patientId}.pdf`;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                window.URL.revokeObjectURL(url);
            },
            error: (err) => console.error('Error downloading PDF', err)
        });
    }

    logout() {
        localStorage.removeItem('doctorId');
        this.router.navigate(['/doctor-login']);
    }

    openMonthView() {
        this.viewMode = 'month';
        this.loadMonthAppointments();
    }

    backToDashboard() {
        this.viewMode = 'dashboard';
    }

    loadMonthAppointments() {
        this.isLoading = true;
        const now = new Date();
        const month = now.getMonth() + 1; // 1-12
        const year = now.getFullYear();

        this.clinicApi.getDoctorAppointmentsByMonth(this.doctorId, month, year).subscribe({
            next: (data) => {
                console.log('[Dashboard] Loaded monthly appointments:', data);
                this.currentMonthAppointments = (data || []).map(item => ({
                    appointmentId: item.appointmentId || item.AppointmentId,
                    appointmentDate: item.appointmentDate || item.AppointmentDate,
                    appointmentTime: item.appointmentTime || item.AppointmentTime || '00:00',
                    patientId: item.patientId || item.PatientId,
                    patientName: item.patientName || item.PatientName || 'Unknown',
                    mobile: item.mobile || item.Mobile,
                    status: item.status || item.Status || 'Upcoming'
                })).sort((a, b) => {
                    const dateA = new Date(a.appointmentDate + 'T' + a.appointmentTime).getTime();
                    const dateB = new Date(b.appointmentDate + 'T' + b.appointmentTime).getTime();
                    return dateA - dateB;
                });
                this.isLoading = false;
            },
            error: (err) => {
                console.error('[Dashboard] Error loading monthly appointments:', err);
                this.isLoading = false;
            }
        });
    }
}
