import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';
import { BillingService } from '../../../core/services/billing.service';
import { PaymentService } from '../../../core/services/payment.service';
import { Bill as BillModel } from '../../../models/models';
import { Navbar } from '../../../shared/components/navbar/navbar';

@Component({
  selector: 'app-bill',
  imports: [CommonModule, RouterLink, Navbar],
  templateUrl: './bill.html',
  styleUrl: './bill.css'
})
export class Bill implements OnInit {
  bookingId = '';
  bill: BillModel | null = null;
  loading = true;
  error = '';
  requestingPayment = false;
  paymentRequested = false;

  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private billingService = inject(BillingService);
  private paymentService = inject(PaymentService);

  ngOnInit() {
    this.bookingId = this.route.snapshot.paramMap.get('bookingId') || '';
    if (this.bookingId) {
      this.billingService.getBill(this.bookingId).subscribe({
        next: (data) => {
          this.bill = data;
          this.loading = false;
          
          // Check if payment already requested/exists
          this.paymentService.getPaymentDetails(this.bookingId).subscribe({
            next: (payment) => {
              this.paymentRequested = true;
            },
            error: () => {} // Payment doesn't exist yet, which is fine
          });
        },
        error: () => {
          this.error = 'Failed to load bill. Admin might not have generated it yet.';
          this.loading = false;
        }
      });
    }
  }

  proceedToPayment() {
    this.requestingPayment = true;
    this.paymentService.requestPayment(this.bookingId).subscribe({
      next: () => {
        this.requestingPayment = false;
        this.router.navigate(['/user/payment', this.bookingId]);
      },
      error: (err) => {
        this.requestingPayment = false;
        // If it says already requested, just navigate
        this.router.navigate(['/user/payment', this.bookingId]);
      }
    });
  }
}
