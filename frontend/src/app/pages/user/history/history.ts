import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { BookingService } from '../../../core/services/booking.service';
import { AuthService } from '../../../core/services/auth.service';
import { Booking as BookingModel } from '../../../models/models';
import { Navbar } from '../../../shared/components/navbar/navbar';

@Component({
  selector: 'app-history',
  imports: [CommonModule, RouterLink, Navbar],
  templateUrl: './history.html',
  styleUrl: './history.css'
})
export class History implements OnInit {
  bookings: BookingModel[] = [];
  loading = true;
  error = '';
  
  private bookingService = inject(BookingService);
  private authService = inject(AuthService);

  ngOnInit() {
    const userId = this.authService.currentUser()?.userId;
    if (userId) {
      this.bookingService.getBookingHistory(userId).subscribe({
        next: (data) => {
          this.bookings = data;
          this.loading = false;
        },
        error: (err) => {
          this.error = 'Failed to load booking history';
          this.loading = false;
        }
      });
    } else {
      this.error = 'User not found';
      this.loading = false;
    }
  }

  cancelBooking(bookingId: string) {
    if (confirm('Are you sure you want to cancel this booking?')) {
      this.bookingService.cancelBooking(bookingId).subscribe({
        next: () => {
          // Remove the booking entirely from the list since it's deleted from DB
          this.bookings = this.bookings.filter(b => b.bookingId !== bookingId);
        },
        error: (err) => {
          this.error = 'Failed to cancel booking. ' + (err.error || '');
        }
      });
    }
  }

  isCancellable(startDateStr: string): boolean {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const startDate = new Date(startDateStr);
    return today < startDate;
  }
}
