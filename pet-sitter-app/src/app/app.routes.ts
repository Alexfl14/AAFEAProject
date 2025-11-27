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
    path: '**',
    redirectTo: 'home'
  }
];
