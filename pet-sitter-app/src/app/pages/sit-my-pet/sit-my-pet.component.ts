import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { PetAdService, PetAd } from '../../core/services/pet-ad.service';

@Component({
  selector: 'app-sit-my-pet',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, TranslateModule],
  templateUrl: './sit-my-pet.component.html',
  styleUrl: './sit-my-pet.component.scss'
})
export class SitMyPetComponent implements OnInit {
  private petAdService = inject(PetAdService);
  private router = inject(Router);

  petAds: PetAd[] = [];
  filteredPetAds: PetAd[] = [];

  // Filters
  selectedLocation: string = '';
  selectedPetType: string = '';
  searchQuery: string = '';
  minPrice: number = 0;
  maxPrice: number = 100;
  priceRangeMin: number = 0;
  priceRangeMax: number = 100;

  locations: string[] = [];
  petTypes: string[] = [];

  ngOnInit(): void {
    this.loadPetAds();
    this.loadFilters();
  }

  loadPetAds(): void {
    this.petAdService.getPetAds().subscribe(ads => {
      this.petAds = ads;
      this.filteredPetAds = ads;
      this.calculatePriceRange();
      this.applyFilters();
    });
  }

  calculatePriceRange(): void {
    if (this.petAds.length > 0) {
      const prices = this.petAds.map(ad => ad.price);
      this.priceRangeMin = Math.min(...prices);
      this.priceRangeMax = Math.max(...prices);
      this.minPrice = this.priceRangeMin;
      this.maxPrice = this.priceRangeMax;
    }
  }

  loadFilters(): void {
    this.locations = this.petAdService.getLocations();
    this.petTypes = this.petAdService.getPetTypes();
  }

  applyFilters(): void {
    this.filteredPetAds = this.petAds.filter(ad => {
      const matchesLocation = !this.selectedLocation || ad.location === this.selectedLocation;
      const matchesPetType = !this.selectedPetType || ad.petType === this.selectedPetType;
      const matchesSearch = !this.searchQuery ||
        ad.petName.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        ad.title.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        ad.breed.toLowerCase().includes(this.searchQuery.toLowerCase());
      const matchesPrice = ad.price >= this.minPrice && ad.price <= this.maxPrice;

      return matchesLocation && matchesPetType && matchesSearch && matchesPrice;
    });

    // Sort: Favorites first, then by id
    this.filteredPetAds.sort((a, b) => {
      if (a.isFavorite && !b.isFavorite) return -1;
      if (!a.isFavorite && b.isFavorite) return 1;
      return b.id - a.id;
    });
  }

  clearFilters(): void {
    this.selectedLocation = '';
    this.selectedPetType = '';
    this.searchQuery = '';
    this.minPrice = this.priceRangeMin;
    this.maxPrice = this.priceRangeMax;
    this.applyFilters();
  }

  onMinPriceChange(value: number): void {
    this.minPrice = value;
    if (this.minPrice > this.maxPrice) {
      this.minPrice = this.maxPrice;
    }
    this.applyFilters();
  }

  onMaxPriceChange(value: number): void {
    this.maxPrice = value;
    if (this.maxPrice < this.minPrice) {
      this.maxPrice = this.minPrice;
    }
    this.applyFilters();
  }

  viewPetAdDetails(adId: number): void {
    this.router.navigate(['/pet-ad-details', adId]);
  }

  toggleFavorite(event: Event, adId: number): void {
    event.stopPropagation();
    this.petAdService.toggleFavorite(adId);
    this.loadPetAds();
  }

  getPetTypeIcon(petType: 'dog' | 'cat'): string {
    return petType === 'dog' ? '🐕' : '🐱';
  }
}
