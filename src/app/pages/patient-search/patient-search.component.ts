import { Component } from '@angular/core';
import { ClinicApiService } from '../../services/clinic-api.service';

@Component({
    selector: 'app-patient-search',
    templateUrl: './patient-search.component.html',
    styleUrls: ['./patient-search.component.scss']
})
export class PatientSearchComponent {
    searchQuery: string = '';
    patients: any[] = [];
    isLoading = false;
    hasSearched = false;

    constructor(private clinicApi: ClinicApiService) { }

    onSearch() {
        if (!this.searchQuery.trim()) return;

        this.isLoading = true;
        this.hasSearched = true;

        this.clinicApi.searchPatients(this.searchQuery).subscribe({
            next: (data) => {
                this.patients = data;
                this.isLoading = false;
            },
            error: (err) => {
                console.error('Error searching patients', err);
                this.patients = [];
                this.isLoading = false;
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
}
