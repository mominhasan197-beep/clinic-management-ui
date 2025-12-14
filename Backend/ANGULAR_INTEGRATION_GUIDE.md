# Angular Integration Guide - Clinic Management System

## Backend Setup Complete ✅

The .NET 8 Web API backend is now fully implemented with:
- **7 Database Tables** with relationships and indexes
- **7 Stored Procedures** for optimized queries
- **4 API Controllers** with 11 endpoints
- **PDF Generation** using QuestPDF
- **BCrypt Password Hashing** for security
- **CORS Configuration** for Angular

## Database Setup

### Step 1: Execute SQL Scripts

Run these scripts in SQL Server Management Studio (SSMS) in order:

```sql
-- 1. Create database and tables
-- File: Backend/Database/01_CreateSchema.sql

-- 2. Create stored procedures
-- File: Backend/Database/02_CreateStoredProcedures.sql

-- 3. Insert sample data
-- File: Backend/Database/03_InsertSampleData.sql
```

### Step 2: Update Connection String

Edit `Backend/appsettings.json`:

```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Server=YOUR_SERVER;Database=ClinicManagementDB;Trusted_Connection=True;TrustServerCertificate=True;"
  }
}
```

Replace `YOUR_SERVER` with:
- `localhost` or `.\SQLEXPRESS` for local SQL Server
- Your server name if using a remote database

## Running the Backend

```bash
cd Backend
dotnet restore
dotnet build
dotnet run
```

The API will start at: `https://localhost:7xxx` and `http://localhost:5xxx`

Swagger UI available at: `https://localhost:7xxx/swagger`

## API Endpoints Reference

### 1. Appointment Booking APIs

#### GET /api/appointment/locations
**Description**: Get all clinic locations

**Response**:
```json
{
  "success": true,
  "message": "Locations retrieved successfully",
  "data": [
    {
      "locationId": 1,
      "locationName": "Nagpada",
      "address": "Shop No. 1, The Baya Junction, Ghodbunder Road, Thane (W)",
      "availableHours": "2:00 PM - 6:00 PM"
    },
    {
      "locationId": 2,
      "locationName": "Bhiwandi",
      "address": "Bhiwandi Medical Center, Maharashtra",
      "availableHours": "10:00 AM - 2:00 PM, 6:00 PM - 10:00 PM"
    }
  ]
}
```

#### GET /api/appointment/doctors/{locationId}
**Description**: Get doctors available at a specific location

**Response**:
```json
{
  "success": true,
  "data": [
    {
      "doctorId": 1,
      "name": "Dr. Tahoora Momin",
      "qualifications": "BPT, MPT (Orthopedics)",
      "specializations": ["Sports Injury Rehabilitation", "Post-Surgical Recovery"],
      "experience": 10,
      "isAvailable": true
    }
  ]
}
```

#### GET /api/appointment/available-slots?doctorId={id}&date={date}
**Description**: Get available time slots for a doctor on a specific date

**Parameters**:
- `doctorId`: Doctor ID (integer)
- `date`: Date in YYYY-MM-DD format

**Response**:
```json
{
  "success": true,
  "data": {
    "date": "2025-12-08",
    "slots": [
      {
        "time": "10:00 AM",
        "isAvailable": true,
        "reason": null
      },
      {
        "time": "10:30 AM",
        "isAvailable": false,
        "reason": "Booked"
      }
    ]
  }
}
```

#### POST /api/appointment/book
**Description**: Book a new appointment

**Request Body**:
```json
{
  "patientName": "John Doe",
  "age": 45,
  "mobile": "+91 98765 43210",
  "email": "john.doe@example.com",
  "bloodGroup": "O+",
  "doctorId": 1,
  "locationId": 1,
  "appointmentDate": "2025-12-08",
  "appointmentTime": "14:00",
  "remarks": "Lower back pain"
}
```

**Response**:
```json
{
  "success": true,
  "referenceNumber": "APT-2025-001234",
  "message": "Appointment booked successfully",
  "appointmentDetails": {
    "doctor": "Dr. Tahoora Momin",
    "location": "Nagpada",
    "date": "2025-12-08",
    "time": "02:00 PM"
  }
}
```

### 2. Doctor Authentication APIs

#### POST /api/doctor/login
**Description**: Doctor login

**Request Body**:
```json
{
  "username": "dr.tahoora",
  "password": "password123"
}
```

**Response**:
```json
{
  "success": true,
  "message": "Login successful",
  "doctor": {
    "doctorId": 1,
    "name": "Dr. Tahoora Momin",
    "email": "tahoora@clinic.com"
  },
  "sessionId": "abc123xyz"
}
```

### 3. Dashboard APIs

#### GET /api/dashboard/stats/{doctorId}
**Description**: Get dashboard statistics for a doctor

**Response**:
```json
{
  "success": true,
  "data": {
    "today": 12,
    "thisWeek": 48,
    "thisMonth": 186,
    "thisYear": 2145
  }
}
```

