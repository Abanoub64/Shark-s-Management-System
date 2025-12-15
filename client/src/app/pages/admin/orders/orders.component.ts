import { Component, signal, inject, OnInit, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ToastService } from '../../../core/services/toast.service';
import { OrderService } from '../../../core/services/order.service';
import { OrderDto } from '../../../core/models/order.model';
import { DeleteConfirmationModalComponent } from '../../../components/shared/delete-confirmation-modal/delete-confirmation-modal.component';
import { LanguageService } from '../../../core/services/language.service';
import { UiSkeletonComponent } from '../../../components/shared/ui-skeleton.component';

@Component({
  selector: 'app-orders',
  standalone: true,
  imports: [CommonModule, FormsModule, DeleteConfirmationModalComponent, UiSkeletonComponent],
  template: `
    <div class="space-y-6">
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 class="text-2xl md:text-3xl font-bold" [style.color]="'var(--text-primary)'">
            {{ langService.t().ordersManagement }}
          </h1>
          <p class="text-sm md:text-base mt-1" [style.color]="'var(--text-secondary)'">
            {{ langService.t().viewManageOrders }}
          </p>
        </div>
      </div>

      <!-- Orders List -->
      <div class="card">
        <div class="p-4 md:p-6 border-b" [style.border-color]="'var(--border-light)'">
          <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <h2 class="text-lg font-semibold" [style.color]="'var(--text-primary)'">
              {{ langService.t().allOrders }}
            </h2>
            <div class="flex gap-2">
              <!-- Search Input -->
              <div class="relative flex-1 sm:flex-none">
                <input
                  type="text"
                  [(ngModel)]="searchId"
                  [placeholder]="langService.t().search + '...'"
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
                  ID
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
                  Total
                </th>
                <th
                  class="px-4 py-3 text-left text-xs font-medium uppercase"
                  [style.color]="'var(--text-tertiary)'"
                >
                  Payment
                </th>
                <th
                  class="px-4 py-3 text-left text-xs font-medium uppercase"
                  [style.color]="'var(--text-tertiary)'"
                >
                  Date
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
              @if (isLoading()) { @for (item of [1, 2, 3, 4, 5]; track item) {
              <tr>
                <td class="px-4 py-3"><app-ui-skeleton width="40px"></app-ui-skeleton></td>
                <td class="px-4 py-3"><app-ui-skeleton width="120px"></app-ui-skeleton></td>
                <td class="px-4 py-3"><app-ui-skeleton width="80px"></app-ui-skeleton></td>
                <td class="px-4 py-3"><app-ui-skeleton width="100px"></app-ui-skeleton></td>
                <td class="px-4 py-3"><app-ui-skeleton width="140px"></app-ui-skeleton></td>
                <td class="px-4 py-3">
                  <app-ui-skeleton width="80px" className="rounded-full"></app-ui-skeleton>
                </td>
                <td class="px-4 py-3">
                  <div class="flex gap-2"><app-ui-skeleton width="80px"></app-ui-skeleton></div>
                </td>
              </tr>
              } } @else if (filteredOrders().length === 0) {
              <tr>
                <td
                  colspan="7"
                  class="px-4 py-8 text-center"
                  [style.color]="'var(--text-secondary)'"
                >
                  {{ langService.t().noOrdersFound }}
                </td>
              </tr>
              } @else { @for (order of filteredOrders(); track order.id) {
              <tr
                class="hover:bg-opacity-50 dark:hover:bg-opacity-50 transition-colors cursor-pointer"
                style="hover:background-color: var(--bg-tertiary)"
              >
                <td class="px-4 py-3 text-sm font-medium" [style.color]="'var(--text-primary)'">
                  {{ order.id }}
                </td>
                <td class="px-4 py-3 text-sm" [style.color]="'var(--text-secondary)'">
                  {{ order.customerName || 'N/A' }}
                </td>
                <td class="px-4 py-3 text-sm" [style.color]="'var(--text-secondary)'">
                  {{ order.total }} EGP
                </td>
                <td class="px-4 py-3 text-sm" [style.color]="'var(--text-secondary)'">
                  {{ order.paymentMethod }}
                </td>
                <td class="px-4 py-3 text-sm" [style.color]="'var(--text-secondary)'">
                  {{ formatDateTime(order.createdAt) }}
                </td>
                <td class="px-4 py-3">
                  <span
                    class="badge"
                    [class.badge-success]="order.status === 'Completed'"
                    [class.badge-warning]="order.status === 'Pending'"
                    [class.badge-danger]="order.status === 'Cancelled'"
                  >
                    {{ order.status }}
                  </span>
                </td>
                <td class="px-4 py-3">
                  <div class="flex gap-2">
                    <button
                      class="text-blue-600 hover:text-blue-800 text-sm"
                      (click)="viewOrder(order.id)"
                    >
                      View
                    </button>
                    @if (order.status !== 'Completed') {
                    <button
                      class="text-green-600 hover:text-green-800 text-sm font-medium"
                      (click)="completeOrder(order)"
                    >
                      Complete
                    </button>
                    }
                    <button
                      class="text-red-600 hover:text-red-800 text-sm font-medium"
                      (click)="openDeleteModal(order)"
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
        [entityType]="'Order'"
        [entityName]="selectedOrder()?.id?.toString() || ''"
        (confirmed)="confirmDelete()"
        (cancelled)="closeDeleteModal()"
      />

      <!-- Order Details Modal -->
      @if (showDetailsModal()) {
      <div class="modal-backdrop fade-in" (click)="closeDetailsModal()">
        <div class="modal w-full max-w-2xl p-6 slide-in-up" (click)="$event.stopPropagation()">
          <!-- Header -->
          <div class="flex items-start justify-between mb-6">
            <div>
              <h3 class="text-xl font-bold text-gray-900">
                {{ langService.t().orderDetails }} #{{ selectedOrder()?.id }}
              </h3>
              <p class="text-sm text-gray-500 mt-1">
                {{ formatDateTime(selectedOrder()?.createdAt || '') }}
              </p>
            </div>
            <button
              (click)="closeDetailsModal()"
              class="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          <!-- Customer Info -->
          <div class="bg-gray-50 rounded-lg p-4 mb-4">
            <h4 class="font-semibold text-gray-900 mb-3">
              {{ langService.t().customerInformation }}
            </h4>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
              <div>
                <span class="text-gray-600">{{ langService.t().name }}:</span>
                <span class="ml-2 font-medium">{{ selectedOrder()?.customerName || 'N/A' }}</span>
              </div>
              <div>
                <span class="text-gray-600">{{ langService.t().phone }}:</span>
                <span class="ml-2 font-medium">{{ selectedOrder()?.phoneNumber }}</span>
              </div>
              <div class="md:col-span-2">
                <span class="text-gray-600">{{ langService.t().address }}:</span>
                <span class="ml-2 font-medium">{{ selectedOrder()?.address }}</span>
              </div>
            </div>
          </div>

          <!-- Order Items -->
          <div class="mb-4">
            <h4 class="font-semibold text-gray-900 mb-3">{{ langService.t().orderItems }}</h4>
            <div class="border rounded-lg overflow-hidden">
              <table class="w-full">
                <thead class="bg-gray-50">
                  <tr>
                    <th class="px-4 py-2 text-left text-xs font-medium text-gray-600">
                      {{ langService.t().product }}
                    </th>
                    <th class="px-4 py-2 text-right text-xs font-medium text-gray-600">
                      {{ langService.t().price }}
                    </th>
                    <th class="px-4 py-2 text-center text-xs font-medium text-gray-600">
                      {{ langService.t().qty }}
                    </th>
                    <th class="px-4 py-2 text-right text-xs font-medium text-gray-600">
                      {{ langService.t().subtotal }}
                    </th>
                  </tr>
                </thead>
                <tbody class="divide-y">
                  @for (item of selectedOrder()?.items || []; track item.id) {
                  <tr>
                    <td class="px-4 py-3 text-sm">{{ item.name }}</td>
                    <td class="px-4 py-3 text-sm text-right">{{ item.price }} EGP</td>
                    <td class="px-4 py-3 text-sm text-center">{{ item.quantity }}</td>
                    <td class="px-4 py-3 text-sm text-right font-medium">
                      {{ item.subtotal }} EGP
                    </td>
                  </tr>
                  }
                </tbody>
              </table>
            </div>
          </div>

          <!-- Order Summary -->
          <div class="bg-gray-50 rounded-lg p-4">
            <div class="flex justify-between items-center mb-2">
              <span class="text-gray-600">{{ langService.t().paymentMethod }}:</span>
              <span class="font-medium">{{ selectedOrder()?.paymentMethod }}</span>
            </div>
            <div class="flex justify-between items-center mb-2">
              <span class="text-gray-600">{{ langService.t().status }}:</span>
              <span
                class="badge"
                [class.badge-success]="selectedOrder()?.status === 'Completed'"
                [class.badge-warning]="selectedOrder()?.status === 'Pending'"
                [class.badge-danger]="selectedOrder()?.status === 'Cancelled'"
              >
                {{ selectedOrder()?.status }}
              </span>
            </div>
            <div class="border-t pt-2 mt-2">
              <div class="flex justify-between items-center">
                <span class="text-lg font-semibold">{{ langService.t().total }}:</span>
                <span class="text-lg font-bold text-primary-600"
                  >{{ selectedOrder()?.total }} EGP</span
                >
              </div>
            </div>
          </div>

          <!-- Actions -->
          <div class="flex gap-3 mt-6">
            <button (click)="closeDetailsModal()" class="btn-outline flex-1">
              {{ langService.t().close }}
            </button>
          </div>
        </div>
      </div>
      }
    </div>
  `,
})
export class OrdersComponent implements OnInit {
  private toastService = signal(inject(ToastService)).asReadonly();
  private orderService = signal(inject(OrderService)).asReadonly();
  langService = inject(LanguageService);

