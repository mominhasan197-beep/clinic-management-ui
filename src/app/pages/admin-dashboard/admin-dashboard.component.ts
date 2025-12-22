import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { AdminService, DashboardStats } from '../../services/admin.service';
import { FormsModule } from '@angular/forms';

@Component({
    selector: 'app-admin-dashboard',
    standalone: true,
    imports: [CommonModule, FormsModule, RouterLink],
    templateUrl: './admin-dashboard.component.html',
    styles: []
})
export class AdminDashboardComponent implements OnInit {
    activeTab: 'overview' | 'appointments' | 'patients' = 'overview';
    todayDate = new Date();
    mobileMenuOpen: boolean = false;

    // Pagination State
    currentPage = 1;
    pageSize = 10;
    totalItems = 0;
    totalPages = 0;

    toggleMobileMenu() {
        this.mobileMenuOpen = !this.mobileMenuOpen;
    }
    stats: DashboardStats | null = null;
    appointments: any[] = [];
    patients: any[] = [];

    // Filters
    filterDoctor = '';
    filterLocation = '';
    filterStatus = '';
    filterDateStart = '';
    filterDateEnd = '';

    searchPatient = '';
    searchAppointmentTerm = '';

    constructor(private adminService: AdminService, private router: Router, private cdr: ChangeDetectorRef) { }

    ngOnInit(): void {
        this.checkAuth();
        this.loadStats();
    }

    checkAuth() {
        if (!localStorage.getItem('adminToken')) {
            this.router.navigate(['/admin/login']);
        }
    }

    logout() {
        localStorage.removeItem('adminToken');
        this.router.navigate(['/admin/login']);
    }

    switchTab(tab: 'overview' | 'appointments' | 'patients') {
        this.activeTab = tab;
        if (tab === 'appointments') this.loadAppointments();
        if (tab === 'patients') {
            this.currentPage = 1; // Reset to page 1
            this.loadPatients();
        }
    }

    loadStats() {
        this.adminService.getDashboardStats().subscribe(res => {
            if (res.success) this.stats = res.data;
        });
    }

    loadAppointments() {
        const filters = {
            doctorName: this.filterDoctor,
            location: this.filterLocation,
            status: this.filterStatus,
            startDate: this.filterDateStart,
            endDate: this.filterDateEnd,
            searchTerm: this.searchAppointmentTerm
        };
        this.adminService.getAllAppointments(filters).subscribe(res => {
            if (res.success) this.appointments = res.data;
        });
    }

    loadPatients() {
        console.log('Loading patients...', 'Page:', this.currentPage, 'Size:', this.pageSize);
        this.adminService.getAllPatients(this.searchPatient, this.currentPage, this.pageSize).subscribe({
            next: (res) => {
                if (res && res.success && res.data) {
                    const data = res.data;
                    // API might return TotalCount or totalCount
                    this.totalItems = data.totalCount ?? data.TotalCount ?? 0;
                    this.totalPages = this.pageSize > 0 ? Math.ceil(this.totalItems / this.pageSize) : 0;

                    const items = data.items ?? data.Items ?? [];
                    if (Array.isArray(items)) {
                        this.patients = items.map((p: any) => ({
                            patientId: p.patientId ?? p.PatientId,
                            name: p.name ?? p.Name ?? 'Unknown',
                            age: p.age ?? p.Age ?? 0,
                            gender: p.gender ?? p.Gender ?? 'N/A',
                            mobile: p.mobile ?? p.Mobile ?? 'N/A',
                            email: p.email ?? p.Email ?? '',
                            lastVisit: p.lastVisit ?? p.LastVisit,
                            totalVisits: p.totalVisits ?? p.TotalVisits ?? 0
                        })).filter((p: any) => p.patientId !== undefined && p.patientId !== null);
                    } else {
                        this.patients = [];
                    }

                    console.log('Patients Handled:', {
                        frontendCount: this.patients.length,
                        apiItemCount: items.length,
                        totalItems: this.totalItems,
                        page: this.currentPage
                    });
                    this.cdr.detectChanges();
                } else {
                    console.error('Failed to load patients:', res);
                }
            },
            error: (err) => {
                console.error('Error loading patients:', err);
                this.patients = [];
                this.cdr.detectChanges();
            }
        });
    }

    nextPage() {
        if (this.currentPage < this.totalPages) {
            this.currentPage++;
            this.cdr.detectChanges(); // Ensure UI updates page number immediately
            this.loadPatients();
        }
    }

    prevPage() {
        if (this.currentPage > 1) {
            this.currentPage--;
            this.cdr.detectChanges(); // Ensure UI updates page number immediately
            this.loadPatients();
        }
    }

    // History Modal Logic
    historyModalOpen = false;
    selectedPatientName = '';
    patientHistory: any[] = [];

    viewHistory(patient: any) {
        this.selectedPatientName = patient.name;
        this.historyModalOpen = true;
        this.patientHistory = []; // Reset while loading

        this.adminService.getAllAppointments({ patientId: patient.patientId }).subscribe(res => {
            if (res.success) {
                this.patientHistory = res.data;
            }
        });
    }

    closeHistory() {
        this.historyModalOpen = false;
        this.selectedPatientName = '';
        this.patientHistory = [];
    }
}
