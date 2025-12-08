import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { JobService, Job } from '../../core/services/job.service';

@Component({
  selector: 'app-find-sitter',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './find-sitter.component.html',
  styleUrl: './find-sitter.component.scss'
})
export class FindSitterComponent implements OnInit {
  // Filter signals
  selectedServiceType = signal<string>('all');
  searchLocation = signal<string>('');

  // Available options for filters
  serviceTypes: string[] = [];
  locations: string[] = [];

  // All jobs from service
  allJobs = signal<Job[]>([]);

  // Computed filtered jobs based on filter signals
  filteredJobs = computed(() => {
    const serviceType = this.selectedServiceType();
    const location = this.searchLocation();

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

    // Sort: Favorites first, then by id
    jobs = jobs.sort((a, b) => {
      if (a.isFavorite && !b.isFavorite) return -1;
      if (!a.isFavorite && b.isFavorite) return 1;
      return a.id - b.id;
    });

    return jobs;
  });

  // Track view mode (grid or list)
  viewMode = signal<'grid' | 'list'>('grid');

  constructor(
    private jobService: JobService,
    private router: Router
  ) {}

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
    return count;
  }
}
