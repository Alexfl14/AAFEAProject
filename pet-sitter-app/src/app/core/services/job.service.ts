import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

export interface Job {
  id: number;
  title: string;
  name: string;
  author: string;
  description: string;
  location: string;
  price: number;
  currency: string;
  serviceType: 'walking' | 'grooming' | 'boarding';
  image: string;
  rating: number;
  reviewsCount: number;
  isFavorite: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class JobService {
  private userJobs: Job[] = [];
  private readonly initialJobs: Job[] = [
    {
      id: 1,
      title: 'Plimbător de Câini Experimentat',
      name: 'Maria Popescu',
      author: 'Maria Popescu',
      description: 'Sunt o pasionată de animale și ofer servicii de plimbare pentru câini de toate taliile. Am experiență în dresaj de bază și mă asigur că patrupedul tău are parte de o plimbare sigură și distractivă.',
      location: 'București',
      price: 25,
      currency: 'RON',
      serviceType: 'walking',
      image: 'https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&q=80&w=800',
      rating: 5.0,
      reviewsCount: 12,
      isFavorite: false
    },
    {
      id: 2,
      title: 'Îngrijire Pisici la Domiciliu',
      name: 'Andrei Ionescu',
      author: 'Andrei Ionescu',
      description: 'Ofer cazare și îngrijire la domiciliul meu pentru pisici. Iubesc felinele și mă voi asigura că se simt ca acasă cât timp ești plecat, oferindu-le atenție, joacă și hrană la timp.',
      location: 'Cluj-Napoca',
      price: 30,
      currency: 'RON',
      serviceType: 'boarding',
      image: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&q=80&w=800',
      rating: 4.8,
      reviewsCount: 8,
      isFavorite: false
    },
    {
      id: 3,
      title: 'Grooming Profesional Complet',
      name: 'Elena Dumitrescu',
      author: 'Elena Dumitrescu',
      description: 'Sunt groomer certificat și ofer servicii profesionale de tuns și aranjat pentru cățelul tău. Mă concentrez pe confortul animalului și folosesc produse blânde, de calitate superioară.',
      location: 'Timișoara',
      price: 150,
      currency: 'RON',
      serviceType: 'grooming',
      image: 'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?auto=format&fit=crop&q=80&w=800',
      rating: 4.9,
      reviewsCount: 24,
      isFavorite: false
    },
    {
      id: 4,
      title: 'Plimbări de Seară',
      name: 'Bogdan Popa',
      author: 'Bogdan Popa',
      description: 'Ofer servicii de plimbare pentru câini în timpul serii. Sunt calm și răbdător cu animalele anxioase.',
      location: 'Brașov',
      price: 20,
      currency: 'RON',
      serviceType: 'walking',
      image: 'https://images.unsplash.com/photo-1583511655826-05700d52f4d9?auto=format&fit=crop&q=80&w=800',
      rating: 4.7,
      reviewsCount: 15,
      isFavorite: false
    },
    {
      id: 5,
      title: 'Cazare Confortabilă pentru Animale',
      name: 'Cristina Georgescu',
      author: 'Cristina Georgescu',
      description: 'Ofer cazare pentru căței și pisici într-un mediu familial, fără cuști. Curte mare disponibilă.',
      location: 'București',
      price: 60,
      currency: 'RON',
      serviceType: 'boarding',
      image: 'https://images.unsplash.com/photo-1596492784531-6e6eb5ea9993?auto=format&fit=crop&q=80&w=800',
      rating: 5.0,
      reviewsCount: 10,
      isFavorite: false
    },
    {
      id: 6,
      title: 'Spălat și Periat Profesional',
      name: 'Radu Mihail',
      author: 'Radu Mihail',
      description: 'Servicii de cosmetică canină și felină. Folosesc doar produse premium, non-alergenice.',
      location: 'Sibiu',
      price: 100,
      currency: 'RON',
      serviceType: 'grooming',
      image: 'https://images.unsplash.com/photo-1535930891776-0c2dfb7fda1a?auto=format&fit=crop&q=80&w=800',
      rating: 4.6,
      reviewsCount: 18,
      isFavorite: false
    },
    {
      id: 7,
      title: 'Însoțitor pentru Câini Activi',
      name: 'Ioana Stancu',
      author: 'Ioana Stancu',
      description: 'Dacă ai un câine cu multă energie, eu sunt persoana potrivită! Facem jogging și alergări în parc.',
      location: 'Cluj-Napoca',
      price: 35,
      currency: 'RON',
      serviceType: 'walking',
      image: 'https://images.unsplash.com/photo-1544568100-847a948585b9?auto=format&fit=crop&q=80&w=800',
      rating: 4.9,
      reviewsCount: 30,
      isFavorite: false
    },
    {
      id: 8,
      title: 'Pensionară Iubitoare de Animale',
      name: 'Anca Marin',
      author: 'Anca Marin',
      description: 'Am timp liber și multă dragoste de oferit. Pot avea grijă de animalul tău pe parcursul zilei sau nopții.',
      location: 'Brașov',
      price: 45,
      currency: 'RON',
      serviceType: 'boarding',
      image: 'https://images.unsplash.com/photo-1537151608828-ea2b11777ee8?auto=format&fit=crop&q=80&w=800',
      rating: 5.0,
      reviewsCount: 5,
      isFavorite: false
    },
    {
      id: 9,
      title: 'Tuns Igienic și Stilizat',
      name: 'David Niculescu',
      author: 'David Niculescu',
      description: 'Groomer cu experiență de 5 ani. Ofer tuns de întreținere sau pentru concursuri.',
      location: 'București',
      price: 120,
      currency: 'RON',
      serviceType: 'grooming',
      image: 'https://images.unsplash.com/photo-1516734212186-a967f81ad0d7?auto=format&fit=crop&q=80&w=800',
      rating: 4.8,
      reviewsCount: 22,
      isFavorite: false
    },
    {
      id: 10,
      title: 'Plimbări de Weekend',
      name: 'Stefan Rădulescu',
      author: 'Stefan Rădulescu',
      description: 'Disponibil sâmbăta și duminica pentru plimbări lungi în natură. Iubesc toate rasele.',
      location: 'Timișoara',
      price: 25,
      currency: 'RON',
      serviceType: 'walking',
      image: 'https://images.unsplash.com/photo-1534361960057-19889db9621e?auto=format&fit=crop&q=80&w=800',
      rating: 4.9,
      reviewsCount: 14,
      isFavorite: false
    }
  ];

  constructor() {
    this.loadUserJobs();
    this.loadFavorites();
  }

  getJobs(): Job[] {
    return [...this.userJobs, ...this.initialJobs];
  }

  getJobById(id: number): Observable<Job | undefined> {
    const job = [...this.userJobs, ...this.initialJobs].find(j => j.id === id);
    return of(job || this.initialJobs[0]);
  }

  addJob(jobData: Omit<Job, 'id' | 'rating' | 'reviewsCount' | 'isFavorite' | 'currency' | 'author' | 'image'> & { image?: string }): void {
    const newJob: Job = {
      ...jobData,
      id: Date.now(),
      author: jobData.name,
      currency: 'RON',
      rating: 5.0,
      reviewsCount: 0,
      isFavorite: false,
      image: jobData.image || this.getDefaultImage(jobData.serviceType)
    };
    this.userJobs.unshift(newJob);
    this.saveUserJobs();
  }

  getServiceTypes(): string[] {
    return [...new Set(this.getJobs().map(job => job.serviceType))];
  }

  getLocations(): string[] {
    return [...new Set(this.getJobs().map(job => job.location))];
  }

  toggleFavorite(jobId: number): void {
    const job = [...this.userJobs, ...this.initialJobs].find(j => j.id === jobId);
    if (job) {
      job.isFavorite = !job.isFavorite;
      this.saveFavorites();
    }
  }

  private getDefaultImage(type: string): string {
    const images = {
      walking: 'https://images.unsplash.com/photo-1601758228041-f3b2795255f1?auto=format&fit=crop&q=80&w=800',
      boarding: 'https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?auto=format&fit=crop&q=80&w=800',
      grooming: 'https://images.unsplash.com/photo-1516734212186-a967f81ad0d7?auto=format&fit=crop&q=80&w=800'
    };
    return images[type as keyof typeof images] || images.walking;
  }

  private saveUserJobs(): void {
    localStorage.setItem('userJobs', JSON.stringify(this.userJobs));
  }

  private loadUserJobs(): void {
    const jobsStr = localStorage.getItem('userJobs');
    if (jobsStr) {
      this.userJobs = JSON.parse(jobsStr);
    }
  }

  private saveFavorites(): void {
    const userFavs = this.userJobs.filter(j => j.isFavorite).map(j => j.id);
    const initialFavs = this.initialJobs.filter(j => j.isFavorite).map(j => j.id);
    localStorage.setItem('favoriteJobs', JSON.stringify([...userFavs, ...initialFavs]));
  }

  private loadFavorites(): void {
    const favoritesStr = localStorage.getItem('favoriteJobs');
    if (favoritesStr) {
      const favorites = JSON.parse(favoritesStr) as number[];
      [...this.userJobs, ...this.initialJobs].forEach(job => {
        job.isFavorite = favorites.includes(job.id);
      });
    }
  }
}
