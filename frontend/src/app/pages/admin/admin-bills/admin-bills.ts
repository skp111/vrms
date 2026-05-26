import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Navbar } from '../../../shared/components/navbar/navbar';
import { AdminService } from '../../../core/services/admin.service';
import { AuthService } from '../../../core/services/auth.service';
import { Bill } from '../../../models/models';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-admin-bills',
  imports: [CommonModule, Navbar, RouterLink],
  templateUrl: './admin-bills.html',
  styleUrl: './admin-bills.css'
})
export class AdminBills implements OnInit {
  bills: Bill[] = [];
  loading = true;
  error = '';
  
  private adminService = inject(AdminService);
  private authService = inject(AuthService);

  ngOnInit() {
    this.loadBills();
  }

  loadBills() {
    this.loading = true;
    const adminId = this.authService.currentUser()?.userId;
    if (adminId) {
      this.adminService.getAllBillsByAdmin(adminId).subscribe({
        next: (data) => {
          this.bills = data;
          this.loading = false;
        },
        error: (err) => {
          console.error('Failed to load bills', err);
          this.error = 'Failed to load generated bills.';
          this.loading = false;
        }
      });
    } else {
      this.loading = false;
    }
  }
}
