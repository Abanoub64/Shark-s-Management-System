import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { BookingService } from '../../../../core/services/booking.service';
import { BranchService } from '../../../../core/services/branch.service';
import { UiButtonComponent } from '../../../../components/shared/ui-button.component';

@Component({
  selector: 'app-select-barber',
  standalone: true,
  imports: [CommonModule, UiButtonComponent],
  template: `
    <h2 class="text-2xl font-bold mb-6">Select Barber (Optional)</h2>

    <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
      <!-- Any Professional Option -->
      <div
        class="border rounded-lg p-4 cursor-pointer hover:border-primary transition-colors flex items-center gap-4"
        [class.border-primary]="bookingService.selectedBarber() === null"
        [class.bg-gray-50]="bookingService.selectedBarber() === null"
        (click)="selectBarber(null)"
      >
        <div class="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center text-xl">
          ?
        </div>
        <div>
          <h3 class="font-bold">Any Professional</h3>
          <p class="text-sm text-gray-500">First available barber</p>
        </div>
      </div>

      <!-- Barber Options -->
      @if (branch; as branch) { @for (barber of branch.barbers; track barber.id) {
      <div
        class="border rounded-lg p-4 cursor-pointer hover:border-primary transition-colors flex items-center gap-4"
        [class.border-primary]="bookingService.selectedBarber()?.id === barber.id"
        [class.bg-gray-50]="bookingService.selectedBarber()?.id === barber.id"
        (click)="selectBarber(barber)"
      >
        <img [src]="barber.image" class="w-12 h-12 rounded-full object-cover" />
        <div>
          <h3 class="font-bold">{{ barber.name }}</h3>
          <p class="text-sm text-gray-500">{{ barber.experience }} years exp.</p>
        </div>
      </div>
      } }
    </div>

    <div class="mt-8 flex justify-between">
      <app-ui-button variant="outline" (click)="back()">Back</app-ui-button>
      <app-ui-button (click)="next()">Next: Payment</app-ui-button>
    </div>
  `,
})
export class SelectBarberComponent {
  bookingService = inject(BookingService);
  branchService = inject(BranchService);
  router = inject(Router);

  // In a real app, we'd get the branch from the booking service or route
  // For now, let's assume we have a branch selected or default to first one for demo
  branch = this.branchService.branches()[0];

  selectBarber(barber: any) {
    this.bookingService.selectedBarber.set(barber);
  }

  back() {
    this.router.navigate(['/booking/date-time']);
  }

  next() {
    this.router.navigate(['/booking/payment']);
  }
}
