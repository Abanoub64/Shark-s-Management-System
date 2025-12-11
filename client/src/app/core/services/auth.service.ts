import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Observable, tap, catchError, of, map } from 'rxjs';
import { Router } from '@angular/router';

// Response from ASP.NET backend
export interface AuthResponse {
  message: string;
  isAuthenticated: boolean;
  token: string;
  refreshToken: string;
  refreshTokenExpiration: string | null;
  userId: string;
  email: string;
  fullName: string;
  roles: string[];
  managedBranchId: number | null;
}

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber?: string;
  role: 'Admin' | 'BranchManager' | 'Barber' | 'Customer';
  roles: string[];
  token?: string;
  name?: string;
  branchId?: number;
  managedBranchId?: number | null;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);
  private apiUrl = `${environment.apiUrl}/auth`;

  currentUser = signal<User | null>(null);

  constructor() {
    // Try to restore session from storage on init
    this.restoreSession();
  }

  private restoreSession() {
    const token = localStorage.getItem('token');
    const firstName = localStorage.getItem('firstName');
    const userId = localStorage.getItem('userId');
    const rolesJson = localStorage.getItem('roles');
    const email = localStorage.getItem('email');

    const managedBranchId = localStorage.getItem('managedBranchId');

    if (token && firstName && rolesJson && userId) {
      const roles = JSON.parse(rolesJson);
      this.currentUser.set({
        id: userId,
        email: email || '',
        firstName: firstName,
        lastName: '',
        role: roles[0] || 'Customer',
        roles: roles,
        token: token,
        managedBranchId: managedBranchId ? parseInt(managedBranchId) : null,
      });
    } else {
      // If essential data is missing, clear everything to avoid inconsistent state
      this.logout();
    }
  }

  login(credentials: { email: string; password: string }): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, credentials).pipe(
      tap((response) => {
        if (response.isAuthenticated) {
          // Extract firstName from fullName (first word only)
          const firstName = response.fullName?.split(' ')[0] || '';

          // Store in localStorage
          localStorage.setItem('token', response.token);
          localStorage.setItem('refreshToken', response.refreshToken);
          localStorage.setItem('firstName', firstName);
          localStorage.setItem('userId', response.userId);
          localStorage.setItem('roles', JSON.stringify(response.roles));
          localStorage.setItem('email', response.email);
          if (response.managedBranchId !== null) {
            localStorage.setItem('managedBranchId', response.managedBranchId.toString());
          }

          // Update currentUser signal
          this.currentUser.set({
            id: response.userId,
            email: response.email,
            firstName: firstName,
            lastName: response.fullName?.split(' ').slice(1).join(' ') || '',
            role: (response.roles[0] as any) || 'Customer',
            roles: response.roles,
            token: response.token,
            managedBranchId: response.managedBranchId,
          });
        }
      })
    );
  }

  register(data: {
    firstName: string;
    lastName: string;
    phoneNumber: string;
    email: string;
    password: string;
    branchId?: number;
  }): Observable<AuthResponse> {
    const payload = {
      ...data,
      role: 'Customer',
      branchId: data.branchId || 0,
    };

    return this.http.post<AuthResponse>(`${this.apiUrl}/register`, payload).pipe(
      tap((response) => {
        // Registration might not return full auth data, so handle accordingly
        if (response.isAuthenticated && response.token) {
          const firstName = response.fullName?.split(' ')[0] || data.firstName;

          localStorage.setItem('token', response.token);
          localStorage.setItem('refreshToken', response.refreshToken);
          localStorage.setItem('firstName', firstName);
          localStorage.setItem('userId', response.userId);
          localStorage.setItem('roles', JSON.stringify(response.roles));
          localStorage.setItem('email', response.email);

          this.currentUser.set({
            id: response.userId,
            email: response.email,
            firstName: firstName,
            lastName: data.lastName,
            phoneNumber: data.phoneNumber,
            role: (response.roles[0] as any) || 'Customer',
            roles: response.roles,
            token: response.token,
          });
        }
      })
    );
  }

  refreshAuthToken(token: string, refreshToken: string): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/refresh-token`, { token, refreshToken });
  }

  updateTokens(token: string, refreshToken: string) {
    localStorage.setItem('token', token);
    localStorage.setItem('refreshToken', refreshToken);

    // Update currentUser signal
    const currentUser = this.currentUser();
    if (currentUser) {
      this.currentUser.set({ ...currentUser, token });
    }
  }

  logout() {
    this.currentUser.set(null);
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('firstName');
    localStorage.removeItem('userId');
    localStorage.removeItem('roles');
    localStorage.removeItem('email');
    localStorage.removeItem('managedBranchId');
    localStorage.removeItem('barber_shop_cart');
    this.router.navigate(['/auth/login']);
  }

  // Getters
  get firstName(): string | null {
    return localStorage.getItem('firstName');
  }

  get userId(): string | null {
    return localStorage.getItem('userId');
  }

  get roles(): string[] {
    const rolesJson = localStorage.getItem('roles');
    return rolesJson ? JSON.parse(rolesJson) : [];
  }

  get token(): string | null {
    return localStorage.getItem('token');
  }

  get refreshToken(): string | null {
    return localStorage.getItem('refreshToken');
  }

  get managedBranchId(): number | null {
    const branchId = localStorage.getItem('managedBranchId');
    return branchId ? parseInt(branchId) : null;
  }

  // Role-based helpers
  get isAdmin(): boolean {
    return this.roles.includes('Admin');
  }

  get isBranchManager(): boolean {
    return this.roles.includes('BranchManager');
  }

  get isCustomer(): boolean {
    return this.roles.includes('Customer');
  }

  get isBarber(): boolean {
    return this.roles.includes('Barber');
  }

  get isAuthenticated(): boolean {
    return !!this.token;
  }

  // Legacy methods for backward compatibility
  // Legacy methods for backward compatibility
  // Google login removed

  updateProfile(data: Partial<User>): Observable<User> {
    return new Observable((observer) => {
      setTimeout(() => {
        const currentUser = this.currentUser();
        if (currentUser) {
          const updatedUser = { ...currentUser, ...data };
          this.currentUser.set(updatedUser);
          observer.next(updatedUser);
        } else {
          observer.error('No user logged in');
        }
        observer.complete();
      }, 500);
    });
  }

  changePassword(data: { currentPassword: string; newPassword: string }): Observable<any> {
    return this.http.post(`${this.apiUrl}/change-password`, data);
  }
}
