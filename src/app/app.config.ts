import { ApplicationConfig } from '@angular/core';
import { provideRouter, Routes } from '@angular/router';
import { ProductComponent } from './product/product.component';

// Define your routes
const routes: Routes = [
  { path: '', redirectTo: 'product', pathMatch: 'full' },
  { path: 'product', component: ProductComponent },
  { path: '**', redirectTo: 'product' } // Redirect to product for any unknown routes
];

// Set up the application configuration
export const appConfig: ApplicationConfig = {
  providers: [provideRouter(routes)] // Pass the routes to the provideRouter function
};
