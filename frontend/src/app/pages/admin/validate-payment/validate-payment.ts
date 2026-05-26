import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';
import { AdminService } from '../../../core/services/admin.service';
import { Navbar } from '../../../shared/components/navbar/navbar';

@Component({
  selector: 'app-validate-payment',
  imports: [CommonModule, Navbar, RouterLink],
  templateUrl: './validate-payment.html',
  styleUrl: './validate-payment.css'
})
export class ValidatePayment implements OnInit {
  bookingId = '';
  loading = false;
  error = '';
  success = false;
  successMessage = '';

  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private adminService = inject(AdminService);

  ngOnInit() {
    this.bookingId = this.route.snapshot.paramMap.get('bookingId') || '';
  }

  validate(approve: boolean) {
    if (!this.bookingId) return;

    this.loading = true;
    this.error = '';

    this.adminService.validatePayment(this.bookingId, approve).subscribe({
      next: (payment) => {
        this.loading = false;
        this.success = true;
        this.successMessage = `Payment has been ${approve ? 'approved' : 'rejected'}.`;
        
        setTimeout(() => {
          this.router.navigate(['/admin/bookings']);
        }, 2000);
      },
      error: (err) => {
        this.loading = false;
        this.error = 'Failed to validate payment. It may not exist or is already processed.';
      }
    });
  }
}
