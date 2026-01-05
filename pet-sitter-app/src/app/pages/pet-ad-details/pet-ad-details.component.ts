import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { PetAdService, PetAd } from '../../core/services/pet-ad.service';
import { PetApiService, BreedInfo } from '../../core/services/pet-api.service';

@Component({
  selector: 'app-pet-ad-details',
  standalone: true,
  imports: [CommonModule, RouterModule, TranslateModule],
  templateUrl: './pet-ad-details.component.html',
  styleUrl: './pet-ad-details.component.scss'
})
export class PetAdDetailsComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private petAdService = inject(PetAdService);
  private petApiService = inject(PetApiService);

  petAd: PetAd | undefined;
  breedInfo: BreedInfo | null = null;
  isLoadingBreedInfo = false;
  showBreedInfo = false;

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const id = Number(params.get('id')) || 1;
      this.loadPetAd(id);
    });
  }

  loadPetAd(id: number): void {
    this.petAdService.getPetAdById(id).subscribe(ad => {
      this.petAd = ad;
    });
  }

  meetPet(): void {
    if (!this.petAd) return;

    this.isLoadingBreedInfo = true;
    this.showBreedInfo = true;

    this.petApiService.getBreedInfo(this.petAd.petType, this.petAd.breed).subscribe(info => {
      this.breedInfo = info;
      this.isLoadingBreedInfo = false;
    });
  }

  toggleFavorite(): void {
    if (this.petAd) {
      this.petAdService.toggleFavorite(this.petAd.id);
      this.petAd.isFavorite = !this.petAd.isFavorite;
    }
  }

  getPetTypeIcon(petType: 'dog' | 'cat'): string {
    return petType === 'dog' ? '🐕' : '🐱';
  }

  getTraitStars(level: number | undefined): string {
    if (!level) return '';
    return '★'.repeat(level) + '☆'.repeat(5 - level);
  }
}
