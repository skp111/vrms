import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { VehicleService } from '../../../core/services/vehicle.service';
import { Vehicle } from '../../../models/models';
import { Navbar } from '../../../shared/components/navbar/navbar';

@Component({
  selector: 'app-vehicles',
  imports: [CommonModule, Navbar],
  templateUrl: './vehicles.html',
  styleUrl: './vehicles.css'
})
export class Vehicles implements OnInit {
  vehicles: Vehicle[] = [];
  loading = true;
  error = '';
  
  private vehicleService = inject(VehicleService);
  private router = inject(Router);

  ngOnInit() {
    this.vehicleService.getAvailableVehicles().subscribe({
      next: (data) => {
        this.vehicles = data.reverse();
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Failed to load vehicles';
        this.loading = false;
      }
    });
  }

  bookVehicle(vehicleId: number) {
    this.router.navigate(['/user/book'], { queryParams: { vehicleId } });
  }
}
