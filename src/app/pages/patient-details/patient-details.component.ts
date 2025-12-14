import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ClinicApiService } from '../../services/clinic-api.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
    selector: 'app-patient-details',
    templateUrl: './patient-details.component.html',
    styleUrls: ['./patient-details.component.scss']
})
export class PatientDetailsComponent implements OnInit {
    patientId: number = 0;
    appointmentId: number = 0;
    patient: any = null;
    history: any[] = [];
    filteredHistory: any[] = [];
    currentAppointment: any = null;
    isLoading = false;
    errorMessage = '';
    isSaving = false;
    isDownloadingPdf = false;
    
    selectedFilter: 'day' | 'week' | 'month' | 'all' = 'all';
    filters = [
        { key: 'all', label: 'All History' },
        { key: 'day', label: 'Today' },
        { key: 'week', label: 'This Week' },
        { key: 'month', label: 'This Month' }
    ];

    editForm: FormGroup;

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private clinicApi: ClinicApiService,
        private fb: FormBuilder
    ) {
        this.editForm = this.fb.group({
            diagnosis: [''],
            treatment: [''],
            fees: [null, [Validators.min(0)]],
            remarks: [''],
            doctorNotes: ['']
        });
    }

    ngOnInit() {
        // Get patientId and appointmentId from query params
        this.route.queryParams.subscribe(params => {
            this.patientId = +params['patientId'] || 0;
            this.appointmentId = +params['appointmentId'] || 0;
            
            console.log('[Patient Details] Loaded with patientId:', this.patientId, 'appointmentId:', this.appointmentId);
            
            if (this.patientId > 0) {
                this.loadPatientHistory();
            } else {
                this.errorMessage = 'Invalid patient ID';
            }
        });
    }

    loadPatientHistory() {
        this.isLoading = true;
        this.errorMessage = '';
        
        console.log('[Patient Details] Loading history for patientId:', this.patientId);
        
        this.clinicApi.getPatientHistory(this.patientId).subscribe({
            next: (response) => {
                console.log('[Patient Details] History response:', response);
                
                if (response && response.patient) {
                    this.patient = response.patient;
                    this.history = Array.isArray(response.history) ? response.history : [];
                    
                    console.log('[Patient Details] Loaded history items:', this.history.length);
                    console.log('[Patient Details] Looking for appointmentId:', this.appointmentId);
                    
                    // Find current appointment - check both appointmentId and historyId
                    if (this.appointmentId > 0) {
                        this.currentAppointment = this.history.find(h => {
                            const matchAppointmentId = h.appointmentId === this.appointmentId;
                            const matchHistoryId = h.historyId === this.appointmentId;
                            return matchAppointmentId || matchHistoryId;
                        });
                        
                        console.log('[Patient Details] Current appointment found:', this.currentAppointment);
                        
                        // If not found in history, try to get from appointments API
                        if (!this.currentAppointment) {
                            // We'll need to fetch the specific appointment
                            console.log('[Patient Details] Appointment not in history, will need to fetch separately');
                        } else {
                            // Populate form with current appointment data
                            this.editForm.patchValue({
                                diagnosis: this.currentAppointment.diagnosis || '',
                                treatment: this.currentAppointment.treatment || '',
                                fees: this.currentAppointment.fees || null,
                                remarks: this.currentAppointment.remarks || '',
                                doctorNotes: this.currentAppointment.notes || this.currentAppointment.doctorNotes || ''
                            });
                        }
                    }
                    
                    this.applyFilter();
                } else {
                    this.errorMessage = 'Patient not found';
                }
                
                this.isLoading = false;
            },
            error: (err) => {
                console.error('[Patient Details] Error loading history:', err);
                this.errorMessage = err.error?.message || 'Failed to load patient history';
                this.isLoading = false;
            }
        });
    }

    applyFilter() {
        const now = new Date();
        let startDate: Date;

        switch (this.selectedFilter) {
            case 'day':
                startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
                break;
            case 'week':
                const dayOfWeek = now.getDay();
                startDate = new Date(now);
                startDate.setDate(now.getDate() - dayOfWeek);
                startDate.setHours(0, 0, 0, 0);
                break;
            case 'month':
                startDate = new Date(now.getFullYear(), now.getMonth(), 1);
                break;
            default:
                this.filteredHistory = [...this.history];
                return;
        }

        this.filteredHistory = this.history.filter(item => {
            const itemDate = new Date(item.visitDate || item.appointmentDate);
            return itemDate >= startDate;
        });
    }

    onFilterChange(filter: 'day' | 'week' | 'month' | 'all') {
        this.selectedFilter = filter;
        this.applyFilter();
    }

    saveAppointmentData() {
        if (!this.currentAppointment && this.appointmentId === 0) {
            this.errorMessage = 'No appointment selected';
            return;
        }

        this.isSaving = true;
        this.errorMessage = '';

        const appointmentId = this.currentAppointment?.appointmentId || this.appointmentId;
        
        const payload = {
            appointmentId: appointmentId,
            diagnosis: this.editForm.value.diagnosis,
            treatment: this.editForm.value.treatment,
            fees: this.editForm.value.fees,
            remarks: this.editForm.value.remarks,
            doctorNotes: this.editForm.value.doctorNotes
        };

        console.log('[Patient Details] Saving appointment data:', payload);

        this.clinicApi.updateAppointment(payload).subscribe({
            next: () => {
                console.log('[Patient Details] Appointment updated successfully');
                this.isSaving = false;
                // Reload history to get updated data
                this.loadPatientHistory();
            },
            error: (err) => {
                console.error('[Patient Details] Error saving appointment:', err);
                this.errorMessage = err.error?.message || 'Failed to save appointment data';
                this.isSaving = false;
            }
        });
    }

    downloadPdf() {
        if (!this.patientId) {
            this.errorMessage = 'Invalid patient ID';
            return;
        }

        this.isDownloadingPdf = true;
        this.errorMessage = '';

        console.log('[Patient Details] Downloading PDF for patientId:', this.patientId);

        this.clinicApi.downloadPatientPdf(this.patientId).subscribe({
            next: (blob) => {
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                const patientName = this.patient?.name?.replace(/\s+/g, '_') || 'Patient';
                a.download = `Patient_History_${patientName}_${new Date().toISOString().split('T')[0]}.pdf`;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                window.URL.revokeObjectURL(url);
                this.isDownloadingPdf = false;
            },
            error: (err) => {
                console.error('[Patient Details] Error downloading PDF:', err);
                this.errorMessage = err.error?.message || 'Failed to download PDF';
                this.isDownloadingPdf = false;
            }
        });
    }

    goBack() {
        this.router.navigate(['/doctor-dashboard']);
    }

    isCurrentAppointment(item: any): boolean {
        if (this.appointmentId === 0) return false;
        return (item.appointmentId === this.appointmentId) ||
               (item.historyId === this.appointmentId);
    }

    formatDate(dateString: string): string {
        if (!dateString) return '-';
        try {
            const date = new Date(dateString);
            return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
        } catch {
            return dateString;
        }
    }
}

