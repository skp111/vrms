import { inject, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';
import { AuthResponse, LoginRequest, RegisterRequest, User } from '../../models/models';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);
  private baseUrl = '/api/auth';

  // Signals for state management
  currentUser = signal<AuthResponse | null>(null);
  userRole = signal<'USER' | 'ADMIN' | null>(null);

  constructor() {
    this.loadToken();
  }

  private loadToken() {
    if (typeof window !== 'undefined') {
      const token = sessionStorage.getItem('token');
      const userId = sessionStorage.getItem('userId');
      const email = sessionStorage.getItem('email');
      const role = sessionStorage.getItem('role') as 'USER' | 'ADMIN';
      
      if (token && userId && email) {
        this.currentUser.set({ userId: +userId, email, token });
        this.userRole.set(role);
      }
    }
  }

  register(data: RegisterRequest): Observable<string> {
    return this.http.post(`${this.baseUrl}/register`, data, { responseType: 'text' });
  }

  login(data: LoginRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.baseUrl}/login`, data).pipe(
      tap(res => {
        if (typeof window !== 'undefined') {
          sessionStorage.setItem('token', res.token);
          sessionStorage.setItem('userId', res.userId.toString());
          sessionStorage.setItem('email', res.email);
          this.currentUser.set(res);
        }
      })
    );
  }

  fetchUserDetails(id: number): Observable<User> {
    return this.http.get<User>(`${this.baseUrl}/${id}`).pipe(
      tap(user => {
        if (typeof window !== 'undefined') {
          sessionStorage.setItem('role', user.role);
          this.userRole.set(user.role);
        }
      })
    );
  }

  forgotPassword(data: any): Observable<string> {
    return this.http.post(`${this.baseUrl}/forgot-password`, data, { responseType: 'text' });
  }

  logout() {
    if (typeof window !== 'undefined') {
      sessionStorage.removeItem('token');
      sessionStorage.removeItem('userId');
      sessionStorage.removeItem('email');
      sessionStorage.removeItem('role');
    }
    this.currentUser.set(null);
    this.userRole.set(null);
    // Explicitly navigate to login page on logout
    this.router.navigate(['/login']);
  }

  isLoggedIn(): boolean {
    return this.currentUser() !== null;
  }
}
