import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AdminService } from '../../services/admin.service';

@Component({
    selector: 'app-admin-login',
    standalone: true,
    imports: [CommonModule, FormsModule],
    templateUrl: './admin-login.component.html',
    styles: []
})
export class AdminLoginComponent {
    username = '';
    password = '';
    errorMessage = '';
    isLoading = false;

    constructor(private adminService: AdminService, private router: Router) { }

    login() {
        this.isLoading = true;
        this.errorMessage = '';

        this.adminService.login({ username: this.username, password: this.password }).subscribe({
            next: (response) => {
                if (response.success) {
                    localStorage.setItem('adminToken', response.token);
                    this.router.navigate(['/admin/dashboard']);
                } else {
                    this.errorMessage = response.message;
                }
                this.isLoading = false;
            },
            error: (err) => {
                this.errorMessage = 'Login failed. Please check credentials.';
                this.isLoading = false;
                console.error(err);
            }
        });
    }
}
