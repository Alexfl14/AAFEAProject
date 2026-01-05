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
      this.applyFilters();
    });
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

      return matchesLocation && matchesPetType && matchesSearch;
    });
  }

  clearFilters(): void {
    this.selectedLocation = '';
    this.selectedPetType = '';
    this.searchQuery = '';
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