#### GET /api/dashboard/appointments/{doctorId}?period={period}
**Description**: Get appointments for a doctor

**Parameters**:
- `doctorId`: Doctor ID
- `period`: today | week | month | year | all

**Response**:
```json
{
  "success": true,
  "data": [
    {
      "appointmentId": 1,
      "referenceNumber": "APT-2025-001001",
      "patientName": "John Doe",
      "age": 45,
      "mobile": "+91 98765 43210",
      "appointmentDate": "2025-12-08",
      "appointmentTime": "10:00",
      "locationName": "Bhiwandi",
      "status": "Completed",
      "remarks": "Lower back pain"
    }
  ]
}
```

### 4. Patient Management APIs

#### GET /api/patient/search?query={nameOrMobile}
**Description**: Search for patients by name or mobile number

**Response**:
```json
{
  "success": true,
  "data": [
    {
      "patientId": 1,
      "name": "John Doe",
      "age": 45,
      "mobile": "+91 98765 43210",
      "email": "john.doe@example.com",
      "bloodGroup": "O+",
      "totalVisits": 12,
      "lastVisit": "2025-12-01"
    }
  ]
}
```

#### GET /api/patient/history/{patientId}
**Description**: Get complete medical history for a patient

**Response**:
```json
{
  "success": true,
  "data": {
    "patient": {
      "patientId": 1,
      "name": "John Doe",
      "age": 45,
      "mobile": "+91 98765 43210",
      "bloodGroup": "O+"
    },
    "history": [
      {
        "visitDate": "2025-12-01",
        "visitTime": "14:00",
        "doctorName": "Dr. Tahoora",
        "locationName": "Nagpada",
        "diagnosis": "Lower Back Pain",
        "treatment": "Manual Therapy",
        "notes": "Significant improvement noted"
      }
    ]
  }
}
```

#### GET /api/patient/download-pdf/{patientId}
**Description**: Download patient history as PDF

**Response**: PDF file download

## Angular Integration

### Step 1: Create Angular Service

Create `src/app/services/clinic-api.service.ts`:

```typescript
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ClinicApiService {
  private apiUrl = 'http://localhost:5000/api'; // Update with your backend URL

  constructor(private http: HttpClient) { }

  // Appointment APIs
  getLocations(): Observable<any> {
    return this.http.get(`${this.apiUrl}/appointment/locations`);
  }

  getDoctorsByLocation(locationId: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/appointment/doctors/${locationId}`);
  }

  getAvailableSlots(doctorId: number, date: string): Observable<any> {
    const params = new HttpParams()
      .set('doctorId', doctorId.toString())
      .set('date', date);
    return this.http.get(`${this.apiUrl}/appointment/available-slots`, { params });
  }

  bookAppointment(appointmentData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/appointment/book`, appointmentData);
  }

  // Doctor APIs
  doctorLogin(username: string, password: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/doctor/login`, { username, password });
  }

  // Dashboard APIs
  getDashboardStats(doctorId: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/dashboard/stats/${doctorId}`);
  }

  getAppointments(doctorId: number, period: string = 'today'): Observable<any> {
    return this.http.get(`${this.apiUrl}/dashboard/appointments/${doctorId}?period=${period}`);
  }

  // Patient APIs
  searchPatient(query: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/patient/search?query=${encodeURIComponent(query)}`);
  }

  getPatientHistory(patientId: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/patient/history/${patientId}`);
  }

  downloadPatientPdf(patientId: number): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/patient/download-pdf/${patientId}`, {
      responseType: 'blob'
    });
  }
}
```

### Step 2: Update Book Appointment Component

Update `src/app/pages/book-appointment/book-appointment.component.ts`:

```typescript
import { Component, OnInit } from '@angular/core';
import { ClinicApiService } from '../../services/clinic-api.service';

@Component({
  selector: 'app-book-appointment',
  templateUrl: './book-appointment.component.html'
})
export class BookAppointmentComponent implements OnInit {
  locations: any[] = [];
  selectedLocation: any = null;

  constructor(private apiService: ClinicApiService) { }

  ngOnInit() {
    this.loadLocations();
  }

  loadLocations() {
    this.apiService.getLocations().subscribe({
      next: (response) => {
        if (response.success) {
          this.locations = response.data;
        }
      },
      error: (error) => {
        console.error('Error loading locations:', error);
      }
    });
  }

  selectLocation(location: any) {
    this.selectedLocation = location;
    // Navigate to next step or load doctors
  }
}
```

### Step 3: Update Doctor Login Component

Create `src/app/pages/doctor-login/doctor-login.component.ts`:

```typescript
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ClinicApiService } from '../../services/clinic-api.service';

@Component({
  selector: 'app-doctor-login',
  templateUrl: './doctor-login.component.html'
})
export class DoctorLoginComponent {
  username = '';
  password = '';
  errorMessage = '';

  constructor(
    private apiService: ClinicApiService,
    private router: Router
  ) { }

