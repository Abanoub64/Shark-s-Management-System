import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { BookingService } from '../../../../core/services/booking.service';
import { UiButtonComponent } from '../../../../components/shared/ui-button.component';

@Component({
  selector: 'app-select-date-time',
  standalone: true,
  imports: [CommonModule, UiButtonComponent],
  template: `
    <h2 class="text-2xl font-bold mb-6">Select Date & Time</h2>

    <div class="mb-6">
      <label class="block text-sm font-medium text-gray-700 mb-2">Date</label>
      <input type="date" class="w-full p-2 border rounded-md" (change)="onDateChange($event)" />
    </div>

    @if (bookingService.selectedDate()) {
    <div class="mb-6">
      <label class="block text-sm font-medium text-gray-700 mb-2">Available Slots</label>
      <div class="grid grid-cols-3 sm:grid-cols-4 gap-3">
        @for (slot of timeSlots; track slot) {
        <button
          class="py-2 px-4 rounded-md border text-sm font-medium transition-colors"
          [class.bg-primary]="bookingService.selectedTime() === slot"
          [class.text-white]="bookingService.selectedTime() === slot"
          [class.hover:bg-gray-100]="bookingService.selectedTime() !== slot"
          (click)="selectTime(slot)"
        >
          {{ slot }}
        </button>
        }
      </div>
    </div>
    }

    <div class="mt-8 flex justify-between">
      <app-ui-button variant="outline" (click)="back()">Back</app-ui-button>
      <app-ui-button
        (click)="next()"
        [disabled]="!bookingService.selectedDate() || !bookingService.selectedTime()"
      >
        Next: Select Barber
      </app-ui-button>
    </div>
  `,
})
export class SelectDateTimeComponent {
  bookingService = inject(BookingService);
  router = inject(Router);

  timeSlots = ['10:00', '10:30', '11:00', '11:30', '12:00', '12:30', '14:00', '14:30', '15:00'];

  onDateChange(event: any) {
    this.bookingService.selectedDate.set(new Date(event.target.value));
    this.bookingService.selectedTime.set(null);
  }

  selectTime(time: string) {
    this.bookingService.selectedTime.set(time);
  }

  back() {
    this.router.navigate(['/booking/service']);
  }

  next() {
    this.router.navigate(['/booking/barber']);
  }
}
