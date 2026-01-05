import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { BookingService, BookingData } from '../../core/services/booking.service';
import { JobService } from '../../core/services/job.service';
import { PetAdService } from '../../core/services/pet-ad.service';

@Component({
  selector: 'app-booking',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, TranslateModule],
  templateUrl: './booking.component.html',
  styleUrl: './booking.component.scss'
})
export class BookingComponent implements OnInit {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private bookingService = inject(BookingService);
  private jobService = inject(JobService);
  private petAdService = inject(PetAdService);

  currentStep = 1;
  totalSteps = 4;

  bookingData: BookingData = {};
  serviceType: 'sitter' | 'petAd' | null = null;

  // Form groups for each step
  datesForm!: FormGroup;
  petDetailsForm!: FormGroup;
  contactForm!: FormGroup;

  // Validation and state
  isSubmitting = false;

  ngOnInit(): void {
    // Initialize forms
    this.initializeForms();

    // Always subscribe to booking draft updates
    this.bookingService.bookingDraft$.subscribe(draft => {
      this.bookingData = draft;
      this.currentStep = draft.currentStep || 1;
      this.serviceType = draft.serviceType || null;
      this.populateFormsFromDraft(draft);
    });

    // Check if service ID is provided in query params
    this.route.queryParams.subscribe(params => {
      const serviceId = params['serviceId'];
      const serviceType = params['type'] as 'sitter' | 'petAd';

      if (serviceId && serviceType) {
        // Load fresh service details from query params
        this.loadServiceDetails(+serviceId, serviceType);
      }
    });
  }

  initializeForms(): void {
    // Step 2: Dates & Details
    this.datesForm = this.fb.group({
      startDate: ['', Validators.required],
      endDate: ['', Validators.required],
      specialRequests: ['']
    });

    // Step 3: Pet Details
    this.petDetailsForm = this.fb.group({
      petName: ['', Validators.required],
      petType: ['dog', Validators.required],
      petBreed: ['', Validators.required],
      petAge: [null, [Validators.required, Validators.min(0)]],
      petSpecialNeeds: ['']
    });

    // Step 4: Contact Information
    this.contactForm = this.fb.group({
      ownerName: ['', Validators.required],
      ownerEmail: ['', [Validators.required, Validators.email]],
      ownerPhone: ['', [Validators.required, Validators.minLength(10)]],
      ownerAddress: ['', Validators.required]
    });
  }

  loadServiceDetails(serviceId: number, serviceType: 'sitter' | 'petAd'): void {
    if (serviceType === 'sitter') {
      this.jobService.getJobById(serviceId).subscribe(job => {
        if (job) {
          this.bookingService.initializeBooking(
            job.id,
            'sitter',
            job.title,
            job.price
          );
        }
      });
    } else {
      this.petAdService.getPetAdById(serviceId).subscribe(ad => {
        if (ad) {
          this.bookingService.initializeBooking(
            ad.id,
            'petAd',
            `${ad.petName} - ${ad.title}`,
            ad.price
          );
        }
      });
    }
  }

  populateFormsFromDraft(draft: BookingData): void {
    // Populate dates form
    if (draft.startDate || draft.endDate || draft.specialRequests) {
      this.datesForm.patchValue({
        startDate: draft.startDate || '',
        endDate: draft.endDate || '',
        specialRequests: draft.specialRequests || ''
      });
    }

    // Populate pet details form
    if (draft.petName || draft.petType || draft.petBreed) {
      this.petDetailsForm.patchValue({
        petName: draft.petName || '',
        petType: draft.petType || 'dog',
        petBreed: draft.petBreed || '',
        petAge: draft.petAge || null,
        petSpecialNeeds: draft.petSpecialNeeds || ''
      });
    }

    // Populate contact form
    if (draft.ownerName || draft.ownerEmail || draft.ownerPhone) {
      this.contactForm.patchValue({
        ownerName: draft.ownerName || '',
        ownerEmail: draft.ownerEmail || '',
        ownerPhone: draft.ownerPhone || '',
        ownerAddress: draft.ownerAddress || ''
      });
    }
  }

  nextStep(): void {
    if (!this.canProceedToNextStep()) return;

    // Save current step data
    this.saveCurrentStepData();

    if (this.currentStep < this.totalSteps) {
      this.currentStep++;
      this.bookingService.setCurrentStep(this.currentStep);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  previousStep(): void {
    if (this.currentStep > 1) {
      this.currentStep--;
      this.bookingService.setCurrentStep(this.currentStep);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  goToStep(step: number): void {
    if (step >= 1 && step <= this.totalSteps) {
      this.currentStep = step;
      this.bookingService.setCurrentStep(step);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  canProceedToNextStep(): boolean {
    switch (this.currentStep) {
      case 1:
        return !!this.bookingData.serviceId;
      case 2:
        return this.datesForm.valid;
      case 3:
        // Skip pet details if booking a pet ad (you're the sitter)
        if (this.serviceType === 'petAd') {
          return true;
        }
        return this.petDetailsForm.valid;
      case 4:
        return this.contactForm.valid;
      default:
        return false;
    }
  }

  saveCurrentStepData(): void {
    switch (this.currentStep) {
      case 2:
        if (this.datesForm.valid) {
          this.bookingService.updateDraft(this.datesForm.value);
        }
        break;
      case 3:
        if (this.petDetailsForm.valid) {
          this.bookingService.updateDraft(this.petDetailsForm.value);
        }
        break;
      case 4:
        if (this.contactForm.valid) {
          this.bookingService.updateDraft(this.contactForm.value);
        }
        break;
    }
  }

  async submitBooking(): Promise<void> {
    if (!this.contactForm.valid) {
      this.contactForm.markAllAsTouched();
      return;
    }

    this.isSubmitting = true;

    // Save final step data
    this.saveCurrentStepData();

    // Create booking
    const booking = this.bookingService.createBooking();

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));

    this.isSubmitting = false;

    // Navigate to confirmation page
    this.router.navigate(['/booking-confirmation', booking.id]);
  }

  cancelBooking(): void {
    if (confirm('Are you sure you want to cancel this booking? All data will be lost.')) {
      this.bookingService.clearDraft();
      this.router.navigate(['/']);
    }
  }

  getStepTitle(step: number): string {
    const titles: { [key: number]: string } = {
      1: 'booking.steps.step1',
      2: 'booking.steps.step2',
      3: 'booking.steps.step3',
      4: 'booking.steps.step4'
    };
    return titles[step] || '';
  }

  isStepCompleted(step: number): boolean {
    if (step > this.currentStep) return false;

    switch (step) {
      case 1:
        return !!this.bookingData.serviceId;
      case 2:
        return !!this.bookingData.startDate && !!this.bookingData.endDate;
      case 3:
        if (this.serviceType === 'petAd') return true;
        return !!this.bookingData.petName && !!this.bookingData.petBreed;
      case 4:
        return !!this.bookingData.ownerName && !!this.bookingData.ownerEmail;
      default:
        return false;
    }
  }

  getTodayDate(): string {
    return new Date().toISOString().split('T')[0];
  }

  getMinEndDate(): string {
    if (this.datesForm.value.startDate) {
      return this.datesForm.value.startDate;
    }
    return this.getTodayDate();
  }
}
