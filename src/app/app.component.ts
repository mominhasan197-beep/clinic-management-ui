import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'physio-clinic';
  isMenuOpen: boolean = false;

  constructor(private router: Router) { }

  isAdminRoute(): boolean {
    return this.router.url.startsWith('/admin');
  }

  // Toggle hamburger menu
  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }

  // Optional: close menu when navigating
  closeMenu() {
    this.isMenuOpen = false;
  }
}
