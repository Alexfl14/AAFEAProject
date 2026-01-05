import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: 'home',
    loadComponent: () => import('./pages/home/home.component').then(m => m.HomeComponent)
  },
  {
    path: 'find-sitter',
    loadComponent: () => import('./pages/find-sitter/find-sitter.component').then(m => m.FindSitterComponent)
  },
  {
    path: 'create-ad',
    loadComponent: () => import('./pages/create-ad/create-ad.component').then(m => m.CreateAdComponent)
  },
  {
    path: 'job-details/:id',
    loadComponent: () => import('./pages/job-details/job-details.component').then(m => m.JobDetailsComponent)
  },
  {
    path: 'about',
    loadComponent: () => import('./pages/about/about.component').then(m => m.AboutComponent)
  },
  {
    path: 'contact',
    loadComponent: () => import('./pages/contact/contact.component').then(m => m.ContactComponent)
  },
  {
    path: 'faq',
    loadComponent: () => import('./pages/faq/faq.component').then(m => m.FaqComponent)
  },
  {
    path: 'sit-my-pet',
    loadComponent: () => import('./pages/sit-my-pet/sit-my-pet.component').then(m => m.SitMyPetComponent)
  },
  {
    path: 'pet-ad-details/:id',
    loadComponent: () => import('./pages/pet-ad-details/pet-ad-details.component').then(m => m.PetAdDetailsComponent)
  },
  {
    path: 'booking',
    loadComponent: () => import('./pages/booking/booking.component').then(m => m.BookingComponent)
  },
  {
    path: 'booking-confirmation/:id',
    loadComponent: () => import('./pages/booking-confirmation/booking-confirmation.component').then(m => m.BookingConfirmationComponent)
  },
  {
    path: '**',
    redirectTo: 'home'
  }
];
