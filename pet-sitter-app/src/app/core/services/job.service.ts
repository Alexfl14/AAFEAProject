import { Injectable, signal } from '@angular/core';

export interface Job {
  id: number;
  title: string;
  name: string;
  serviceType: 'Daycare' | 'Training' | 'Walking';
  location: string;
  price: number;
  description: string;
  image?: string;
  isFavorite: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class JobService {
  private readonly FAVORITES_KEY = 'pet-sitter-favorites';

  // Signal for jobs list
  private jobsSignal = signal<Job[]>([]);

  // Signal for favorite IDs
  private favoriteIdsSignal = signal<number[]>([]);

  constructor() {
    this.initializeMockData();
    this.loadFavoritesFromStorage();
  }

  /**
   * Initialize mock data with 20 job listings
   */
  private initializeMockData(): void {
    const mockJobs: Job[] = [
      {
        id: 1,
        title: 'Plimbător de Câini Experimentat',
        name: 'Maria Popescu',
        serviceType: 'Walking',
        location: 'București',
        price: 25,
        description: 'Caut un plimbător de încredere pentru Golden Retrieverul meu energic. Disponibilitate dimineața în zilele lucrătoare.',
        image: 'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=400&h=300&fit=crop',
        isFavorite: false
      },
      {
        id: 2,
        title: 'Servicii de Creșă pentru Cățeluși',
        name: 'Andrei Ionescu',
        serviceType: 'Daycare',
        location: 'Cluj-Napoca',
        price: 45,
        description: 'Îngrijire pe toată ziua pentru cățeluși cu socializare și antrenament de bază inclus.',
        image: 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=400&h=300&fit=crop',
        isFavorite: false
      },
      {
        id: 3,
        title: 'Antrenament Profesional pentru Câini',
        name: 'Elena Dumitrescu',
        serviceType: 'Training',
        location: 'Timișoara',
        price: 60,
        description: 'Antrenor canin certificat specializat în obediență și antrenament comportamental.',
        image: 'https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=400&h=300&fit=crop',
        isFavorite: false
      },
      {
        id: 4,
        title: 'Plimbări cu Câinii în Weekend',
        name: 'Alexandru Popa',
        serviceType: 'Walking',
        location: 'Iași',
        price: 20,
        description: 'Disponibil pentru plimbări în weekend în parcurile locale. Excelent cu rasele mari.',
        image: 'https://images.unsplash.com/photo-1558788353-f76d92427f16?w=400&h=300&fit=crop',
        isFavorite: false
      },
      {
        id: 5,
        title: 'Creșă și Îngrijire pentru Pisici',
        name: 'Ana Constantinescu',
        serviceType: 'Daycare',
        location: 'Constanța',
        price: 35,
        description: 'Îngrijire specializată pentru pisici într-un mediu calm și casnic.',
        image: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=400&h=300&fit=crop',
        isFavorite: false
      },
      {
        id: 6,
        title: 'Antrenament Comportamental pentru Cățeluși',
        name: 'Mihai Radu',
        serviceType: 'Training',
        location: 'Brașov',
        price: 55,
        description: 'Expert în antrenament pentru cățeluși, învățarea curățeniei și abilități de socializare.',
        image: 'https://images.unsplash.com/photo-1537151608828-ea2b11777ee8?w=400&h=300&fit=crop',
        isFavorite: false
      },
      {
        id: 7,
        title: 'Plimbări Matinale cu Câinii',
        name: 'Ioana Georgescu',
        serviceType: 'Walking',
        location: 'Craiova',
        price: 22,
        description: 'Plimbări dimineața devreme înainte de serviciu. Perfect pentru profesioniștii ocupați.',
        image: 'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=400&h=300&fit=crop',
        isFavorite: false
      },
      {
        id: 8,
        title: 'Creșă pentru Animale Toată Ziua',
        name: 'Cristian Stoica',
        serviceType: 'Daycare',
        location: 'Galați',
        price: 50,
        description: 'Creșă supravegheată cu zone de joacă și somn. Deschis 7:00-19:00.',
        image: 'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?w=400&h=300&fit=crop',
        isFavorite: false
      },
      {
        id: 9,
        title: 'Cursuri de Antrenament de Agilitate',
        name: 'Gabriela Nicolescu',
        serviceType: 'Training',
        location: 'Ploiești',
        price: 65,
        description: 'Cursuri distractive de agilitate pentru câini activi. Îmbunătățește fitness-ul și obediența.',
        image: 'https://images.unsplash.com/photo-1568572933382-74d440642117?w=400&h=300&fit=crop',
        isFavorite: false
      },
      {
        id: 10,
        title: 'Servicii de Plimbare Seara',
        name: 'Dan Marinescu',
        serviceType: 'Walking',
        location: 'Sibiu',
        price: 23,
        description: 'Plimbări de seară sigure pentru câini care au nevoie de exerciții după program.',
        image: 'https://images.unsplash.com/photo-1534361960057-19889db9621e?w=400&h=300&fit=crop',
        isFavorite: false
      },
      {
        id: 11,
        title: 'Creșă pentru Câini Mici',
        name: 'Raluca Vasilescu',
        serviceType: 'Daycare',
        location: 'Oradea',
        price: 40,
        description: 'Îngrijire specializată pentru rase mici sub 10 kg. Mediu sigur și blând.',
        image: 'https://images.unsplash.com/photo-1552053831-71594a27632d?w=400&h=300&fit=crop',
        isFavorite: false
      },
      {
        id: 12,
        title: 'Antrenament Avansat de Obediență',
        name: 'Vlad Munteanu',
        serviceType: 'Training',
        location: 'Pitești',
        price: 70,
        description: 'Antrenament avansat pentru câini care au stăpânit bazele. Pregătire pentru competiții disponibilă.',
        image: 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=400&h=300&fit=crop',
        isFavorite: false
      },
      {
        id: 13,
        title: 'Plimbări în Grup cu Câinii',
        name: 'Simona Barbu',
        serviceType: 'Walking',
        location: 'Bacău',
        price: 18,
        description: 'Plimbări sociale în grup cu până la 4 câini. Excelent pentru socializare.',
        image: 'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=400&h=300&fit=crop',
        isFavorite: false
      },
      {
        id: 14,
        title: 'Creșă Premium pentru Animale',
        name: 'Cosmin Dragomir',
        serviceType: 'Daycare',
        location: 'Arad',
        price: 55,
        description: 'Creșă de lux cu acces webcam, îngrijire și sesiuni de antrenament.',
        image: 'https://images.unsplash.com/photo-1623387641168-d9803ddd3f35?w=400&h=300&fit=crop',
        isFavorite: false
      },
      {
        id: 15,
        title: 'Antrenament Câini de Asistență',
        name: 'Adriana Stan',
        serviceType: 'Training',
        location: 'Suceava',
        price: 80,
        description: 'Antrenament certificat pentru câini de asistență terapeutică.',
        image: 'https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=400&h=300&fit=crop',
        isFavorite: false
      },
      {
        id: 16,
        title: 'Drumeții pe Poteci cu Câinii',
        name: 'Bogdan Preda',
        serviceType: 'Walking',
        location: 'Baia Mare',
        price: 30,
        description: 'Plimbări aventuroase pe potecile locale. Perfect pentru câini cu energie mare.',
        image: 'https://images.unsplash.com/photo-1558788353-f76d92427f16?w=400&h=300&fit=crop',
        isFavorite: false
      },
      {
        id: 17,
        title: 'Cazare Peste Noapte pentru Animale',
        name: 'Daniela Cojocaru',
        serviceType: 'Daycare',
        location: 'Târgu Mureș',
        price: 60,
        description: 'Cazare peste noapte la domiciliu cu multă atenție și îngrijire.',
        image: 'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?w=400&h=300&fit=crop',
        isFavorite: false
      },
      {
        id: 18,
        title: 'Antrenament Igienă pentru Cățeluși',
        name: 'Florin Diaconu',
        serviceType: 'Training',
        location: 'Buzău',
        price: 50,
        description: 'Specializat în antrenament de igienă pentru cățeluși cu tehnici dovedite.',
        image: 'https://images.unsplash.com/photo-1537151608828-ea2b11777ee8?w=400&h=300&fit=crop',
        isFavorite: false
      },
      {
        id: 19,
        title: 'Plimbări la Amiază cu Câinii',
        name: 'Laura Enache',
        serviceType: 'Walking',
        location: 'Satu Mare',
        price: 21,
        description: 'Plimbări la prânz pentru câini care sunt singuri acasă în timpul zilei.',
        image: 'https://images.unsplash.com/photo-1534361960057-19889db9621e?w=400&h=300&fit=crop',
        isFavorite: false
      },
      {
        id: 20,
        title: 'Creșă pentru Mai Multe Animale',
        name: 'Sorin Toma',
        serviceType: 'Daycare',
        location: 'Deva',
        price: 65,
        description: 'Îngrijire pentru mai multe animale din aceeași familie. Reducere pentru frați disponibilă.',
        image: 'https://images.unsplash.com/photo-1450778869180-41d0601e046e?w=400&h=300&fit=crop',
        isFavorite: false
      }
    ];

    this.jobsSignal.set(mockJobs);
  }

  /**
   * Load favorite IDs from localStorage
   */
  private loadFavoritesFromStorage(): void {
    try {
      const stored = localStorage.getItem(this.FAVORITES_KEY);
      if (stored) {
        const favoriteIds = JSON.parse(stored) as number[];
        this.favoriteIdsSignal.set(favoriteIds);
        this.updateJobsFavoriteStatus(favoriteIds);
      }
    } catch (error) {
      console.error('Error loading favorites from localStorage:', error);
      this.favoriteIdsSignal.set([]);
    }
  }

  /**
   * Save favorite IDs to localStorage
   */
  private saveFavoritesToStorage(favoriteIds: number[]): void {
    try {
      localStorage.setItem(this.FAVORITES_KEY, JSON.stringify(favoriteIds));
    } catch (error) {
      console.error('Error saving favorites to localStorage:', error);
    }
  }

  /**
   * Update jobs' isFavorite status based on favorite IDs
   */
  private updateJobsFavoriteStatus(favoriteIds: number[]): void {
    const jobs = this.jobsSignal();
    const updatedJobs = jobs.map(job => ({
      ...job,
      isFavorite: favoriteIds.includes(job.id)
    }));
    this.jobsSignal.set(updatedJobs);
  }

  /**
   * Get all jobs
   */
  getJobs(): Job[] {
    return this.jobsSignal();
  }

  /**
   * Get jobs signal for reactive updates
   */
  getJobsSignal() {
    return this.jobsSignal.asReadonly();
  }

  /**
   * Get a single job by ID
   */
  getJobById(id: number): Job | undefined {
    return this.jobsSignal().find(job => job.id === id);
  }

  /**
   * Toggle favorite status for a job
   */
  toggleFavorite(jobId: number): void {
    const jobs = this.jobsSignal();
    const favoriteIds = this.favoriteIdsSignal();

    // Update jobs array
    const updatedJobs = jobs.map(job => {
      if (job.id === jobId) {
        return { ...job, isFavorite: !job.isFavorite };
      }
      return job;
    });

    // Update favorite IDs
    let updatedFavoriteIds: number[];
    if (favoriteIds.includes(jobId)) {
      updatedFavoriteIds = favoriteIds.filter(id => id !== jobId);
    } else {
      updatedFavoriteIds = [...favoriteIds, jobId];
    }

    // Update signals
    this.jobsSignal.set(updatedJobs);
    this.favoriteIdsSignal.set(updatedFavoriteIds);

    // Persist to localStorage
    this.saveFavoritesToStorage(updatedFavoriteIds);
  }

  /**
   * Get all favorite jobs
   */
  getFavoriteJobs(): Job[] {
    return this.jobsSignal().filter(job => job.isFavorite);
  }

  /**
   * Get favorite IDs
   */
  getFavoriteIds(): number[] {
    return this.favoriteIdsSignal();
  }

  /**
   * Check if a job is favorited
   */
  isFavorite(jobId: number): boolean {
    return this.favoriteIdsSignal().includes(jobId);
  }

  /**
   * Filter jobs by criteria
   */
  filterJobs(serviceType?: string, location?: string): Job[] {
    let filteredJobs = this.jobsSignal();

    if (serviceType && serviceType !== 'all') {
      filteredJobs = filteredJobs.filter(job => job.serviceType === serviceType);
    }

    if (location && location.trim() !== '') {
      const searchTerm = location.toLowerCase().trim();
      filteredJobs = filteredJobs.filter(job =>
        job.location.toLowerCase().includes(searchTerm)
      );
    }

    return filteredJobs;
  }

  /**
   * Get unique service types
   */
  getServiceTypes(): string[] {
    return ['Daycare', 'Training', 'Walking'];
  }

  /**
   * Get unique locations
   */
  getLocations(): string[] {
    const jobs = this.jobsSignal();
    const locations = jobs.map(job => job.location);
    return [...new Set(locations)].sort();
  }
}
