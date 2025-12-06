import { Injectable, signal, computed, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';
import { Branch } from './branch.service';
import { Barber } from './barber.service';

export interface Service {
  id: string;
  name: string;
  price: number;
  duration: number; // minutes
  description: string;
}

@Injectable({
  providedIn: 'root',
})
export class BookingService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/bookings`;

  selectedBranch = signal<Branch | null>(null);
  selectedService = signal<Service | null>(null);
  selectedDate = signal<Date | null>(null);
  selectedTime = signal<string | null>(null);
  selectedBarber = signal<Barber | null>(null);
  paymentMethod = signal<'cash' | 'paypal' | null>(null);

  // Computed signal for total price
  totalPrice = computed(() => {
    return this.selectedService()?.price || 0;
  });

  getServices(branchId?: string): Observable<Service[]> {
    let params = {};
    if (branchId) {
      params = { branchId };
    }
    return this.http.get<Service[]>(`${environment.apiUrl}/services`, { params });
  }

  createBooking(bookingData: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, bookingData);
  }

  // Helper to fetch available slots
  getAvailableSlots(date: string, barberId: string): Observable<string[]> {
    return this.http.get<string[]>(`${this.apiUrl}/slots`, {
      params: { date, barberId },
    });
  }

  reset() {
    this.selectedBranch.set(null);
    this.selectedService.set(null);
    this.selectedDate.set(null);
    this.selectedTime.set(null);
    this.selectedBarber.set(null);
    this.paymentMethod.set(null);
  }
}
