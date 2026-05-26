import { Component, inject, OnInit } from '@angular/core';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BookingService } from '../../../core/services/booking.service';
import { VehicleService } from '../../../core/services/vehicle.service';
import { AuthService } from '../../../core/services/auth.service';
import { Vehicle } from '../../../models/models';
import { Navbar } from '../../../shared/components/navbar/navbar';

@Component({
  selector: 'app-booking',
  imports: [CommonModule, FormsModule, Navbar, RouterLink],
  templateUrl: './booking.html',
  styleUrl: './booking.css'
})
export class Booking implements OnInit {
  vehicleId: number | null = null;
  vehicle: Vehicle | null = null;
  startDate: string = '';
  endDate: string = '';
  today: string = new Date().toISOString().split('T')[0];
  
  loading = false;
  error = '';
  
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private vehicleService = inject(VehicleService);
  private bookingService = inject(BookingService);
  private authService = inject(AuthService);

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      if (params['vehicleId']) {
        this.vehicleId = +params['vehicleId'];
        this.loadVehicle(this.vehicleId);
      }
    });
  }

  loadVehicle(id: number) {
    this.vehicleService.getVehicle(id).subscribe({
      next: (v) => this.vehicle = v,
      error: () => this.error = 'Vehicle not found'
    });
  }

  calculateTotal(): number {
    if (!this.startDate || !this.endDate || !this.vehicle) return 0;
    
    const start = new Date(this.startDate);
    const end = new Date(this.endDate);
    
    if (end < start) return 0;
    
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1; // Inclusive of start day
    
    return diffDays * this.vehicle.pricePerDay;
  }

  onSubmit() {
    if (!this.startDate || !this.endDate || !this.vehicleId) {
      this.error = 'Please select valid dates';
      return;
    }

    const userId = this.authService.currentUser()?.userId;
    if (!userId) {
      this.error = 'User not found. Please log in again.';
      return;
    }

    this.loading = true;
    this.error = '';

    this.bookingService.createBooking({
      userId,
      vehicleId: this.vehicleId,
      startDate: this.startDate,
      endDate: this.endDate
    }).subscribe({
      next: (booking) => {
        this.loading = false;
        this.router.navigate(['/user/history']);
      },
      error: (err) => {
        this.loading = false;
        this.error = 'Failed to create booking. Dates might overlap or vehicle is unavailable.';
        console.error(err);
      }
    });
  }
}
