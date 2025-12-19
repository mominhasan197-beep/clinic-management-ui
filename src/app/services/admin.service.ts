import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environment/environment';

export interface AdminLoginResponse {
    success: boolean;
    message: string;
    token: string;
    username: string;
}

export interface DashboardStats {
    totalAppointments: number;
    todayAppointments: number;
    thisWeekAppointments: number;
    thisMonthAppointments: number;
    appointmentsPerDoctor: { doctorName: string; count: number }[];
    appointmentsPerLocation: { locationName: string; count: number }[];
}

@Injectable({
    providedIn: 'root'
})
export class AdminService {
    private apiUrl = `${environment.apiUrl}/Admin`; // Adjust base URL as needed

    constructor(private http: HttpClient) { }

    login(credentials: any): Observable<AdminLoginResponse> {
        return this.http.post<AdminLoginResponse>(`${this.apiUrl}/login`, credentials);
    }

    getDashboardStats(): Observable<any> {
        return this.http.get<any>(`${this.apiUrl}/dashboard/stats`);
    }

    getAllAppointments(filters: any): Observable<any> {
        let params = new HttpParams();
        if (filters.doctorName) params = params.set('doctorName', filters.doctorName);
        if (filters.location) params = params.set('location', filters.location);
        if (filters.status) params = params.set('status', filters.status);
        if (filters.startDate) params = params.set('startDate', filters.startDate);
        if (filters.endDate) params = params.set('endDate', filters.endDate);
        if (filters.patientId) params = params.set('patientId', filters.patientId);
        if (filters.searchTerm) params = params.set('searchTerm', filters.searchTerm);

        return this.http.get<any>(`${this.apiUrl}/appointments`, { params });
    }

    getAllPatients(search?: string, page: number = 1, pageSize: number = 10): Observable<any> {
        let params = new HttpParams()
            .set('page', page.toString())
            .set('pageSize', pageSize.toString());

        if (search) params = params.set('search', search);
        return this.http.get<any>(`${this.apiUrl}/patients`, { params });
    }
}
