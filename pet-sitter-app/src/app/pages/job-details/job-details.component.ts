import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { Job, JobService } from '../../core/services/job.service';

@Component({
  selector: 'app-job-details',
  standalone: true,
  imports: [CommonModule, RouterModule, TranslateModule],
  templateUrl: './job-details.component.html',
  styleUrl: './job-details.component.scss'
})
export class JobDetailsComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private jobService = inject(JobService);

  job: Job | undefined;

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      // Get ID from route or default to 1
      const id = Number(params.get('id')) || 1;
      this.jobService.getJobById(id).subscribe(data => {
        if (data) {
          this.job = data;
        }
      });
    });
  }

  contactSitter(): void {
    if (!this.job) return;

    const subject = encodeURIComponent(`Inquiry about ${this.job.title}`);
    const body = encodeURIComponent(
      `Hello ${this.job.name},\n\n` +
      `I am interested in your pet sitting service: ${this.job.title}\n\n` +
      `Service type: ${this.job.serviceType}\n` +
      `Location: ${this.job.location}\n` +
      `Price: ${this.job.price} ${this.job.currency}/hour\n\n` +
      `Please let me know your availability.\n\n` +
      `Best regards`
    );

    window.location.href = `mailto:${this.job.email}?subject=${subject}&body=${body}`;
  }

  bookNow(): void {
    if (!this.job) return;
    this.router.navigate(['/booking'], {
      queryParams: {
        serviceId: this.job.id,
        type: 'sitter'
      }
    });
  }
}
