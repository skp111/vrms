import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Payment } from '../../models/models';

@Injectable({
  providedIn: 'root'
})
export class PaymentService {
  private http = inject(HttpClient);
  private baseUrl = '/api/payment';

  requestPayment(bookingId: string): Observable<string> {
    return this.http.post(`${this.baseUrl}/request/${bookingId}`, {}, { responseType: 'text' });
  }

  getPaymentDetails(bookingId: string): Observable<Payment> {
    return this.http.get<Payment>(`${this.baseUrl}/${bookingId}`);
  }

  processPayment(bookingId: string): Observable<Payment> {
    return this.http.post<Payment>(`${this.baseUrl}/process/${bookingId}`, {});
  }

  getAdminContact(): Observable<{ mobile: string }> {
    return this.http.get<{ mobile: string }>(`${this.baseUrl}/admin-contact`);
  }
}
