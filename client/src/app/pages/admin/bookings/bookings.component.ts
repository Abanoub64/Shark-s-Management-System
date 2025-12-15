import { Component, signal, inject, OnInit, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ToastService } from '../../../core/services/toast.service';
import { BookingService } from '../../../core/services/booking.service';
import { AuthService } from '../../../core/services/auth.service';
import { BranchService, Branch } from '../../../core/services/branch.service';
import { BookingDto } from '../../../core/models/models';
import { DeleteConfirmationModalComponent } from '../../../components/shared/delete-confirmation-modal/delete-confirmation-modal.component';
import { LanguageService } from '../../../core/services/language.service';
import { UiSkeletonComponent } from '../../../components/shared/ui-skeleton.component';

@Component({
  selector: 'app-bookings',
  standalone: true,
  imports: [CommonModule, FormsModule, DeleteConfirmationModalComponent, UiSkeletonComponent],
  template: `
    <div class="space-y-6">
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 class="text-2xl md:text-3xl font-bold" [style.color]="'var(--text-primary)'">
            {{ langService.t().bookingsManagement }}
          </h1>
        </div>

        <!-- Bookings List -->
        <div class="card">
          <div class="p-4 md:p-6 border-b" [style.border-color]="'var(--border-light)'">
            <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <h2 class="text-lg font-semibold" [style.color]="'var(--text-primary)'">
                {{ langService.t().recentBookings }}
              </h2>
              <div class="flex gap-2">
                <!-- Search Input -->
                <div class="relative flex-1 sm:flex-none">
                  <input
                    type="text"
                    [(ngModel)]="searchId"
                    (ngModelChange)="currentPage.set(1)"
                    [placeholder]="langService.t().searchBookingId"
                    class="pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 w-full sm:w-64 text-sm"
                    [style.background-color]="'var(--bg-secondary)'"
                    [style.color]="'var(--text-primary)'"
                    [style.border-color]="'var(--border-light)'"
                  />
                  <svg
                    class="w-5 h-5 absolute left-3 top-2.5 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                </div>
                <button class="btn-outline text-sm whitespace-nowrap" (click)="exportData()">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                  Export
                </button>
              </div>
            </div>
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
                    {{ langService.t().id }}
                  </th>
                  <th
                    class="px-4 py-3 text-left text-xs font-medium uppercase"
                    [style.color]="'var(--text-tertiary)'"
                  >
                    {{ langService.t().branch }}
                  </th>
                  <th
                    class="px-4 py-3 text-left text-xs font-medium uppercase"
                    [style.color]="'var(--text-tertiary)'"
                  >
                    {{ langService.t().customer }}
                  </th>
                  <th
                    class="px-4 py-3 text-left text-xs font-medium uppercase"
                    [style.color]="'var(--text-tertiary)'"
                  >
                    {{ langService.t().service }}
                  </th>
                  <th
                    class="px-4 py-3 text-left text-xs font-medium uppercase"
                    [style.color]="'var(--text-tertiary)'"
                  >
                    {{ langService.t().barber }}
                  </th>
                  <th
                    class="px-4 py-3 text-left text-xs font-medium uppercase"
                    [style.color]="'var(--text-tertiary)'"
                  >
                    {{ langService.t().dateTime }}
                  </th>
                  <th
                    class="px-4 py-3 text-left text-xs font-medium uppercase"
                    [style.color]="'var(--text-tertiary)'"
                  >
                    {{ langService.t().status }}
                  </th>
                  <th
                    class="px-4 py-3 text-left text-xs font-medium uppercase"
                    [style.color]="'var(--text-tertiary)'"
                  >
                    {{ langService.t().actions }}
                  </th>
                </tr>
              </thead>
              <tbody class="divide-y" [style.divide-color]="'var(--border-light)'">
                @if (isLoading()) { @for (item of [1, 2, 3, 4, 5]; track item) {
                <tr>
                  <td class="px-4 py-3"><app-ui-skeleton width="60px"></app-ui-skeleton></td>
                  <td class="px-4 py-3"><app-ui-skeleton width="100px"></app-ui-skeleton></td>
                  <td class="px-4 py-3"><app-ui-skeleton width="120px"></app-ui-skeleton></td>
                  <td class="px-4 py-3"><app-ui-skeleton width="150px"></app-ui-skeleton></td>
                  <td class="px-4 py-3"><app-ui-skeleton width="120px"></app-ui-skeleton></td>
                  <td class="px-4 py-3"><app-ui-skeleton width="140px"></app-ui-skeleton></td>
                  <td class="px-4 py-3">
                    <app-ui-skeleton width="80px" className="rounded-full"></app-ui-skeleton>
                  </td>
                  <td class="px-4 py-3">
                    <div class="flex gap-2"><app-ui-skeleton width="100px"></app-ui-skeleton></div>
                  </td>
                </tr>
                } } @else if (filteredBookings().length === 0) {
                <tr>
                  <td
                    colspan="8"
                    class="px-4 py-8 text-center"
                    [style.color]="'var(--text-secondary)'"
                  >
                    {{ langService.t().noBookingsFound }}
                  </td>
                </tr>
                } @else { @for (booking of paginatedBookings(); track booking.id) {
                <tr
                  class="hover:bg-opacity-50 dark:hover:bg-opacity-50 transition-colors cursor-pointer"
                  style="hover:background-color: var(--bg-tertiary)"
                >
                  <td class="px-4 py-3 text-sm font-medium" [style.color]="'var(--text-primary)'">
                    #{{ booking.id }}
                  </td>
                  <td class="px-4 py-3 text-sm font-medium" [style.color]="'var(--text-primary)'">
                    {{ getBranchName(booking.branchId) }}
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
                        {{ langService.t().delete }}
                      </button>
                    </div>
                  </td>
                </tr>
                } }
              </tbody>
            </table>
          </div>

          <!-- Pagination Controls -->
          @if (totalPages() > 1) {
          <div
            class="px-4 py-4 border-t flex flex-col sm:flex-row items-center justify-between gap-4"
            [style.border-color]="'var(--border-light)'"
          >
            <div class="text-sm" [style.color]="'var(--text-secondary)'">
              Showing {{ (currentPage() - 1) * pageSize() + 1 }} to
              {{ Math.min(currentPage() * pageSize(), filteredBookings().length) }} of
              {{ filteredBookings().length }} bookings
            </div>
            <div class="flex items-center gap-2">
              <button
                (click)="prevPage()"
                [disabled]="currentPage() === 1"
                class="p-2 rounded-lg border transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-700"
                [style.border-color]="'var(--border-light)'"
                [style.color]="'var(--text-primary)'"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
              </button>

              @for (page of pageNumbers(); track $index) { @if (page === '...') {
              <span class="px-3 py-2" [style.color]="'var(--text-tertiary)'">...</span>
              } @else {
              <button
                (click)="goToPage(page)"
                class="min-w-[40px] px-3 py-2 rounded-lg border transition-all duration-200 text-sm font-medium"
                [class.bg-primary]="currentPage() === page"
                [class.text-white]="currentPage() === page"
                [class.hover:bg-gray-50]="currentPage() !== page"
                [class.dark:hover:bg-gray-700]="currentPage() !== page"
                [style.border-color]="
                  currentPage() === page ? 'transparent' : 'var(--border-light)'
                "
                [style.color]="currentPage() === page ? 'white' : 'var(--text-primary)'"
              >
                {{ page }}
              </button>
              } }

              <button
                (click)="nextPage()"
                [disabled]="currentPage() === totalPages()"
                class="p-2 rounded-lg border transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-700"
                [style.border-color]="'var(--border-light)'"
                [style.color]="'var(--text-primary)'"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </button>
            </div>
          </div>
          }
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
    </div>
  `,
})
export class BookingsComponent implements OnInit {
  Math = Math;
  private toastService = signal(new ToastService()).asReadonly();
  private bookingService = signal(inject(BookingService)).asReadonly();
  private authService = signal(inject(AuthService)).asReadonly();
  private branchService = inject(BranchService);
  langService = inject(LanguageService);

