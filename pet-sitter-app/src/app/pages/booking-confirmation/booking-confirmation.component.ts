import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-booking-confirmation',
  standalone: true,
  imports: [CommonModule, RouterModule, TranslateModule],
  templateUrl: './booking-confirmation.component.html',
  styleUrl: './booking-confirmation.component.scss'
})
export class BookingConfirmationComponent implements OnInit {
  private route = inject(ActivatedRoute);

  bookingId: string = '';

  ngOnInit(): void {
    this.bookingId = this.route.snapshot.paramMap.get('id') || '';
  }
}
