import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { BookAppointmentComponent } from './pages/book-appointment/book-appointment.component';
import { TreatmentsComponent } from './pages/treatments/treatments.component';
import { TreatmentDetailComponent } from './pages/treatment-detail/treatment-detail.component';
import { ExerciseLibraryComponent } from './pages/contact/contact.component';
import { TreatmentFinderComponent } from './pages/treatment-finder/treatment-finder.component';
import { PatientHistoryComponent } from './pages/patient-history/patient-history.component';

import { DoctorLoginComponent } from './pages/doctor-login/doctor-login.component';
import { DoctorDashboardComponent } from './pages/doctor-dashboard/doctor-dashboard.component';
import { PatientDetailsComponent } from './pages/patient-details/patient-details.component';
import { LocationNagpadaComponent } from './pages/locations/location-nagpada/location-nagpada.component';
import { LocationBhiwandiComponent } from './pages/locations/location-bhiwandi/location-bhiwandi.component';
import { AdminLoginComponent } from './pages/admin-login/admin-login.component';
import { AdminDashboardComponent } from './pages/admin-dashboard/admin-dashboard.component';
import { MachinesAvailableComponent } from './pages/machines-available/machines-available.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'book-appointment', component: BookAppointmentComponent },
  { path: 'treatments', component: TreatmentsComponent },
  { path: 'treatments/:slug', component: TreatmentDetailComponent },
  { path: 'exercise', component: ExerciseLibraryComponent },
  { path: 'treatment-finder', component: TreatmentFinderComponent },
  { path: 'patient-history', component: PatientHistoryComponent },
  { path: 'doctor-login', component: DoctorLoginComponent },
  { path: 'doctor-dashboard', component: DoctorDashboardComponent },
  { path: 'patient-details', component: PatientDetailsComponent },
  { path: 'locations/nagpada', component: LocationNagpadaComponent },
  { path: 'locations/bhiwandi', component: LocationBhiwandiComponent },
  { path: 'admin/login', component: AdminLoginComponent },
  { path: 'admin/dashboard', component: AdminDashboardComponent },
  { path: 'machines-available', component: MachinesAvailableComponent },
  { path: '**', redirectTo: '' }
];
