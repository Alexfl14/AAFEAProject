import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
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
}
