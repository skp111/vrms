import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { roleGuard } from './core/guards/role.guard';
import { guestGuard } from './core/guards/guest.guard';

import { Landing } from './pages/landing/landing';
import { Login } from './pages/auth/login/login';
import { Register } from './pages/auth/register/register';

import { UserHome } from './pages/user/user-home/user-home';
import { Vehicles } from './pages/user/vehicles/vehicles';
import { Booking } from './pages/user/booking/booking';
import { History } from './pages/user/history/history';
import { Bill } from './pages/user/bill/bill';
import { Payment } from './pages/user/payment/payment';

import { AdminHome } from './pages/admin/admin-home/admin-home';
import { ManageVehicles } from './pages/admin/manage-vehicles/manage-vehicles';
import { ManageBookings } from './pages/admin/manage-bookings/manage-bookings';
import { GenerateBill } from './pages/admin/generate-bill/generate-bill';
import { ValidatePayment } from './pages/admin/validate-payment/validate-payment';

export const routes: Routes = [
  { path: '', component: Landing, canActivate: [guestGuard] },
  { path: 'login', component: Login, canActivate: [guestGuard] },
  { path: 'register', component: Register, canActivate: [guestGuard] },
  { path: 'forgot-password', loadComponent: () => import('./pages/auth/forgot-password/forgot-password').then(m => m.ForgotPassword), canActivate: [guestGuard] },
  
  // USER Routes
  { path: 'profile', loadComponent: () => import('./pages/profile/profile').then(m => m.Profile), canActivate: [authGuard] },
  { 
    path: 'user/home', 
    component: UserHome, 
    canActivate: [authGuard, roleGuard], 
    data: { role: 'USER' } 
  },
  { 
    path: 'user/vehicles', 
    component: Vehicles, 
    canActivate: [authGuard, roleGuard], 
    data: { role: 'USER' } 
  },
  { 
    path: 'user/book', 
    component: Booking, 
    canActivate: [authGuard, roleGuard], 
    data: { role: 'USER' } 
  },
  { 
    path: 'user/history', 
    component: History, 
    canActivate: [authGuard, roleGuard], 
    data: { role: 'USER' } 
  },
  { 
    path: 'user/bill/:bookingId', 
    component: Bill, 
    canActivate: [authGuard, roleGuard], 
    data: { role: 'USER' } 
  },
  { 
    path: 'user/payment/:bookingId', 
    component: Payment, 
    canActivate: [authGuard, roleGuard], 
    data: { role: 'USER' } 
  },

  // ADMIN Routes
  { 
    path: 'admin/home', 
    component: AdminHome, 
    canActivate: [authGuard, roleGuard], 
    data: { role: 'ADMIN' } 
  },
  { 
    path: 'admin/vehicles', 
    component: ManageVehicles, 
    canActivate: [authGuard, roleGuard], 
    data: { role: 'ADMIN' } 
  },
  { 
    path: 'admin/bookings', 
    component: ManageBookings, 
    canActivate: [authGuard, roleGuard], 
    data: { role: 'ADMIN' } 
  },
  { 
    path: 'admin/bill/:bookingId', 
    component: GenerateBill, 
    canActivate: [authGuard, roleGuard], 
    data: { role: 'ADMIN' } 
  },
  { 
    path: 'admin/payment/:bookingId', 
    component: ValidatePayment, 
    canActivate: [authGuard, roleGuard], 
    data: { role: 'ADMIN' } 
  },
  {
    path: 'admin/bills',
    loadComponent: () => import('./pages/admin/admin-bills/admin-bills').then(m => m.AdminBills),
    canActivate: [authGuard, roleGuard],
    data: { role: 'ADMIN' }
  },

  // Fallback
  { 
    path: '**', 
    loadComponent: () => import('./pages/not-found/not-found').then(m => m.NotFound)
  }
];
