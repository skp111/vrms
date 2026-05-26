import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Booking, BookingRequest } from '../../models/models';

@Injectable({
  providedIn: 'root'
})
export class BookingService {
  private http = inject(HttpClient);
  private baseUrl = '/api/bookings';

  createBooking(request: BookingRequest): Observable<Booking> {
    return this.http.post<Booking>(this.baseUrl, request);
  }

  getBookingHistory(userId: number): Observable<Booking[]> {
    return this.http.get<Booking[]>(`${this.baseUrl}/history/${userId}`);
  }

  cancelBooking(bookingId: string): Observable<string> {
    return this.http.put(`${this.baseUrl}/${bookingId}/cancel`, {}, { responseType: 'text' });
  }

  getBookingById(bookingId: string): Observable<Booking> {
    return this.http.get<Booking>(`${this.baseUrl}/${bookingId}`);
  }
}
