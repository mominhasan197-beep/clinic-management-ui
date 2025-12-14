import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ClinicApiService } from '../../services/clinic-api.service';
import { LoginRequest } from '../../models/api.models';

@Component({
    selector: 'app-doctor-login',
    templateUrl: './doctor-login.component.html',
    styleUrls: ['./doctor-login.component.scss']
})
export class DoctorLoginComponent {
    loginForm: FormGroup;
    isLoading = false;
    errorMessage = '';

    fullError: any = null;

    constructor(
        private fb: FormBuilder,
        private clinicApi: ClinicApiService,
        private router: Router
    ) {
        this.loginForm = this.fb.group({
            username: ['', Validators.required],
            password: ['', Validators.required]
        });
    }

    onSubmit() {
        if (this.loginForm.invalid) {
            this.loginForm.markAllAsTouched();
            return;
        }

        this.isLoading = true;
        this.errorMessage = '';
        this.fullError = null;

        const request: LoginRequest = this.loginForm.value;

        this.clinicApi.loginDoctor(request).subscribe({
            next: (res) => {
                this.isLoading = false;
                console.log('[Login] Full response:', res);
                console.log('[Login] Response success:', res?.success);
                console.log('[Login] Response doctor:', res?.doctor);
                console.log('[Login] Doctor ID:', res?.doctor?.doctorId);
                
                // Check if login was successful
                if (res?.success && res?.doctor?.doctorId) {
                    const doctorId = res.doctor.doctorId.toString();
                    console.log('[Login] Storing doctorId in localStorage:', doctorId);
                    localStorage.setItem('doctorId', doctorId);
                    if (res?.sessionId) {
                        localStorage.setItem('sessionId', res.sessionId);
                    }
                    console.log('[Login] Navigating to dashboard...');
                    this.router.navigate(['/doctor-dashboard']);
                } else {
                    // Handle case where response indicates failure but HTTP status is 200
                    console.error('[Login] Login failed - response indicates failure');
                    this.errorMessage = res?.message || 'Login failed. Please check your credentials.';
                }
            },
            error: (err) => {
                this.isLoading = false;
                console.error('Login failed - Full error object:', err);
                console.error('Error status:', err.status);
                console.error('Error statusText:', err.statusText);
                console.error('Error message:', err.message);
                console.error('Error error:', err.error);
                console.error('Error url:', err.url);
                
                this.fullError = err;
                
                // Handle different error types
                if (err.status === 0) {
                    // Network error or CORS issue
                    this.errorMessage = 'Network error: Unable to connect to server. Please check if the server is running and CORS is configured correctly.';
                } else if (err.status === 401) {
                    this.errorMessage = err.error?.message || err.error?.Message || 'Invalid username or password';
                } else if (err.status === 404) {
                    this.errorMessage = 'API endpoint not found. Please check the API URL configuration.';
                } else if (err.status >= 500) {
                    this.errorMessage = 'Server error. Please try again later.';
                } else {
                    this.errorMessage = err.error?.message || err.error?.Message || err.message || `Login Failed (Error ${err.status || 'Unknown'})`;
                }
            }
        });
    }
}
