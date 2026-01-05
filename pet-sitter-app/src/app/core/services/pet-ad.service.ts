import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface PetAd {
  id: number;
  petName: string;
  petType: 'dog' | 'cat';
  breed: string;
  ownerName: string;
  ownerEmail: string;
  title: string;
  description: string;
  location: string;
  price: number;
  currency: string;
  startDate: string;
  endDate: string;
  image: string;
  specialNeeds?: string;
  isFavorite: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class PetAdService {
  private readonly STORAGE_KEY = 'userPetAds';
  private readonly FAVORITES_KEY = 'favoritePetAds';

  private predefinedAds: PetAd[] = [
    {
      id: 1,
      petName: 'Max',
      petType: 'dog',
      breed: 'Golden Retriever',
      ownerName: 'Maria Ionescu',
      ownerEmail: 'maria.ionescu@example.com',
      title: 'Need sitter for friendly Golden Retriever',
      description: 'Max is a 3-year-old Golden Retriever who loves playing fetch and going for walks. He\'s very friendly with other dogs and children. Looking for someone to take care of him while I\'m away on business.',
      location: 'Bucharest, Romania',
      price: 50,
      currency: 'RON',
      startDate: '2026-02-15',
      endDate: '2026-02-20',
      image: 'https://images.unsplash.com/photo-1633722715463-d30f4f325e24?w=800',
      specialNeeds: 'Needs to be walked twice daily',
      isFavorite: false
    },
    {
      id: 2,
      petName: 'Luna',
      petType: 'cat',
      breed: 'Siamese',
      ownerName: 'Andrei Popescu',
      ownerEmail: 'andrei.popescu@example.com',
      title: 'Looking for cat sitter - Siamese cat',
      description: 'Luna is a beautiful 2-year-old Siamese cat. She\'s very affectionate and loves attention. She\'s indoor only and needs someone to visit once a day to feed and play with her.',
      location: 'Cluj-Napoca, Romania',
      price: 30,
      currency: 'RON',
      startDate: '2026-02-10',
      endDate: '2026-02-14',
      image: 'https://images.unsplash.com/photo-1513245543132-31f507417b26?w=800',
      isFavorite: false
    },
    {
      id: 3,
      petName: 'Rex',
      petType: 'dog',
      breed: 'German Shepherd',
      ownerName: 'Elena Dumitrescu',
      ownerEmail: 'elena.dumitrescu@example.com',
      title: 'German Shepherd needs experienced sitter',
      description: 'Rex is a well-trained 5-year-old German Shepherd. He needs an experienced sitter who can handle large dogs. He\'s protective but very loyal and well-behaved.',
      location: 'Brasov, Romania',
      price: 70,
      currency: 'RON',
      startDate: '2026-03-01',
      endDate: '2026-03-10',
      image: 'https://images.unsplash.com/photo-1568572933382-74d440642117?w=800',
      specialNeeds: 'Experience with large breeds required',
      isFavorite: false
    },
    {
      id: 4,
      petName: 'Mimi',
      petType: 'cat',
      breed: 'Persian',
      ownerName: 'Cristina Marin',
      ownerEmail: 'cristina.marin@example.com',
      title: 'Persian cat needs daily grooming',
      description: 'Mimi is a fluffy 4-year-old Persian cat who requires daily grooming. She\'s very calm and loves to cuddle. Looking for someone who can spend quality time with her.',
      location: 'Timisoara, Romania',
      price: 40,
      currency: 'RON',
      startDate: '2026-02-18',
      endDate: '2026-02-25',
      image: 'https://images.unsplash.com/photo-1589883661923-6476cb0ae9f2?w=800',
      specialNeeds: 'Daily grooming required',
      isFavorite: false
    },
    {
      id: 5,
      petName: 'Buddy',
      petType: 'dog',
      breed: 'Labrador Retriever',
      ownerName: 'Mihai Stanciu',
      ownerEmail: 'mihai.stanciu@example.com',
      title: 'Energetic Labrador needs active sitter',
      description: 'Buddy is a 2-year-old Labrador full of energy! He needs someone who can keep up with his playful nature and take him on long walks or to the park.',
      location: 'Iasi, Romania',
      price: 55,
      currency: 'RON',
      startDate: '2026-02-22',
      endDate: '2026-02-28',
      image: 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=800',
      specialNeeds: 'Needs lots of exercise and playtime',
      isFavorite: false
    },
    {
      id: 6,
      petName: 'Whiskers',
      petType: 'cat',
      breed: 'Maine Coon',
      ownerName: 'Alexandra Popa',
      ownerEmail: 'alexandra.popa@example.com',
      title: 'Large Maine Coon needs experienced cat lover',
      description: 'Whiskers is a gentle giant! He\'s a 6-year-old Maine Coon who loves to chat and follow you around. He\'s very friendly but needs someone familiar with large cat breeds.',
      location: 'Constanta, Romania',
      price: 45,
      currency: 'RON',
      startDate: '2026-03-05',
      endDate: '2026-03-12',
      image: 'https://images.unsplash.com/photo-1606214174585-fe31582dc6ee?w=800',
      isFavorite: false
    }
  ];

  private userAdsSubject = new BehaviorSubject<PetAd[]>(this.loadUserAds());
  public userAds$ = this.userAdsSubject.asObservable();

  constructor() {
    this.loadFavorites();
  }

  getPetAds(): Observable<PetAd[]> {
    const userAds = this.userAdsSubject.value;
    const allAds = [...this.predefinedAds, ...userAds];
    return new BehaviorSubject(allAds).asObservable();
  }

  getPetAdById(id: number): Observable<PetAd | undefined> {
    const userAds = this.userAdsSubject.value;
    const allAds = [...this.predefinedAds, ...userAds];
    const ad = allAds.find(ad => ad.id === id);
    return new BehaviorSubject(ad || allAds[0]).asObservable();
  }

  addPetAd(adData: Omit<PetAd, 'id' | 'isFavorite'>): PetAd {
    const userAds = this.userAdsSubject.value;
    const newAd: PetAd = {
      ...adData,
      id: Date.now(),
      isFavorite: false
    };
    const updatedAds = [...userAds, newAd];
    this.saveUserAds(updatedAds);
    this.userAdsSubject.next(updatedAds);
    return newAd;
  }

  toggleFavorite(adId: number): void {
    this.predefinedAds = this.predefinedAds.map(ad =>
      ad.id === adId ? { ...ad, isFavorite: !ad.isFavorite } : ad
    );
    const userAds = this.userAdsSubject.value.map(ad =>
      ad.id === adId ? { ...ad, isFavorite: !ad.isFavorite } : ad
    );
    this.userAdsSubject.next(userAds);
    this.saveUserAds(userAds);
    this.saveFavorites();
  }

  getLocations(): string[] {
    const userAds = this.userAdsSubject.value;
    const allAds = [...this.predefinedAds, ...userAds];
    return [...new Set(allAds.map(ad => ad.location))];
  }

  getPetTypes(): string[] {
    return ['dog', 'cat'];
  }

  private loadUserAds(): PetAd[] {
    const stored = localStorage.getItem(this.STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  }

  private saveUserAds(ads: PetAd[]): void {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(ads));
  }

  private loadFavorites(): void {
    const stored = localStorage.getItem(this.FAVORITES_KEY);
    if (stored) {
      const favoriteIds: number[] = JSON.parse(stored);
      this.predefinedAds = this.predefinedAds.map(ad => ({
        ...ad,
        isFavorite: favoriteIds.includes(ad.id)
      }));
    }
  }

  private saveFavorites(): void {
    const userAds = this.userAdsSubject.value;
    const allAds = [...this.predefinedAds, ...userAds];
    const favoriteIds = allAds.filter(ad => ad.isFavorite).map(ad => ad.id);
    localStorage.setItem(this.FAVORITES_KEY, JSON.stringify(favoriteIds));
  }
}
