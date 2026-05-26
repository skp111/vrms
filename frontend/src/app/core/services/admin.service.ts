import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Bill, Payment } from '../../models/models';

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  private http = inject(HttpClient);
  private baseUrl = '/api/admin';

  generateBill(bookingId: string): Observable<Bill> {
    return this.http.post<Bill>(`${this.baseUrl}/generate-bill/${bookingId}`, {});
  }

  validatePayment(bookingId: string, approve: boolean): Observable<any> {
    return this.http.put(`${this.baseUrl}/validate-payment/${bookingId}?approve=${approve}`, {});
  }

  approveBooking(bookingId: string): Observable<any> {
    return this.http.put(`${this.baseUrl}/approve/${bookingId}`, {});
  }

  rejectBooking(bookingId: string): Observable<any> {
    return this.http.put(`${this.baseUrl}/reject/${bookingId}`, {});
  }

  getAllBillsByAdmin(adminId: number): Observable<Bill[]> {
    return this.http.get<Bill[]>(`/api/billing/admin/${adminId}`);
  }
}
