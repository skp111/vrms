import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { VehicleService } from '../../../core/services/vehicle.service';
import { AuthService } from '../../../core/services/auth.service';
import { Vehicle } from '../../../models/models';
import { Navbar } from '../../../shared/components/navbar/navbar';

@Component({
  selector: 'app-manage-vehicles',
  imports: [CommonModule, FormsModule, Navbar],
  templateUrl: './manage-vehicles.html',
  styleUrl: './manage-vehicles.css'
})
export class ManageVehicles implements OnInit {
  vehicles: Vehicle[] = [];
  loading = true;
  error = '';
  
  formMode: 'ADD' | 'EDIT' = 'ADD';
  showForm = false;
  
  formData: Partial<Vehicle> = {
    type: 'Car',
    brand: '',
    model: '',
    registrationNumber: '',
    pricePerDay: 1000,
    available: true,
    adminId: undefined
  };
  
  private vehicleService = inject(VehicleService);
  private authService = inject(AuthService);

  ngOnInit() {
    this.loadVehicles();
  }

  loadVehicles() {
    this.loading = true;
    const adminId = this.authService.currentUser()?.userId;
    if (!adminId) return;

    this.vehicleService.getVehiclesByAdmin(adminId).subscribe({
      next: (data) => {
        this.vehicles = data.reverse();
        this.loading = false;
      },
      error: () => {
        this.error = 'Failed to load vehicles';
        this.loading = false;
      }
    });
  }

  openAddForm() {
    this.formMode = 'ADD';
    this.error = '';
    const adminId = this.authService.currentUser()?.userId;
    this.formData = {
      type: 'Car',
      brand: '',
      model: '',
      registrationNumber: '',
      pricePerDay: 1000,
      available: true,
      adminId: adminId
    };
    this.showForm = true;
  }

  openEditForm(vehicle: Vehicle) {
    this.formMode = 'EDIT';
    this.error = '';
    this.formData = { ...vehicle };
    this.showForm = true;
  }

  closeForm() {
    this.showForm = false;
    this.error = '';
  }

  private extractErrorMessage(err: any, defaultMsg: string): string {
    try {
      let parsed = err.error;
      if (typeof parsed === 'string') {
        parsed = JSON.parse(parsed);
      }
      if (parsed && typeof parsed === 'object') {
        if (parsed.trace && typeof parsed.trace === 'string') {
          const match = parsed.trace.match(/ResponseStatusException:\s*\d+\s*[A-Z_]+\s*"(.*?)"/);
          if (match && match[1]) {
            return match[1];
          }
          const traceLines = parsed.trace.split('\n');
          if (traceLines.length > 0) {
            return traceLines[0];
          }
        }
        return parsed.message || parsed.error || defaultMsg;
      }
    } catch (e) {}
    
    return err.error?.message || err.error || err.message || defaultMsg;
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.formData.imageBase64 = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  }

  submitForm() {
    this.error = '';

    if (!this.formData.brand || !this.formData.model || !this.formData.registrationNumber || !this.formData.pricePerDay || !this.formData.type) {
      this.error = 'All fields are mandatory';
      return;
    }

    this.formData.brand = this.formData.brand.trim();
    this.formData.type = this.formData.type.trim();
    this.formData.model = this.formData.model.trim();

    if (this.formData.brand.length < 3) {
      this.error = 'Brand must be at least 3 characters long';
      return;
    }

    if (this.formData.type.length < 3) {
      this.error = 'Type must be at least 3 characters long';
      return;
    }

    if (this.formData.model.length < 3) {
      this.error = 'Model must be at least 3 characters long';
      return;
    }

    this.formData.registrationNumber = this.formData.registrationNumber.toUpperCase();

    const regRegex = /^[A-Z]{2}-\d{2}-[A-Z]{2}-\d{4}$/;
    if (!regRegex.test(this.formData.registrationNumber)) {
      this.error = 'Registration Number must follow the format SS-NN-AA-NNNN (e.g., MH-12-AB-1234)';
      return;
    }

    if (this.formMode === 'ADD') {
      this.vehicleService.createVehicle(this.formData).subscribe({
        next: () => {
          this.closeForm();
          this.loadVehicles();
        },
        error: (err) => {
          this.error = this.extractErrorMessage(err, 'Failed to create vehicle.');
          console.error(err);
        }
      });
    } else if (this.formData.id) {
      this.vehicleService.updateVehicle(this.formData.id, this.formData).subscribe({
        next: () => {
          this.closeForm();
          this.loadVehicles();
        },
        error: (err) => {
          this.error = this.extractErrorMessage(err, 'Failed to update vehicle.');
          console.error(err);
        }
      });
    }
  }

  deleteVehicle(id: number) {
    if (confirm('Are you sure you want to delete this vehicle?')) {
      this.vehicleService.deleteVehicle(id).subscribe({
        next: () => this.loadVehicles(),
        error: (err) => {
          alert(this.extractErrorMessage(err, 'Failed to delete vehicle.'));
        }
      });
    }
  }
}
