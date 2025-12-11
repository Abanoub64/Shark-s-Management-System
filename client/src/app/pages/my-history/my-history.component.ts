import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserService } from '../../core/services/user.service';
import { AuthService } from '../../core/services/auth.service';
import { OrderDto } from '../../core/models/order.model';
import { BookingDto, BookingStatus } from '../../core/models/models';

@Component({
  selector: 'app-my-history',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="container mx-auto px-4 py-8">
      <h1 class="text-3xl font-bold mb-8">My History</h1>

      <!-- Tabs -->
      <div class="flex gap-4 mb-8 border-b">
        <button
          (click)="activeTab.set('bookings')"
          [class.border-primary-600]="activeTab() === 'bookings'"
          [class.text-primary-600]="activeTab() === 'bookings'"
          class="pb-2 px-4 font-medium border-b-2 transition"
        >
          My Bookings
        </button>
        <button
          (click)="activeTab.set('orders')"
          [class.border-primary-600]="activeTab() === 'orders'"
          [class.text-primary-600]="activeTab() === 'orders'"
          class="pb-2 px-4 font-medium border-b-2 border-transparent transition"
        >
          My Orders
        </button>
      </div>

      <!-- Bookings Tab -->
      @if (activeTab() === 'bookings') {
      <div>
        @if (isLoadingBookings()) {
        <p class="text-gray-500">Loading bookings...</p>
        } @else if (bookings().length === 0) {
        <div class="text-center py-16">
          <p class="text-gray-600">You have no bookings yet</p>
        </div>
        } @else {
        <div class="space-y-4">
          @for (booking of bookings(); track booking.id) {
          <div class="bg-white rounded-lg shadow-md p-6">
            <div class="flex justify-between items-start">
              <div>
                <h3 class="text-lg font-semibold">
                  Service: {{ booking.serviceName || booking.serviceId }}
                </h3>
                <p class="text-gray-600 mt-1">Date: {{ booking.startAt | date : 'medium' }}</p>
                <p class="text-gray-600">Branch: {{ booking.branchId }}</p>
                <p class="text-gray-600">Barber: {{ booking.barberName || booking.barberId }}</p>
                <!-- Note: BookingDto doesn't have totalAmount/price strictly in spec except servicePrice.
                     Using servicePrice or checking if paymentStatus is Paid. -->
                <p class="text-gray-600">Amount: {{ booking.servicePrice }} EGP</p>
              </div>
              <span
                class="px-3 py-1 rounded-full text-sm font-medium"
                [ngClass]="{
                  'bg-green-100 text-green-800':
                    booking.status === 'Confirmed' || booking.status === BookingStatus.CONFIRMED,
                  'bg-yellow-100 text-yellow-800':
                    booking.status === 'Pending' || booking.status === BookingStatus.PENDING,
                  'bg-gray-100 text-gray-800':
                    booking.status === 'Completed' || booking.status === BookingStatus.COMPLETED,
                  'bg-red-100 text-red-800':
                    booking.status === 'Cancelled' || booking.status === BookingStatus.CANCELLED
                }"
              >
                {{ booking.status }}
              </span>
            </div>
          </div>
          }
        </div>
        }
      </div>
      }

      <!-- Orders Tab -->
      @if (activeTab() === 'orders') {
      <div>
        @if (isLoadingOrders()) {
        <p class="text-gray-500">Loading orders...</p>
        } @else if (orders().length === 0) {
        <div class="text-center py-16">
          <p class="text-gray-600">You have no orders yet</p>
        </div>
        } @else {
        <div class="space-y-4">
          @for (order of orders(); track order.id) {
          <div class="bg-white rounded-lg shadow-md p-6">
            <div class="flex justify-between items-start mb-4">
              <div>
                <h3 class="text-lg font-semibold">Order #{{ order.id }}</h3>
                <p class="text-gray-600">{{ order.createdAt | date : 'medium' }}</p>
              </div>
              <div class="text-right">
                <p class="text-xl font-bold">{{ order.total }} EGP</p>
                <span
                  class="inline-block mt-1 px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm"
                >
                  {{ order.status }}
                </span>
              </div>
            </div>

            <!-- Order Items -->
            <div class="border-t pt-4 space-y-2">
              @for (item of order.items; track item.productId) {
              <div class="flex justify-between text-sm">
                <span>{{ item.name }} × {{ item.quantity }}</span>
                <span>{{ item.price * item.quantity }} EGP</span>
              </div>
              }
            </div>
          </div>
          }
        </div>
        }
      </div>
      }
    </div>
  `,
})
export class MyHistoryComponent implements OnInit {
  private userService = inject(UserService);
  private authService = inject(AuthService);

  // Expose BookingStatus enum to template
  BookingStatus = BookingStatus;

  activeTab = signal<'bookings' | 'orders'>('bookings');
  orders = signal<OrderDto[]>([]);
  bookings = signal<BookingDto[]>([]);
  isLoadingOrders = signal(false);
  isLoadingBookings = signal(false);

  ngOnInit() {
    this.loadUserHistory();
  }

  loadUserHistory() {
    const userId = this.authService.userId;

    if (!userId) {
      console.error('No user ID found');
      return;
    }

    this.isLoadingBookings.set(true);
    this.isLoadingOrders.set(true);

    this.userService.getUserHistory(userId).subscribe({
      next: (data) => {
        this.orders.set(data.orders || []);
        this.bookings.set(data.bookings || []);
        this.isLoadingBookings.set(false);
        this.isLoadingOrders.set(false);
      },
      error: (error: any) => {
        console.error('Error loading user history:', error);
        this.isLoadingBookings.set(false);
        this.isLoadingOrders.set(false);
      },
    });
  }
}
