export interface AuthResponse {
  userId: number;
  email: string;
  token: string;
}

export interface User {
  id: number;
  fullName: string;
  email: string;
  mobile: string;
  address: string;
  licenseNumber: string;
  role: 'USER' | 'ADMIN';
}

export interface Vehicle {
  id: number;
  adminId: number;
  type: string;       // Car, Bike, SUV
  brand: string;      // Toyota, Honda
  model: string;      // Innova, City
  registrationNumber: string;
  pricePerDay: number;
  description: string;
  imageBase64?: string;
  available: boolean;
}

export interface Booking {
  bookingId: string;
  userId: number;
  userName?: string;
  userMobile?: string;
  vehicleId: number;
  vehicleDetails?: string;
  startDate: string;
  endDate: string;
  totalAmount: number;
  status: string;
  billStatus: string;
}

export interface Bill {
  id: number;
  bookingId: string;
  finalAmount: number;
  userName?: string;
  userMobile?: string;
  vehicleDetails?: string;
  paymentStatus?: string;
}

export interface Payment {
  id: number;
  bookingId: string;
  amount: number;
  status: string;       // PENDING -> SUCCESS / REJECTED
  transactionId: string;
}

export interface LoginRequest {
  email?: string;
  password?: string;
}

export interface RegisterRequest {
  name?: string;
  email?: string;
  password?: string;
  mobile?: string;
  address?: string;
  licenseNumber?: string;
  role?: string;
}

export interface BookingRequest {
  userId?: number;
  vehicleId?: number;
  startDate?: string;
  endDate?: string;
}
