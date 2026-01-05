import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { JobService } from '../../core/services/job.service';

@Component({
  selector: 'app-create-ad',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule, TranslateModule],
  templateUrl: './create-ad.component.html',
  styleUrl: './create-ad.component.scss'
})
export class CreateAdComponent {
  private fb = inject(FormBuilder);
  private jobService = inject(JobService);
  private router = inject(Router);

  currentStep = 1;
  isSubmitted = false;

  galleryImages = [
    'https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&q=80&w=400',
    'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&q=80&w=400',
    'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?auto=format&fit=crop&q=80&w=400',
    'https://images.unsplash.com/photo-1583511655826-05700d52f4d9?auto=format&fit=crop&q=80&w=400',
    'https://images.unsplash.com/photo-1596492784531-6e6eb5ea9993?auto=format&fit=crop&q=80&w=400',
    'https://images.unsplash.com/photo-1544568100-847a948585b9?auto=format&fit=crop&q=80&w=400',
    'https://images.unsplash.com/photo-1537151608828-ea2b11777ee8?auto=format&fit=crop&q=80&w=400',
    'https://images.unsplash.com/photo-1534361960057-19889db9621e?auto=format&fit=crop&q=80&w=400'
  ];

  adForm = this.fb.group({
    serviceType: ['walking', Validators.required],
    title: ['', [Validators.required, Validators.minLength(5)]],
    description: ['', [Validators.required, Validators.minLength(10)]],
    name: ['', Validators.required],
    location: ['', Validators.required],
    price: [null as number | null, [Validators.required, Validators.min(1)]],
    image: ['']
  });

  nextStep() {
    if (this.currentStep < 4) {
      if (this.isStepValid(this.currentStep)) {
        this.currentStep++;
      } else {
        this.markStepAsTouched(this.currentStep);
      }
    }
  }

  prevStep() {
    if (this.currentStep > 1) {
      this.currentStep--;
    }
  }

  isStepValid(step: number): boolean {
    switch (step) {
      case 1:
        return !!(this.adForm.get('serviceType')?.valid && this.adForm.get('title')?.valid && this.adForm.get('description')?.valid);
      case 2:
        return !!this.adForm.get('name')?.valid;
      case 3:
        return !!(this.adForm.get('location')?.valid && this.adForm.get('price')?.valid);
      case 4:
        return true; // Image is optional, defaults to service type
      default:
        return true;
    }
  }

  markStepAsTouched(step: number) {
    switch (step) {
      case 1:
        this.adForm.get('serviceType')?.markAsTouched();
        this.adForm.get('title')?.markAsTouched();
        this.adForm.get('description')?.markAsTouched();
        break;
      case 2:
        this.adForm.get('name')?.markAsTouched();
        break;
      case 3:
        this.adForm.get('location')?.markAsTouched();
        this.adForm.get('price')?.markAsTouched();
        break;
    }
  }

  selectGalleryImage(url: string) {
    this.adForm.patchValue({ image: url });
  }

  onSubmit() {
    if (this.adForm.valid) {
      const formValue = this.adForm.value;
      this.jobService.addJob({
        title: formValue.title as string,
        name: formValue.name as string,
        description: formValue.description as string,
        location: formValue.location as string,
        price: formValue.price as number,
        serviceType: formValue.serviceType as 'walking' | 'grooming' | 'boarding',
        image: (formValue.image as string) || undefined
      });
      this.isSubmitted = true;
    }
  }

  goToFindSitter() {
    this.router.navigate(['/find-sitter']);
  }
}
