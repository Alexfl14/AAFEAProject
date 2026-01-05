import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface BookingData {
  // Step 1: Service Selection
  serviceId?: number;
  serviceType?: 'sitter' | 'petAd';
  serviceName?: string;
  servicePrice?: number;

  // Step 2: Dates & Details
  startDate?: string;
  endDate?: string;
  totalDays?: number;
  specialRequests?: string;

  // Step 3: Pet Details (if booking a sitter)
  petName?: string;
  petType?: 'dog' | 'cat' | 'other';
  petBreed?: string;
  petAge?: number;
  petSpecialNeeds?: string;

  // Step 4: Contact Information
  ownerName?: string;
  ownerEmail?: string;
  ownerPhone?: string;
  ownerAddress?: string;

  // Calculated fields
  totalPrice?: number;
  currentStep?: number;
}

export interface Booking extends BookingData {
  id: number;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  createdAt: string;
}

@Injectable({
  providedIn: 'root'
})
export class BookingService {
  private readonly STORAGE_KEY = 'bookings';
  private readonly DRAFT_KEY = 'bookingDraft';

  private bookingDraftSubject = new BehaviorSubject<BookingData>(this.loadDraft());
  public bookingDraft$ = this.bookingDraftSubject.asObservable();

  private bookingsSubject = new BehaviorSubject<Booking[]>(this.loadBookings());
  public bookings$ = this.bookingsSubject.asObservable();

  constructor() {}

  /**
   * Get current booking draft
   */
  getDraft(): BookingData {
    return this.bookingDraftSubject.value;
  }

  /**
   * Update booking draft
   */
  updateDraft(data: Partial<BookingData>): void {
    const currentDraft = this.bookingDraftSubject.value;
    const updatedDraft = { ...currentDraft, ...data };

    // Calculate total days if dates are provided
    if (updatedDraft.startDate && updatedDraft.endDate) {
      const start = new Date(updatedDraft.startDate);
      const end = new Date(updatedDraft.endDate);
      const diffTime = Math.abs(end.getTime() - start.getTime());
      updatedDraft.totalDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
    }

    // Calculate total price
    if (updatedDraft.servicePrice && updatedDraft.totalDays) {
      updatedDraft.totalPrice = updatedDraft.servicePrice * updatedDraft.totalDays;
    }

    this.bookingDraftSubject.next(updatedDraft);
    this.saveDraft(updatedDraft);
  }

  /**
   * Clear booking draft
   */
  clearDraft(): void {
    const emptyDraft: BookingData = { currentStep: 1 };
    this.bookingDraftSubject.next(emptyDraft);
    localStorage.removeItem(this.DRAFT_KEY);
  }

  /**
   * Create a new booking from draft
   */
  createBooking(): Booking {
    const draft = this.bookingDraftSubject.value;
    const newBooking: Booking = {
      ...draft,
      id: Date.now(),
      status: 'pending',
      createdAt: new Date().toISOString()
    };

    const bookings = this.bookingsSubject.value;
    const updatedBookings = [newBooking, ...bookings];
    this.bookingsSubject.next(updatedBookings);
    this.saveBookings(updatedBookings);

    // Clear draft after creating booking
    this.clearDraft();

    return newBooking;
  }

  /**
   * Get all bookings
   */
  getBookings(): Booking[] {
    return this.bookingsSubject.value;
  }

  /**
   * Get booking by ID
   */
  getBookingById(id: number): Booking | undefined {
    return this.bookingsSubject.value.find(b => b.id === id);
  }

  /**
   * Update booking status
   */
  updateBookingStatus(id: number, status: Booking['status']): void {
    const bookings = this.bookingsSubject.value;
    const updatedBookings = bookings.map(booking =>
      booking.id === id ? { ...booking, status } : booking
    );
    this.bookingsSubject.next(updatedBookings);
    this.saveBookings(updatedBookings);
  }

  /**
   * Cancel booking
   */
  cancelBooking(id: number): void {
    this.updateBookingStatus(id, 'cancelled');
  }

  /**
   * Set current step
   */
  setCurrentStep(step: number): void {
    this.updateDraft({ currentStep: step });
  }

  /**
   * Get current step
   */
  getCurrentStep(): number {
    return this.bookingDraftSubject.value.currentStep || 1;
  }

  /**
   * Initialize booking with service details
   */
  initializeBooking(serviceId: number, serviceType: 'sitter' | 'petAd', serviceName: string, servicePrice: number): void {
    this.clearDraft();
    this.updateDraft({
      serviceId,
      serviceType,
      serviceName,
      servicePrice,
      currentStep: 1
    });
  }

  // Private methods

  private loadDraft(): BookingData {
    const stored = localStorage.getItem(this.DRAFT_KEY);
    return stored ? JSON.parse(stored) : { currentStep: 1 };
  }

  private saveDraft(draft: BookingData): void {
    localStorage.setItem(this.DRAFT_KEY, JSON.stringify(draft));
  }

  private loadBookings(): Booking[] {
    const stored = localStorage.getItem(this.STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  }

  private saveBookings(bookings: Booking[]): void {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(bookings));
  }
}
