import { Component, signal, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastService } from '../../../core/services/toast.service';
import { BookingService } from '../../../core/services/booking.service';
import { AuthService } from '../../../core/services/auth.service';
import { BookingDto } from '../../../core/models/models';
import { DeleteConfirmationModalComponent } from '../../../components/shared/delete-confirmation-modal/delete-confirmation-modal.component';
import { LanguageService } from '../../../core/services/language.service';

@Component({
  selector: 'app-bookings',
  standalone: true,
  imports: [CommonModule, DeleteConfirmationModalComponent],
  template: `
    <div class="space-y-6">
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 class="text-2xl md:text-3xl font-bold" [style.color]="'var(--text-primary)'">
            Bookings Management
          </h1>
          <p class="text-sm md:text-base mt-1" [style.color]="'var(--text-secondary)'">
            {{ langService.t().viewManageBookings }}
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
            {{ langService.t().newBooking }}
          </button>
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
              @if (isLoading()) {
              <tr>
                <td colspan="7" class="px-4 py-8 text-center">
                  <div class="flex justify-center">
                    <div
                      class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"
                    ></div>
                  </div>
                </td>
              </tr>
              } @else if (filteredBookings().length === 0) {
              <tr>
                <td
                  colspan="7"
                  class="px-4 py-8 text-center"
                  [style.color]="'var(--text-secondary)'"
                >
                  {{ langService.t().noBookingsFound }}
                </td>
              </tr>
              } @else { @for (booking of filteredBookings(); track booking.id) {
              <tr
                class="hover:bg-opacity-50 dark:hover:bg-opacity-50 transition-colors cursor-pointer"
                style="hover:background-color: var(--bg-tertiary)"
              >
                <td class="px-4 py-3 text-sm font-medium" [style.color]="'var(--text-primary)'">
                  {{ booking.id }}
                </td>
                <td class="px-4 py-3 text-sm" [style.color]="'var(--text-secondary)'">
                  {{ booking.customerName || 'N/A' }}
                </td>
                <td class="px-4 py-3 text-sm" [style.color]="'var(--text-secondary)'">
                  {{ booking.serviceName }} ({{ booking.servicePrice }} EGP)
                </td>
                <td class="px-4 py-3 text-sm" [style.color]="'var(--text-secondary)'">
                  {{ booking.barberName }}
                </td>
                <td class="px-4 py-3 text-sm" [style.color]="'var(--text-secondary)'">
                  {{ formatDateTime(booking.startAt) }}
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
                    @if (booking.status !== 'Completed') {
                    <button
                      class="text-green-600 hover:text-green-800 text-sm font-medium"
                      (click)="completeBooking(booking)"
                    >
                      {{ langService.t().complete }}
                    </button>
                    }
                    <button
                      class="text-red-600 hover:text-red-800 text-sm font-medium"
                      (click)="openDeleteModal(booking)"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
              } }
            </tbody>
          </table>
        </div>
      </div>

      <!-- Delete Confirmation Modal -->
      <app-delete-confirmation-modal
        [isOpen]="showDeleteModal()"
        [entityType]="'Booking'"
        [entityName]="selectedBooking()?.id?.toString() || ''"
        (confirmed)="confirmDelete()"
        (cancelled)="closeDeleteModal()"
      />
    </div>
  `,
})
export class BookingsComponent implements OnInit {
  private toastService = signal(new ToastService()).asReadonly();
  private bookingService = signal(inject(BookingService)).asReadonly();
  private authService = signal(inject(AuthService)).asReadonly();
  langService = inject(LanguageService);

  bookings = signal<BookingDto[]>([]);
  filteredBookings = signal<BookingDto[]>([]);
  isLoading = signal(true);
  showDeleteModal = signal(false);
  selectedBooking = signal<BookingDto | null>(null);

  ngOnInit() {
    this.loadBookings();
  }

  loadBookings() {
    this.isLoading.set(true);
    const managedBranchId = this.authService().managedBranchId;

    this.bookingService()
      .getAllBookings(managedBranchId || undefined)
      .subscribe({
        next: (bookings) => {
          this.bookings.set(bookings);
          this.filteredBookings.set(bookings);
          this.isLoading.set(false);
        },
        error: (error) => {
          console.error('Error loading bookings:', error);
          this.toastService().error('Error', 'Failed to load bookings');
          this.isLoading.set(false);
        },
      });
  }

  formatDateTime(dateTime: string): string {
    const date = new Date(dateTime);
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  }

  completeBooking(booking: BookingDto) {
    this.bookingService()
      .updateBookingStatus(booking.id, 'Completed')
      .subscribe({
        next: () => {
          this.toastService().success('Success', `Booking #${booking.id} marked as completed`);
          this.loadBookings();
        },
        error: (error) => {
          console.error('Error updating booking:', error);
          this.toastService().error('Error', 'Failed to update booking status');
        },
      });
  }

  openDeleteModal(booking: BookingDto) {
    this.selectedBooking.set(booking);
    this.showDeleteModal.set(true);
  }

  closeDeleteModal() {
    this.showDeleteModal.set(false);
    this.selectedBooking.set(null);
  }

  confirmDelete() {
    const booking = this.selectedBooking();
    if (!booking) return;

    this.bookingService()
      .deleteBooking(booking.id)
      .subscribe({
        next: () => {
          this.toastService().success('Deleted', `Booking #${booking.id} has been deleted`);
          this.closeDeleteModal();
          this.loadBookings();
        },
        error: (error) => {
          console.error('Error deleting booking:', error);
          this.toastService().error('Error', 'Failed to delete booking');
          this.closeDeleteModal();
        },
      });
  }

  createBooking() {
    this.toastService().info('New Booking', 'Booking creation form will open here');
  }

  viewBooking(id: number) {
    this.toastService().info('View Booking', `Viewing booking ${id}`);
  }

  filterBookings() {
    this.toastService().info('Filter', 'Filter options will appear here');
  }
}