  login() {
    this.apiService.doctorLogin(this.username, this.password).subscribe({
      next: (response) => {
        if (response.success) {
          // Store doctor info and session
          localStorage.setItem('doctorId', response.doctor.doctorId);
          localStorage.setItem('sessionId', response.sessionId);
          localStorage.setItem('doctorName', response.doctor.name);
          
          // Navigate to dashboard
          this.router.navigate(['/doctor-dashboard']);
        } else {
          this.errorMessage = response.message;
        }
      },
      error: (error) => {
        this.errorMessage = 'Login failed. Please try again.';
        console.error('Login error:', error);
      }
    });
  }
}
```

### Step 4: Update Doctor Dashboard Component

Update `src/app/pages/doctor-dashboard/doctor-dashboard.component.ts`:

```typescript
import { Component, OnInit } from '@angular/core';
import { ClinicApiService } from '../../services/clinic-api.service';

@Component({
  selector: 'app-doctor-dashboard',
  templateUrl: './doctor-dashboard.component.html'
})
export class DoctorDashboardComponent implements OnInit {
  stats: any = {};
  appointments: any[] = [];
  doctorId: number = 0;

  constructor(private apiService: ClinicApiService) { }

  ngOnInit() {
    this.doctorId = parseInt(localStorage.getItem('doctorId') || '0');
    if (this.doctorId) {
      this.loadDashboardData();
    }
  }

  loadDashboardData() {
    // Load stats
    this.apiService.getDashboardStats(this.doctorId).subscribe({
      next: (response) => {
        if (response.success) {
          this.stats = response.data;
        }
      }
    });

    // Load today's appointments
    this.apiService.getAppointments(this.doctorId, 'today').subscribe({
      next: (response) => {
        if (response.success) {
          this.appointments = response.data;
        }
      }
    });
  }
}
```

### Step 5: Update Patient Search Component

Update `src/app/pages/patient-search/patient-search.component.ts`:

```typescript
import { Component } from '@angular/core';
import { ClinicApiService } from '../../services/clinic-api.service';

@Component({
  selector: 'app-patient-search',
  templateUrl: './patient-search.component.html'
})
export class PatientSearchComponent {
  searchQuery = '';
  patients: any[] = [];
  selectedPatient: any = null;
  patientHistory: any = null;

  constructor(private apiService: ClinicApiService) { }

  searchPatient() {
    if (!this.searchQuery.trim()) return;

    this.apiService.searchPatient(this.searchQuery).subscribe({
      next: (response) => {
        if (response.success) {
          this.patients = response.data;
          if (this.patients.length > 0) {
            this.selectPatient(this.patients[0]);
          }
        }
      }
    });
  }

  selectPatient(patient: any) {
    this.selectedPatient = patient;
    this.loadPatientHistory(patient.patientId);
  }

  loadPatientHistory(patientId: number) {
    this.apiService.getPatientHistory(patientId).subscribe({
      next: (response) => {
        if (response.success) {
          this.patientHistory = response.data;
        }
      }
    });
  }

  downloadPdf() {
    if (!this.selectedPatient) return;

    this.apiService.downloadPatientPdf(this.selectedPatient.patientId).subscribe({
      next: (blob) => {
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `PatientHistory_${this.selectedPatient.name}_${new Date().toISOString().split('T')[0]}.pdf`;
        link.click();
        window.URL.revokeObjectURL(url);
      }
    });
  }
}
```

## Testing the Integration

### 1. Start Backend
```bash
cd Backend
dotnet run
```

### 2. Start Angular
```bash
cd d:\Project\Angular\Practice
npm start
```

### 3. Test Endpoints

Use Swagger UI at `https://localhost:7xxx/swagger` to test all endpoints.

### 4. Test Login

**Default Credentials**:
- Username: `dr.tahoora`
- Password: `password123`

## Troubleshooting

### CORS Issues
If you see CORS errors, verify:
1. Backend `Program.cs` has correct Angular URL in CORS policy
2. Angular is running on the allowed port (4200 or 59296)

### Database Connection
If connection fails:
1. Check SQL Server is running
2. Verify connection string in `appsettings.json`
3. Ensure database `ClinicManagementDB` exists

### API Not Found
If endpoints return 404:
1. Check backend is running
2. Verify API URL in Angular service matches backend port
3. Check controller routes are correct

## Next Steps

1. **Add Authentication Middleware**: Implement JWT tokens for secure API access
2. **Add Validation**: Add data validation attributes to request models
3. **Error Handling**: Implement global exception handling
4. **Logging**: Add structured logging with Serilog
5. **Unit Tests**: Add unit tests for services and controllers
6. **Deploy**: Deploy backend to Azure or IIS

## Summary

✅ Complete .NET 8 Web API backend  
✅ SQL Server database with sample data  
✅ 11 API endpoints ready to use  
✅ PDF generation working  
✅ CORS configured for Angular  
✅ Integration guide complete  

Your clinic management system is now fully integrated and ready to use!
