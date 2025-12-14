import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../environment/environment';
import { BookAppointmentRequest, LoginRequest, Doctor, Location, TimeSlot, DashboardStats } from '../models/api.models';

@Injectable({
    providedIn: 'root'
})
export class ClinicApiService {
    private parsedApiUrl = '';

    constructor(private http: HttpClient) {
        // The environment URL should be the base URL including the virtual directory
        // e.g., 'https://octopusuat.watchyourhealth.com/Utilization'
        // We need to append /api to get: 'https://octopusuat.watchyourhealth.com/Utilization/api'
        const baseUrl = environment.apiUrl.endsWith('/') ? environment.apiUrl.slice(0, -1) : environment.apiUrl;
        this.parsedApiUrl = baseUrl.endsWith('/api') ? baseUrl : `${baseUrl}/api`;

        console.log('=== API Service Initialization ===');
        console.log('Environment API URL:', environment.apiUrl);
        console.log('Parsed API URL:', this.parsedApiUrl);
        console.log('Full Login URL will be:', `${this.parsedApiUrl}/Doctor/login`);
        console.log('===================================');
    }

    // --- Appointment ---

    getLocations(): Observable<any[]> {
        return this.http.get<any>(`${this.parsedApiUrl}/Appointment/locations`).pipe(
            map(res => res.data)
        );
    }

    getDoctors(locationId: number): Observable<any[]> {
        return this.http.get<any>(`${this.parsedApiUrl}/Appointment/doctors/${locationId}`).pipe(
            map(res => res.data)
        );
    }

    getAvailableSlots(doctorId: number, locationId: number, date: string): Observable<any> {
        let params = new HttpParams()
            .set('doctorId', doctorId.toString())
            .set('locationId', locationId.toString())
            .set('date', date);
        return this.http.get<any>(`${this.parsedApiUrl}/Appointment/available-slots`, { params }).pipe(
            map(res => res.data) // Return full data object with slots, locationId, remainingSlotsForDay
        );
    }

    bookAppointment(request: BookAppointmentRequest): Observable<any> {
        return this.http.post(`${this.parsedApiUrl}/Appointment/book`, request);
    }

    // --- Doctor ---

    loginDoctor(request: LoginRequest): Observable<any> {
        const url = `${this.parsedApiUrl}/Doctor/login`;
        console.log('=== Login Request ===');
        console.log('Full URL:', url);
        console.log('Request payload:', JSON.stringify(request, null, 2));
        console.log('====================');

        const headers = {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        };

        return this.http.post<any>(url, request, {
            headers,
            withCredentials: false
        });
    }

    // --- Dashboard ---

    getDashboardStats(doctorId: number): Observable<any> {
        return this.http.get<any>(`${this.parsedApiUrl}/Dashboard/stats/${doctorId}`).pipe(
            map(res => res.data || res.Data)
        );
    }

    getDashboardAppointments(doctorId: number, period: string = 'today'): Observable<any[]> {
        return this.http.get<any>(`${this.parsedApiUrl}/Dashboard/appointments/${doctorId}?period=${period}`).pipe(
            map(res => res.data || res.Data)
        );
    }

    getAppointmentsByDate(doctorId: number, date: string): Observable<any[]> {
        console.log(`[API] Getting appointments for doctorId: ${doctorId}, date: ${date}`);
        return this.http.get<any>(`${this.parsedApiUrl}/Dashboard/appointments/${doctorId}/date/${date}`).pipe(
            map(res => {
                console.log('[API] Appointments response:', res);
                return res.data || res.Data || [];
            })
        );
    }

    getDoctorAppointmentsByMonth(doctorId: number, month: number, year: number): Observable<any[]> {
        console.log(`[API] Getting monthly appointments for doctorId: ${doctorId}, month: ${month}, year: ${year}`);
        let params = new HttpParams()
            .set('month', month.toString())
            .set('year', year.toString());

        return this.http.get<any>(`${this.parsedApiUrl}/Doctor/appointments/${doctorId}/month`, { params }).pipe(
            map(res => {
                console.log('[API] Monthly Appointments response:', res);
                return res.data || res.Data || [];
            })
        );
    }

    updateAppointment(request: any): Observable<any> {
        return this.http.patch(`${this.parsedApiUrl}/Appointment/${request.appointmentId}`, request);
    }

    // --- Patient ---

    searchPatients(query: string): Observable<any[]> {
        return this.http.get<any>(`${this.parsedApiUrl}/Patient/search?query=${query}`).pipe(
            map(res => res.data)
        );
    }

    getPatientHistory(patientId: number): Observable<any> {
        return this.http.get<any>(`${this.parsedApiUrl}/Patient/history/${patientId}`).pipe(
            map(res => res.data || res)
        );
    }

    downloadPatientPdf(patientId: number): Observable<Blob> {
        return this.http.get(`${this.parsedApiUrl}/Patient/download-pdf/${patientId}`, { responseType: 'blob' });
    }

    getPatientAppointmentHistory(mobile: string): Observable<any> {
        return this.http.get<any>(`${this.parsedApiUrl}/Patient/appointments?mobile=${mobile}`).pipe(
            map(res => res.data)
        );
    }

    downloadAppointmentHistoryPdf(mobile: string): Observable<Blob> {
        return this.http.get(`${this.parsedApiUrl}/Patient/download-appointments-pdf?mobile=${mobile}`, { responseType: 'blob' });
    }
}
