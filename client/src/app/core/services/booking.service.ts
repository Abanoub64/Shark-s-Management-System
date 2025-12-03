import { Injectable, signal, computed } from '@angular/core';
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
  selectedBranch = signal<Branch | null>(null);
  selectedService = signal<Service | null>(null);
  selectedDate = signal<Date | null>(null);
  selectedTime = signal<string | null>(null);
  selectedBarber = signal<Barber | null>(null);
  paymentMethod = signal<'cash' | 'paypal' | null>(null);

  // Mock Services Data
  availableServices: Service[] = [
    {
      id: 's1',
      name: 'Classic Haircut',
      price: 25,
      duration: 30,
      description: 'Standard cut with scissors and clippers.',
    },
    {
      id: 's2',
      name: 'Beard Trim',
      price: 15,
      duration: 20,
      description: 'Shape and trim your beard.',
    },
    {
      id: 's3',
      name: 'Hot Towel Shave',
      price: 30,
      duration: 45,
      description: 'Traditional straight razor shave with hot towels.',
    },
    {
      id: 's4',
      name: 'The Full Package',
      price: 50,
      duration: 60,
      description: 'Haircut, beard trim, and facial.',
    },
  ];

  totalPrice = computed(() => {
    return this.selectedService()?.price || 0;
  });

  reset() {
    this.selectedBranch.set(null);
    this.selectedService.set(null);
    this.selectedDate.set(null);
    this.selectedTime.set(null);
    this.selectedBarber.set(null);
    this.paymentMethod.set(null);
  }
}