  bookings = signal<BookingDto[]>([]);
  branches = signal<Branch[]>([]);
  searchId = signal('');
  currentPage = signal(1);
  pageSize = signal(15);

  filteredBookings = computed(() => {
    const term = this.searchId().toLowerCase();
    const allBookings = this.bookings();

    if (!term) return allBookings;

    return allBookings.filter((booking) => booking.id.toString().includes(term));
  });

  totalPages = computed(() => {
    return Math.ceil(this.filteredBookings().length / this.pageSize());
  });

  paginatedBookings = computed(() => {
    const filtered = this.filteredBookings();
    const start = (this.currentPage() - 1) * this.pageSize();
    const end = start + this.pageSize();
    return filtered.slice(start, end);
  });

  pageNumbers = computed(() => {
    const total = this.totalPages();
    const current = this.currentPage();
    const pages: (number | string)[] = [];

    if (total <= 7) {
      for (let i = 1; i <= total; i++) pages.push(i);
    } else {
      pages.push(1);
      if (current > 3) pages.push('...');

      const start = Math.max(2, current - 1);
      const end = Math.min(total - 1, current + 1);

      for (let i = start; i <= end; i++) pages.push(i);

      if (current < total - 2) pages.push('...');
      pages.push(total);
    }

    return pages;
  });

