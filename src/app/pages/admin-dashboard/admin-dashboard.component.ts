import { Component, OnInit } from '@angular/core';
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

    constructor(private adminService: AdminService, private router: Router) { }

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
        if (tab === 'patients') this.loadPatients();
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
            endDate: this.filterDateEnd
        };
        this.adminService.getAllAppointments(filters).subscribe(res => {
            if (res.success) this.appointments = res.data;
        });
    }

    loadPatients() {
        this.adminService.getAllPatients(this.searchPatient).subscribe(res => {
            if (res.success) this.patients = res.data;
        });
    }
}
