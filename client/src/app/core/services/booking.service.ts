import { Injectable, signal, computed, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';
import { Branch } from './branch.service';
import { CreateBookingRequest, BookingDto } from '../models/models';

export interface Service {
  id: number;
  name: string;
  price: number;
  duration?: number; // minutes
  description?: string;
}

export interface BarberAvailability {
  barberId: number;
  firstName: string;
  lastName: string;
  phoneNumber: string;
}

@Injectable({
  providedIn: 'root',
})
export class BookingService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/booking`;

  selectedBranch = signal<Branch | null>(null);
  selectedService = signal<Service | null>(null);
  selectedDate = signal<Date | null>(null);
  selectedTime = signal<string | null>(null);
  selectedBarber = signal<BarberAvailability | null>(null);
  paymentMethod = signal<'cash' | 'paypal' | null>(null);

  // Computed signal for total price
  totalPrice = computed(() => {
    return this.selectedService()?.price || 0;
  });

  getServices(branchId?: string): Observable<Service[]> {
    // The API seems to be global for services based on the user request,
    // but typically services might be filtered by branch.
    // For now, following the user's specific request to hit /api/Service
    return this.http.get<Service[]>(`${environment.apiUrl}/Service`);
  }

  getAvailableBarbers(
    branchId: number,
    date: string,
    time: string
  ): Observable<BarberAvailability[]> {
    return this.http.get<BarberAvailability[]>(`${environment.apiUrl}/Availability/barbers`, {
      params: { branchId: branchId.toString(), date, time },
    });
  }

  createBooking(bookingData: CreateBookingRequest): Observable<BookingDto> {
    return this.http.post<BookingDto>(this.apiUrl, bookingData);
  }

  // Helper to fetch available slots
  getAvailableSlots(date: string, barberId: string): Observable<string[]> {
    return this.http.get<string[]>(`${this.apiUrl}/slots`, {
      params: { date, barberId },
    });
  }

  // Get user's bookings
  getMyBookings(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/my-bookings`);
  }

  // Get all bookings (for admin/branch manager)
  getAllBookings(branchId?: number): Observable<BookingDto[]> {
    if (branchId) {
      return this.http.get<BookingDto[]>(`${environment.apiUrl}/all/bookings/${branchId}`);
    }
    return this.http.get<BookingDto[]>(`${environment.apiUrl}/Booking`);
  }

  // Update booking status
  updateBookingStatus(id: number, status: string): Observable<any> {
    return this.http.put(`${environment.apiUrl}/Booking/${id}/status`, { status });
  }

  // Delete booking
  deleteBooking(id: number): Observable<void> {
    return this.http.delete<void>(`${environment.apiUrl}/Booking/${id}`);
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
