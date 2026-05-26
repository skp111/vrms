import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AdminService } from '../../../core/services/admin.service';
import { BookingService } from '../../../core/services/booking.service';
import { Navbar } from '../../../shared/components/navbar/navbar';

@Component({
  selector: 'app-generate-bill',
  imports: [CommonModule, FormsModule, Navbar, RouterLink],
  templateUrl: './generate-bill.html',
  styleUrl: './generate-bill.css'
})
export class GenerateBill implements OnInit {
  bookingId = '';
  
  loading = false;
  error = '';
  success = false;

  booking: any = null;

  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private adminService = inject(AdminService);
  private bookingService = inject(BookingService);

  ngOnInit() {
    this.bookingId = this.route.snapshot.paramMap.get('bookingId') || '';
    if (this.bookingId) {
      this.bookingService.getBookingById(this.bookingId).subscribe({
        next: (data) => this.booking = data,
        error: (err) => console.error('Failed to load booking details', err)
      });
    }
  }

  generateBill() {
    if (!this.bookingId) return;

    this.loading = true;
    this.error = '';

    this.adminService.generateBill(this.bookingId).subscribe({
      next: () => {
        this.loading = false;
        this.success = true;
        setTimeout(() => {
          this.router.navigate(['/admin/bookings']);
        }, 2000);
      },
      error: (err) => {
        this.loading = false;
        let backendMsg = '';
        try {
          if (typeof err.error === 'string') {
            const parsed = JSON.parse(err.error);
            backendMsg = parsed.message || parsed.error;
          } else {
            backendMsg = err.error?.message || err.error?.error;
          }
        } catch (e) {
          backendMsg = err.error;
        }
        this.error = backendMsg || err.message || 'Failed to generate bill.';
        console.error(err);
      }
    });
  }
}
