import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'physio-clinic';
  isMenuOpen: boolean = false; // renamed for clarity

  // Toggle hamburger menu
  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }

  // Optional: close menu when navigating
  closeMenu() {
    this.isMenuOpen = false;
  }
}
