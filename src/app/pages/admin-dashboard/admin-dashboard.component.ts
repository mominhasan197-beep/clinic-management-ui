import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AdminService, DashboardStats } from '../../services/admin.service';
import { FormsModule } from '@angular/forms';

@Component({
    selector: 'app-admin-dashboard',
    standalone: true,
    imports: [CommonModule, FormsModule],
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
                    // Update state synchronously
                    this.totalItems = res.data.totalCount || 0;
                    this.totalPages = this.pageSize > 0 ? Math.ceil(this.totalItems / this.pageSize) : 0;

                    if (Array.isArray(res.data.items)) {
                        this.patients = res.data.items.map((p: any) => ({
                            patientId: p.patientId || p.PatientId,
                            name: p.name || p.Name,
                            age: p.age || p.Age,
                            gender: p.gender || p.Gender,
                            mobile: p.mobile || p.Mobile,
                            email: p.email || p.Email,
                            lastVisit: p.lastVisit || p.LastVisit,
                            totalVisits: p.totalVisits || p.TotalVisits
                        })).filter((p: any) => p.patientId); // Basic filter to ensure valid objects
                    } else {
                        this.patients = [];
                    }

                    console.log('Patients Loaded:', this.patients.length, 'Total Items:', this.totalItems, 'Current Page:', this.currentPage);
                    this.cdr.detectChanges(); // Force UI update
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
