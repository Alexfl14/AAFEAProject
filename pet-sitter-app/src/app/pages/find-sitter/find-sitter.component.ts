import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { JobService, Job } from '../../core/services/job.service';

@Component({
  selector: 'app-find-sitter',
  standalone: true,
  imports: [CommonModule, FormsModule, TranslateModule],
  templateUrl: './find-sitter.component.html',
  styleUrl: './find-sitter.component.scss'
})
export class FindSitterComponent implements OnInit {
  // Filter signals
  selectedServiceType = signal<string>('all');
  searchLocation = signal<string>('');
  minPrice = signal<number>(0);
  maxPrice = signal<number>(200);
  priceRangeMin = signal<number>(0);
  priceRangeMax = signal<number>(200);

  // Available options for filters
  serviceTypes: string[] = [];
  locations: string[] = [];

  // All jobs from service
  allJobs = signal<Job[]>([]);

  // Computed filtered jobs based on filter signals
  filteredJobs = computed(() => {
    const serviceType = this.selectedServiceType();
    const location = this.searchLocation();
    const min = this.minPrice();
    const max = this.maxPrice();

    let jobs = this.allJobs();

    // Filter by service type
    if (serviceType !== 'all') {
      jobs = jobs.filter(job => job.serviceType === serviceType);
    }

    // Filter by location
    if (location.trim() !== '') {
      const searchTerm = location.toLowerCase().trim();
      jobs = jobs.filter(job =>
        job.location.toLowerCase().includes(searchTerm)
      );
    }

    // Filter by price range
    jobs = jobs.filter(job => job.price >= min && job.price <= max);

    // Sort: Favorites first, then by id
    jobs = jobs.sort((a, b) => {
      if (a.isFavorite && !b.isFavorite) return -1;
      if (!a.isFavorite && b.isFavorite) return 1;
      return b.id - a.id;
    });

    return jobs;
  });

  // Track view mode (grid or list)
  viewMode = signal<'grid' | 'list'>('grid');

  constructor(
    private jobService: JobService,
    private router: Router
  ) { }

  ngOnInit(): void {
    // Load all jobs
    this.loadJobs();

    // Get filter options
    this.serviceTypes = this.jobService.getServiceTypes();
    this.locations = this.jobService.getLocations();
  }

  /**
   * Load jobs from service
   */
  loadJobs(): void {
    const jobs = this.jobService.getJobs();
    this.allJobs.set(jobs);
    this.calculatePriceRange();
  }

  /**
   * Calculate price range from all jobs
   */
  calculatePriceRange(): void {
    const jobs = this.allJobs();
    if (jobs.length > 0) {
      const prices = jobs.map(job => job.price);
      const min = Math.min(...prices);
      const max = Math.max(...prices);
      this.priceRangeMin.set(min);
      this.priceRangeMax.set(max);
      this.minPrice.set(min);
      this.maxPrice.set(max);
    }
  }

  /**
   * Handle service type filter change
   */
  onServiceTypeChange(serviceType: string): void {
    this.selectedServiceType.set(serviceType);
  }

  /**
   * Handle location search input
   */
  onLocationSearch(location: string): void {
    this.searchLocation.set(location);
  }

  /**
   * Clear all filters
   */
  clearFilters(): void {
    this.selectedServiceType.set('all');
    this.searchLocation.set('');
    this.minPrice.set(this.priceRangeMin());
    this.maxPrice.set(this.priceRangeMax());
  }

  /**
   * Handle min price change
   */
  onMinPriceChange(value: number): void {
    if (value > this.maxPrice()) {
      this.minPrice.set(this.maxPrice());
    } else {
      this.minPrice.set(value);
    }
  }

  /**
   * Handle max price change
   */
  onMaxPriceChange(value: number): void {
    if (value < this.minPrice()) {
      this.maxPrice.set(this.minPrice());
    } else {
      this.maxPrice.set(value);
    }
  }

  /**
   * Navigate to job details page
   */
  viewJobDetails(jobId: number): void {
    this.router.navigate(['/job-details', jobId]);
  }

  /**
   * Toggle favorite status for a job
   */
  toggleFavorite(event: Event, jobId: number): void {
    // Prevent card click event from firing
    event.stopPropagation();

    // Toggle favorite in service (persists to localStorage)
    this.jobService.toggleFavorite(jobId);

    // Reload jobs to reflect the change
    this.loadJobs();
  }

  /**
   * Check if a job is favorited
   */
  isFavorite(jobId: number): boolean {
    const job = this.allJobs().find(j => j.id === jobId);
    return job?.isFavorite || false;
  }

  /**
   * Toggle view mode
   */
  toggleViewMode(): void {
    this.viewMode.set(this.viewMode() === 'grid' ? 'list' : 'grid');
  }

  /**
   * Get count of active filters
   */
  getActiveFiltersCount(): number {
    let count = 0;
    if (this.selectedServiceType() !== 'all') count++;
    if (this.searchLocation().trim() !== '') count++;
    if (this.minPrice() !== this.priceRangeMin() || this.maxPrice() !== this.priceRangeMax()) count++;
    return count;
  }
}
