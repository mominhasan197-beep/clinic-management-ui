import { Component } from '@angular/core';
import { ClinicApiService } from '../../services/clinic-api.service';

@Component({
    selector: 'app-patient-history',
    templateUrl: './patient-history.component.html',
    styleUrls: ['./patient-history.component.scss']
})
export class PatientHistoryComponent {
    mobileNumber: string = '';
    historyData: any = null;
    isLoading = false;
    errorMessage = '';
    isDownloadingPdf = false;

    constructor(private clinicApi: ClinicApiService) { }

    allowNumbersOnly(event: any) {
        const charCode = (event.which) ? event.which : event.keyCode;
        if (charCode < 48 || charCode > 57) {
            event.preventDefault();
            return false;
        }
        return true;
    }

    fetchHistory() {
        if (!this.mobileNumber || this.mobileNumber.length !== 10) {
            this.errorMessage = 'Please enter a valid 10-digit mobile number.';
            return;
        }

        this.isLoading = true;
        this.errorMessage = '';
        this.historyData = null;

        this.clinicApi.getPatientAppointmentHistory(this.mobileNumber).subscribe({
            next: (res) => {
                if (res && res.patient) {
                    // Ensure appointments are sorted from latest to oldest
                    if (res.appointments && res.appointments.length > 0) {
                        res.appointments = this.sortAppointmentsByDate(res.appointments);
                    }
                    this.historyData = res;
                } else {
                    // No patient found
                    this.historyData = { patient: null, appointments: [] };
                }
                this.isLoading = false;
            },
            error: (err) => {
                console.error('Fetch error', err);
                this.errorMessage = err.error?.message || 'Failed to fetch history. Please check the number and try again.';
                this.isLoading = false;
                this.historyData = null;
            }
        });
    }

    /**
     * Sort appointments from latest to oldest (by date, then by time)
     */
    private sortAppointmentsByDate(appointments: any[]): any[] {
        return [...appointments].sort((a, b) => {
            const dateA = new Date(a.appointmentDate + 'T' + (a.appointmentTime || '00:00:00'));
            const dateB = new Date(b.appointmentDate + 'T' + (b.appointmentTime || '00:00:00'));
            return dateB.getTime() - dateA.getTime(); // Descending order (latest first)
        });
    }

    downloadPdf() {
        if (!this.mobileNumber || this.mobileNumber.length !== 10) {
            this.errorMessage = 'Please enter a valid mobile number first.';
            return;
        }

        if (!this.historyData || !this.historyData.patient) {
            this.errorMessage = 'No appointment history found to download.';
            return;
        }

        this.isDownloadingPdf = true;
        this.errorMessage = '';

        this.clinicApi.downloadAppointmentHistoryPdf(this.mobileNumber).subscribe({
            next: (blob) => {
                const url = window.URL.createObjectURL(blob);
                const link = document.createElement('a');
                link.href = url;
                const patientName = this.historyData.patient?.name?.replace(/\s+/g, '_') || 'Patient';
                link.download = `Appointment_History_${patientName}_${this.mobileNumber}.pdf`;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                window.URL.revokeObjectURL(url);
                this.isDownloadingPdf = false;
            },
            error: (err) => {
                console.error('PDF Download failed', err);
                this.errorMessage = err.error?.message || 'Failed to download PDF. Please try again.';
                this.isDownloadingPdf = false;
            }
        });
    }

    getStatusClass(status: string): string {
        if (!status) return 'bg-gray-500/20 text-gray-400 border border-gray-500/30';
        const statusLower = status.toLowerCase();
        switch (statusLower) {
            case 'confirmed':
            case 'upcoming':
                return 'bg-green-500/20 text-green-400 border border-green-500/30';
            case 'cancelled':
                return 'bg-red-500/20 text-red-400 border border-red-500/30';
            case 'completed':
                return 'bg-blue-500/20 text-blue-400 border border-blue-500/30';
            default:
                return 'bg-gray-500/20 text-gray-400 border border-gray-500/30';
        }
    }

    getSortedAppointments(): any[] {
        if (!this.historyData || !this.historyData.appointments) {
            return [];
        }
        return this.sortAppointmentsByDate(this.historyData.appointments);
    }
}
