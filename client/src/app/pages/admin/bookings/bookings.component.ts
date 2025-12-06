import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastService } from '../../../core/services/toast.service';

@Component({
  selector: 'app-bookings',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="space-y-6">
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 class="text-2xl md:text-3xl font-bold" [style.color]="'var(--text-primary)'">
            Bookings Management
          </h1>
          <p class="text-sm md:text-base mt-1" [style.color]="'var(--text-secondary)'">
            View and manage all bookings across branches
          </p>
        </div>
        <div class="flex gap-2">
          <button class="btn-outline" (click)="filterBookings()">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
              />
            </svg>
            Filter
          </button>
          <button class="btn-primary" (click)="createBooking()">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 4v16m8-8H4"
              />
            </svg>
            New Booking
          </button>
        </div>
      </div>

      <!-- Stats Cards -->
      <div class="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div class="card p-4 md:p-6">
          <p class="text-xs md:text-sm" [style.color]="'var(--text-secondary)'">Today's Bookings</p>
          <h3 class="text-2xl md:text-3xl font-bold mt-1" [style.color]="'var(--text-primary)'">
            42
          </h3>
        </div>
        <div class="card p-4 md:p-6">
          <p class="text-xs md:text-sm" [style.color]="'var(--text-secondary)'">Confirmed</p>
          <h3 class="text-2xl md:text-3xl font-bold mt-1 text-green-600">35</h3>
        </div>
        <div class="card p-4 md:p-6">
          <p class="text-xs md:text-sm" [style.color]="'var(--text-secondary)'">Pending</p>
          <h3 class="text-2xl md:text-3xl font-bold mt-1 text-orange-600">5</h3>
        </div>
        <div class="card p-4 md:p-6">
          <p class="text-xs md:text-sm" [style.color]="'var(--text-secondary)'">Cancelled</p>
          <h3 class="text-2xl md:text-3xl font-bold mt-1 text-red-600">2</h3>
        </div>
      </div>

      <!-- Bookings List -->
      <div class="card">
        <div class="p-4 md:p-6 border-b" [style.border-color]="'var(--border-light)'">
          <h2 class="text-lg font-semibold" [style.color]="'var(--text-primary)'">
            Recent Bookings
          </h2>
        </div>

        <div class="overflow-x-auto">
          <table class="w-full">
            <thead
              class="border-b"
              [style.border-color]="'var(--border-light)'"
              [style.background-color]="'var(--bg-tertiary)'"
            >
              <tr>
                <th
                  class="px-4 py-3 text-left text-xs font-medium uppercase"
                  [style.color]="'var(--text-tertiary)'"
                >
                  ID
                </th>
                <th
                  class="px-4 py-3 text-left text-xs font-medium uppercase"
                  [style.color]="'var(--text-tertiary)'"
                >
                  Customer
                </th>
                <th
                  class="px-4 py-3 text-left text-xs font-medium uppercase"
                  [style.color]="'var(--text-tertiary)'"
                >
                  Service
                </th>
                <th
                  class="px-4 py-3 text-left text-xs font-medium uppercase"
                  [style.color]="'var(--text-tertiary)'"
                >
                  Barber
                </th>
                <th
                  class="px-4 py-3 text-left text-xs font-medium uppercase"
                  [style.color]="'var(--text-tertiary)'"
                >
                  Date & Time
                </th>
                <th
                  class="px-4 py-3 text-left text-xs font-medium uppercase"
                  [style.color]="'var(--text-tertiary)'"
                >
                  Status
                </th>
                <th
                  class="px-4 py-3 text-left text-xs font-medium uppercase"
                  [style.color]="'var(--text-tertiary)'"
                >
                  Actions
                </th>
              </tr>
            </thead>
            <tbody class="divide-y" [style.divide-color]="'var(--border-light)'">
              @for (booking of mockBookings; track booking.id) {
              <tr
                class="hover:bg-opacity-50 dark:hover:bg-opacity-50 transition-colors cursor-pointer"
                style="hover:background-color: var(--bg-tertiary)"
              >
                <td class="px-4 py-3 text-sm font-medium" [style.color]="'var(--text-primary)'">
                  {{ booking.id }}
                </td>
                <td class="px-4 py-3 text-sm" [style.color]="'var(--text-secondary)'">
                  {{ booking.customer }}
                </td>
                <td class="px-4 py-3 text-sm" [style.color]="'var(--text-secondary)'">
                  {{ booking.service }}
                </td>
                <td class="px-4 py-3 text-sm" [style.color]="'var(--text-secondary)'">
                  {{ booking.barber }}
                </td>
                <td class="px-4 py-3 text-sm" [style.color]="'var(--text-secondary)'">
                  {{ booking.datetime }}
                </td>
                <td class="px-4 py-3">
                  <span
                    class="badge"
                    [class.badge-success]="booking.status === 'Confirmed'"
                    [class.badge-warning]="booking.status === 'Pending'"
                    [class.badge-danger]="booking.status === 'Cancelled'"
                  >
                    {{ booking.status }}
                  </span>
                </td>
                <td class="px-4 py-3">
                  <div class="flex gap-2">
                    <button
                      class="text-blue-600 hover:text-blue-800 text-sm"
                      (click)="viewBooking(booking.id)"
                    >
                      View
                    </button>
                    @if (booking.status === 'Pending') {
                    <button
                      class="text-green-600 hover:text-green-800 text-sm"
                      (click)="confirmBooking(booking.id)"
                    >
                      Confirm
                    </button>
                    }
                    <button
                      class="text-red-600 hover:text-red-800 text-sm"
                      (click)="cancelBooking(booking.id)"
                    >
                      Cancel
                    </button>
                  </div>
                </td>
              </tr>
              }
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `,
})
export class BookingsComponent {
  private toastService = signal(new ToastService()).asReadonly();

  mockBookings = [
    {
      id: 'BK-9921',
      customer: 'Ahmed Ali',
      service: 'Haircut + Beard',
      barber: 'Mohamed Hassan',
      datetime: 'Today, 2:30 PM',
      status: 'Confirmed',
    },
    {
      id: 'BK-9922',
      customer: 'Sarah Smith',
      service: 'Hair Coloring',
      barber: 'Omar Khaled',
      datetime: 'Today, 3:00 PM',
      status: 'Pending',
    },
    {
      id: 'BK-9923',
      customer: 'Mike Johnson',
      service: 'Full Package',
      barber: 'Karim Youssef',
      datetime: 'Today, 3:30 PM',
      status: 'Confirmed',
    },
    {
      id: 'BK-9924',
      customer: 'Omar Khaled',
      service: 'Haircut',
      barber: 'Ahmed Hassan',
      datetime: 'Today, 4:00 PM',
      status: 'Cancelled',
    },
    {
      id: 'BK-9925',
      customer: 'Karim Hassan',
      service: 'Beard Trim',
      barber: 'Tarek Mahmoud',
      datetime: 'Today, 4:30 PM',
      status: 'Confirmed',
    },
  ];

  createBooking() {
    this.toastService().info('New Booking', 'Booking creation form will open here');
  }

  viewBooking(id: string) {
    this.toastService().info('View Booking', `Viewing booking ${id}`);
  }

  confirmBooking(id: string) {
    this.toastService().success('Confirmed', `Booking ${id} has been confirmed`);
  }

  cancelBooking(id: string) {
    this.toastService().warning('Cancel Booking', `Cancellation confirmation for ${id}`);
  }

  filterBookings() {
    this.toastService().info('Filter', 'Filter options will appear here');
  }
}