  isLoading = signal(true);
  showDeleteModal = signal(false);
  selectedBooking = signal<BookingDto | null>(null);

  ngOnInit() {
    this.loadBookings();
    this.loadBranches();
  }

  nextPage() {
    if (this.currentPage() < this.totalPages()) {
      this.currentPage.update((p) => p + 1);
    }
  }

  prevPage() {
    if (this.currentPage() > 1) {
      this.currentPage.update((p) => p - 1);
    }
  }

  goToPage(page: number | string) {
    if (typeof page === 'number' && page >= 1 && page <= this.totalPages()) {
      this.currentPage.set(page);
    }
  }

  loadBookings() {
    this.isLoading.set(true);
    const managedBranchId = this.authService().managedBranchId;

    this.bookingService()
      .getAllBookings(managedBranchId || undefined)
      .subscribe({
        next: (bookings) => {
          this.bookings.set(bookings);
          this.isLoading.set(false);
        },
        error: (error) => {
          console.error('Error loading bookings:', error);
          this.toastService().error('Error', 'Failed to load bookings');
          this.isLoading.set(false);
        },
      });
  }

  loadBranches() {
    this.branchService.getAllBranches().subscribe({
      next: (branches) => {
        this.branches.set(branches);
      },
      error: (error) => {
        console.error('Error loading branches:', error);
      },
    });
  }

  getBranchName(branchId: number): string {
    const branch = this.branches().find((b) => Number(b.id) === branchId);
    return branch ? branch.name : `Branch #${branchId}`;
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

  exportData() {
    const rows = this.filteredBookings();
    if (!rows.length) {
      this.toastService().error('Export', 'No data to export');
      return;
    }

    const headers = [
      'ID',
      'Branch',
      'Customer',
      'Service',
      'Barber',
      'Date & Time',
      'Status',
      'Price',
    ];
    const csvBody = [
      headers,
      ...rows.map((b) => [
        String(b.id ?? ''),
        this.getBranchName(b.branchId) ?? '',
        b.customerName ?? '',
        b.serviceName ?? '',
        b.barberName ?? '',
        this.formatDateTime(b.startAt) ?? '',
        b.status ?? '',
        String(b.servicePrice ?? 0),
      ]),
    ]
      .map((row) => row.map((cell) => this.escapeCsv(cell)).join(','))
      .join('\n');

    const blob = new Blob(['\uFEFF' + csvBody], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'bookings.csv';
    link.click();
    URL.revokeObjectURL(url);

    this.toastService().success('Export', 'Bookings CSV downloaded');
  }

  private escapeCsv(value: string): string {
    const str = value ?? '';
    if (str.includes('"') || str.includes(',') || str.includes('\n')) {
      return `"${str.replace(/"/g, '""')}"`;
    }
    return str;
  }
}
