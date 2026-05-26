import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { PaymentService } from '../../../core/services/payment.service';
import { BookingService } from '../../../core/services/booking.service';
import { Payment as PaymentModel } from '../../../models/models';
import { Navbar } from '../../../shared/components/navbar/navbar';

@Component({
  selector: 'app-payment',
  imports: [CommonModule, RouterLink, Navbar, FormsModule],
  templateUrl: './payment.html',
  styleUrl: './payment.css'
})
export class Payment implements OnInit {
  bookingId = '';
  payment: PaymentModel | null = null;
  loading = true;
  error = '';
  success = '';

  // Payment Form fields
  paymentMethod = 'upi';
  upiId = '';
  cardNumber = '';
  cardExpiry = '';
  cardCvv = '';
  adminContact = '';

  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private paymentService = inject(PaymentService);
  private bookingService = inject(BookingService);

  ngOnInit() {
    this.bookingId = this.route.snapshot.paramMap.get('bookingId') || '';
    if (this.bookingId) {
      this.checkStatus();
    }
    this.paymentService.getAdminContact().subscribe({
      next: (res) => this.adminContact = res.mobile,
      error: () => this.adminContact = 'Not Assigned'
    });
  }

  checkStatus() {
    this.loading = true;
    this.paymentService.getPaymentDetails(this.bookingId).subscribe({
      next: (data) => {
        this.payment = data;
        this.loading = false;
      },
      error: () => {
        // Payment doesn't exist yet, so we request it (creates PENDING state in DB)
        this.paymentService.requestPayment(this.bookingId).subscribe({
          next: () => {
            // Now fetch it again to get the amount
            this.paymentService.getPaymentDetails(this.bookingId).subscribe(data => {
              this.payment = data;
              this.loading = false;
            });
          },
          error: () => {
            this.error = 'Failed to initialize payment.';
            this.loading = false;
          }
        });
      }
    });
  }

  processPayment() {
    if (this.paymentMethod === 'card') {
      if (!this.cardNumber || !this.cardExpiry || !this.cardCvv) {
        this.error = 'All card fields are required.';
        return;
      }
      
      const cardNumberRegex = /^\d{16}$/;
      if (!cardNumberRegex.test(this.cardNumber.replace(/\s/g, ''))) {
        this.error = 'Card number must be exactly 16 digits.';
        return;
      }

      const expiryRegex = /^(0[1-9]|1[0-2])\/\d{2}$/;
      if (!expiryRegex.test(this.cardExpiry)) {
        this.error = 'Expiry date must be in MM/YY format.';
        return;
      }

      const cvvRegex = /^\d{3}$/;
      if (!cvvRegex.test(this.cardCvv)) {
        this.error = 'CVV must be exactly 3 digits.';
        return;
      }
    }

    this.loading = true;
    this.error = '';
    this.paymentService.processPayment(this.bookingId).subscribe({
      next: (data) => {
        this.payment = data;
        this.loading = false;
        this.success = 'Payment Successful! Redirecting...';
        setTimeout(() => {
          this.router.navigate(['/user/history']);
        }, 2000);
      },
      error: (err) => {
        this.loading = false;
        this.error = 'Failed to process payment. ' + (err.error?.message || '');
      }
    });
  }
}
