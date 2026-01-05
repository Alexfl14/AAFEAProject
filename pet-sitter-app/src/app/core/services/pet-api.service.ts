import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

export interface DogBreed {
  id: number;
  name: string;
  bred_for?: string;
  breed_group?: string;
  life_span: string;
  temperament?: string;
  weight: {
    imperial: string;
    metric: string;
  };
  height: {
    imperial: string;
    metric: string;
  };
  image?: {
    url: string;
  };
}

export interface CatBreed {
  id: string;
  name: string;
  temperament?: string;
  description: string;
  life_span: string;
  weight: {
    imperial: string;
    metric: string;
  };
  origin: string;
  affection_level: number;
  child_friendly: number;
  dog_friendly: number;
  energy_level: number;
  image?: {
    url: string;
  };
}

export interface BreedInfo {
  name: string;
  temperament: string;
  lifeSpan: string;
  weight: string;
  height?: string;
  description?: string;
  origin?: string;
  traits?: {
    affectionLevel?: number;
    childFriendly?: number;
    dogFriendly?: number;
    energyLevel?: number;
  };
  imageUrl?: string;
}

@Injectable({
  providedIn: 'root'
})
export class PetApiService {
  private http = inject(HttpClient);

  private readonly DOG_API_URL = 'https://api.thedogapi.com/v1';
  private readonly CAT_API_URL = 'https://api.thecatapi.com/v1';

  getDogBreedInfo(breedName: string): Observable<BreedInfo | null> {
    return this.http.get<DogBreed[]>(`${this.DOG_API_URL}/breeds/search?q=${encodeURIComponent(breedName)}`).pipe(
      map(breeds => {
        if (breeds && breeds.length > 0) {
          const breed = breeds[0];
          return {
            name: breed.name,
            temperament: breed.temperament || 'Information not available',
            lifeSpan: breed.life_span,
            weight: breed.weight.metric ? `${breed.weight.metric} kg` : breed.weight.imperial + ' lbs',
            height: breed.height.metric ? `${breed.height.metric} cm` : breed.height.imperial + ' inches',
            description: breed.bred_for || breed.breed_group || '',
            imageUrl: breed.image?.url
          };
        }
        return null;
      }),
      catchError(error => {
        console.error('Error fetching dog breed info:', error);
        return of(null);
      })
    );
  }

  getCatBreedInfo(breedName: string): Observable<BreedInfo | null> {
    return this.http.get<CatBreed[]>(`${this.CAT_API_URL}/breeds/search?q=${encodeURIComponent(breedName)}`).pipe(
      map(breeds => {
        if (breeds && breeds.length > 0) {
          const breed = breeds[0];
          return {
            name: breed.name,
            temperament: breed.temperament || 'Information not available',
            lifeSpan: breed.life_span,
            weight: breed.weight.metric ? `${breed.weight.metric} kg` : breed.weight.imperial + ' lbs',
            description: breed.description,
            origin: breed.origin,
            traits: {
              affectionLevel: breed.affection_level,
              childFriendly: breed.child_friendly,
              dogFriendly: breed.dog_friendly,
              energyLevel: breed.energy_level
            },
            imageUrl: breed.image?.url
          };
        }
        return null;
      }),
      catchError(error => {
        console.error('Error fetching cat breed info:', error);
        return of(null);
      })
    );
  }

  getBreedInfo(petType: 'dog' | 'cat', breedName: string): Observable<BreedInfo | null> {
    if (petType === 'dog') {
      return this.getDogBreedInfo(breedName);
    } else {
      return this.getCatBreedInfo(breedName);
    }
  }
}
