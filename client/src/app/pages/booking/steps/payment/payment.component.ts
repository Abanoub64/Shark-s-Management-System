import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { BookingService } from '../../../../core/services/booking.service';
import { UiButtonComponent } from '../../../../components/shared/ui-button.component';

@Component({
  selector: 'app-payment',
  standalone: true,
  imports: [CommonModule, UiButtonComponent],
  template: `
    <h2 class="text-2xl font-bold mb-6">Payment Method</h2>

    <div class="grid grid-cols-1 gap-4 mb-8">
      <div
        class="border rounded-lg p-4 cursor-pointer hover:border-primary transition-colors flex items-center gap-4"
        [class.border-primary]="bookingService.paymentMethod() === 'cash'"
        [class.bg-gray-50]="bookingService.paymentMethod() === 'cash'"
        (click)="selectPayment('cash')"
      >
        <div class="text-2xl">💵</div>
        <div>
          <h3 class="font-bold">Pay Cash on Arrival</h3>
          <p class="text-sm text-gray-500">Pay at the counter</p>
        </div>
      </div>

      <div
        class="border rounded-lg p-4 cursor-pointer hover:border-primary transition-colors flex items-center gap-4"
        [class.border-primary]="bookingService.paymentMethod() === 'paypal'"
        [class.bg-gray-50]="bookingService.paymentMethod() === 'paypal'"
        (click)="selectPayment('paypal')"
      >
        <div class="text-2xl">🅿️</div>
        <div>
          <h3 class="font-bold">PayPal</h3>
          <p class="text-sm text-gray-500">Secure online payment</p>
        </div>
      </div>
    </div>

    <div class="bg-gray-50 p-4 rounded-lg mb-8">
      <h3 class="font-bold mb-2">Booking Summary</h3>
      <div class="flex justify-between text-sm mb-1">
        <span>Service</span>
        <span>{{ bookingService.selectedService()?.name }}</span>
      </div>
      <div class="flex justify-between text-sm mb-1">
        <span>Date & Time</span>
        <span
          >{{ bookingService.selectedDate() | date }} at {{ bookingService.selectedTime() }}</span
        >
      </div>
      <div class="border-t border-gray-200 my-2 pt-2 flex justify-between font-bold">
        <span>Total</span>
        <span>\${{ bookingService.totalPrice() }}</span>
      </div>
    </div>

    <div class="mt-8 flex justify-between">
      <app-ui-button variant="outline" (click)="back()">Back</app-ui-button>
      <app-ui-button (click)="next()" [disabled]="!bookingService.paymentMethod()">
        Confirm Booking
      </app-ui-button>
    </div>
  `,
})
export class PaymentComponent {
  bookingService = inject(BookingService);
  router = inject(Router);

  selectPayment(method: 'cash' | 'paypal') {
    this.bookingService.paymentMethod.set(method);
  }

  back() {
    this.router.navigate(['/booking/barber']);
  }

  next() {
    this.router.navigate(['/booking/confirmation']);
  }
}
