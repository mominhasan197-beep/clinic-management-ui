import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AppComponent } from './app.component';
import { CommonModule } from '@angular/common';
import { HomeComponent } from './pages/home/home.component';
import { BookAppointmentComponent } from './pages/book-appointment/book-appointment.component';
import { TreatmentsComponent } from './pages/treatments/treatments.component';
import { ExerciseLibraryComponent } from './pages/contact/contact.component';
import { HttpClientModule } from '@angular/common/http';
import { TreatmentDetailComponent } from './pages/treatment-detail/treatment-detail.component';
import { PainMapComponent } from './features/pain-map/pain-map.component';
import { TreatmentFinderComponent } from './pages/treatment-finder/treatment-finder.component';
import { ReactiveFormsModule } from '@angular/forms';
import { SymptomCheckerComponent } from './pages/symptom-checker/symptom-checker.component';
import { ChatbotComponent } from './pages/chatbot/chatbot.component';
import { RehabPlansComponent } from './pages/rehab-plans/rehab-plans.component';
import { DietRecommendationComponent } from './pages/diet-recommendation/diet-recommendation.component';
import { DisclaimerModalComponent } from './pages/disclaimer-modal/disclaimer-modal.component';
import { ContactUsComponent } from './pages/contact-us/contact-us.component';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { DoctorLoginComponent } from './pages/doctor-login/doctor-login.component';
import { DoctorDashboardComponent } from './pages/doctor-dashboard/doctor-dashboard.component';
import { PatientSearchComponent } from './pages/patient-search/patient-search.component';
import { PatientHistoryComponent } from './pages/patient-history/patient-history.component';
import { PatientDetailsComponent } from './pages/patient-details/patient-details.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'book-appointment', component: BookAppointmentComponent },
  { path: 'treatments', component: TreatmentsComponent },
  { path: 'exercise', component: ExerciseLibraryComponent },
  { path: 'treatments/:slug', component: TreatmentDetailComponent },
  { path: 'treatment-finder', component: TreatmentFinderComponent },
  { path: 'symptom-checker', component: SymptomCheckerComponent },
  { path: 'chatbot', component: ChatbotComponent },
  { path: 'rehab-plans', component: RehabPlansComponent },
  { path: 'diet-recommendation', component: DietRecommendationComponent },
  { path: 'disclaimer-modal', component: DisclaimerModalComponent },
  { path: 'contact', component: ContactUsComponent },
  { path: 'doctor-login', component: DoctorLoginComponent },
  { path: 'doctor-dashboard', component: DoctorDashboardComponent },
  { path: 'patient-search', component: PatientSearchComponent },
  { path: 'patient-history', component: PatientHistoryComponent },
  { path: '**', redirectTo: '' }
];

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    BookAppointmentComponent,
    TreatmentsComponent,
    ExerciseLibraryComponent,
    TreatmentDetailComponent,
    PainMapComponent,
    ChatbotComponent,
    RehabPlansComponent,
    DietRecommendationComponent,
    TreatmentFinderComponent,
    DisclaimerModalComponent,
    ContactUsComponent,
    SymptomCheckerComponent,
    DoctorLoginComponent,
    DoctorDashboardComponent,
    PatientSearchComponent,
    PatientHistoryComponent,
    PatientDetailsComponent
  ],
  imports: [
    HttpClientModule,
    BrowserModule,
    ReactiveFormsModule,
    FormsModule,
    CommonModule,
    RouterModule.forRoot(routes),
    BrowserAnimationsModule,  // required for Material animations
    MatFormFieldModule,
    MatDialogModule,
    MatButtonModule,
    MatSelectModule
  ],
  providers: [
    provideAnimationsAsync()
  ],
  bootstrap: [AppComponent],
})
export class AppModule { }