  orders = signal<OrderDto[]>([]);
  searchId = signal('');
  isLoading = signal(true);
  showDeleteModal = signal(false);
  showDetailsModal = signal(false);
  selectedOrder = signal<OrderDto | null>(null);

  filteredOrders = computed(() => {
    const term = this.searchId().toLowerCase();
    const allOrders = this.orders();

    if (!term) return allOrders;

    return allOrders.filter(
      (order) =>
        order.id.toString().includes(term) ||
        (order.customerName || '').toLowerCase().includes(term)
    );
  });

  ngOnInit() {
    this.loadOrders();
  }

  loadOrders() {
    this.isLoading.set(true);
    this.orderService()
      .getAllOrders()
      .subscribe({
        next: (orders) => {
          this.orders.set(orders);
          this.isLoading.set(false);
        },
        error: (error) => {
          console.error('Error loading orders:', error);
          this.toastService().error('Error', 'Failed to load orders');
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

  completeOrder(order: OrderDto) {
    this.orderService()
      .updateOrderStatus(order.id, 'Completed')
      .subscribe({
        next: () => {
          this.toastService().success('Success', `Order #${order.id} marked as completed`);
          this.loadOrders();
        },
        error: (error) => {
          console.error('Error updating order:', error);
          this.toastService().error('Error', 'Failed to update order status');
        },
      });
  }

  openDeleteModal(order: OrderDto) {
    this.selectedOrder.set(order);
    this.showDeleteModal.set(true);
  }

  closeDeleteModal() {
    this.showDeleteModal.set(false);
    this.selectedOrder.set(null);
  }

  confirmDelete() {
    const order = this.selectedOrder();
    if (!order) return;

    this.orderService()
      .deleteOrder(order.id)
      .subscribe({
        next: () => {
          this.toastService().success('Deleted', `Order #${order.id} has been deleted`);
          this.closeDeleteModal();
          this.loadOrders();
        },
        error: (error) => {
          console.error('Error deleting order:', error);
          this.toastService().error('Error', 'Failed to delete order');
          this.closeDeleteModal();
        },
      });
  }

  viewOrder(id: number) {
    const order = this.orders().find((o) => o.id === id);
    if (order) {
      this.selectedOrder.set(order);
      this.showDetailsModal.set(true);
    }
  }

  closeDetailsModal() {
    this.showDetailsModal.set(false);
  }

  exportData() {
    const rows = this.filteredOrders();
    if (!rows.length) {
      this.toastService().error('Export', 'No data to export');
      return;
    }

    const headers = ['ID', 'Customer', 'Total', 'Payment Method', 'Date', 'Status'];
    const csvBody = [
      headers,
      ...rows.map((o) => [
        String(o.id ?? ''),
        o.customerName ?? '',
        String(o.total ?? 0),
        o.paymentMethod ?? '',
        this.formatDateTime(o.createdAt) ?? '',
        o.status ?? '',
      ]),
    ]
      .map((row) => row.map((cell) => this.escapeCsv(cell)).join(','))
      .join('\n');

    const blob = new Blob(['\uFEFF' + csvBody], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'orders.csv';
    link.click();
    URL.revokeObjectURL(url);

    this.toastService().success('Export', 'Orders CSV downloaded');
  }

  private escapeCsv(value: string): string {
    const str = value ?? '';
    if (str.includes('"') || str.includes(',') || str.includes('\n')) {
      return `"${str.replace(/"/g, '""')}"`;
    }
    return str;
  }
}
