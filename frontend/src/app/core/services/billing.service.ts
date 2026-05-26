import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Bill } from '../../models/models';

@Injectable({
  providedIn: 'root'
})
export class BillingService {
  private http = inject(HttpClient);
  private baseUrl = '/api/billing';

  getBill(bookingId: string): Observable<Bill> {
    return this.http.get<Bill>(`${this.baseUrl}/${bookingId}`);
  }
}
