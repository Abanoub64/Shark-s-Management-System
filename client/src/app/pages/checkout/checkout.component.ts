import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CartService } from '../../core/services/cart.service';
import { OrderService } from '../../core/services/order.service';
import { AuthService } from '../../core/services/auth.service';
import { CreateOrderRequest, OrderItemDto } from '../../core/models/order.model';

declare var paypal: any;

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="container mx-auto px-4 py-8">
      <h1 class="text-3xl font-bold mb-8">Checkout</h1>

      @if (cartService.items().length === 0) {
      <div class="text-center py-16">
        <p class="text-gray-600 mb-4">Your cart is empty</p>
        <a routerLink="/store" class="text-primary-600 hover:underline">Continue Shopping</a>
      </div>
      } @else {
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <!-- Order Summary -->
        <div>
          <h2 class="text-2xl font-bold mb-4">Order Summary</h2>
          <div class="bg-white rounded-lg shadow-md p-6">
            <!-- Contact Info Preview -->
            <div class="mb-6 pb-6 border-b">
              <h3 class="font-semibold text-gray-900 mb-2">Shipping Details</h3>
              <p class="text-gray-600">
                <span class="font-medium">Phone:</span> {{ cartService.checkoutPhone() }}
              </p>
              <p class="text-gray-600">
                <span class="font-medium">Address:</span> {{ cartService.checkoutAddress() }}
              </p>
            </div>

            @for (item of cartService.items(); track item.productId) {
            <div class="flex justify-between mb-3 pb-3 border-b">
              <div>
                <p class="font-medium">{{ item.productName }}</p>
                <p class="text-sm text-gray-500">Qty: {{ item.quantity }} × {{ item.price }} EGP</p>
              </div>
              <p class="font-semibold">{{ item.price * item.quantity }} EGP</p>
            </div>
            }
            <div class="mt-4 pt-4 border-t">
              <div class="flex justify-between text-xl font-bold">
                <span>Total</span>
                <span>{{ cartService.totalPrice() }} EGP</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Payment -->
        <div>
          <h2 class="text-2xl font-bold mb-4">Payment Method</h2>
          <div class="bg-white rounded-lg shadow-md p-6">
            <!-- Payment Method Selection -->
            <div class="space-y-4 mb-6">
              <label
                class="flex items-center p-4 border rounded-lg cursor-pointer transition hover:bg-gray-50"
                [class.border-primary-500]="selectedPaymentMethod() === 'PayPal'"
                [class.ring-1]="selectedPaymentMethod() === 'PayPal'"
                [class.ring-primary-500]="selectedPaymentMethod() === 'PayPal'"
              >
                <input
                  type="radio"
                  name="paymentMethod"
                  value="PayPal"
                  [ngModel]="selectedPaymentMethod()"
                  (ngModelChange)="selectedPaymentMethod.set($event)"
                  class="w-4 h-4 text-primary-600 focus:ring-primary-500"
                />
                <span class="ml-3 font-medium">PayPal</span>
                <span class="ml-auto text-sm text-gray-500">Credit Card, Debit Card</span>
              </label>

              <label
                class="flex items-center p-4 border rounded-lg cursor-pointer transition hover:bg-gray-50"
                [class.border-primary-500]="selectedPaymentMethod() === 'Cash'"
                [class.ring-1]="selectedPaymentMethod() === 'Cash'"
                [class.ring-primary-500]="selectedPaymentMethod() === 'Cash'"
              >
                <input
                  type="radio"
                  name="paymentMethod"
                  value="Cash"
                  [ngModel]="selectedPaymentMethod()"
                  (ngModelChange)="selectedPaymentMethod.set($event)"
                  class="w-4 h-4 text-primary-600 focus:ring-primary-500"
                />
                <span class="ml-3 font-medium">Cash on Delivery</span>
                <span class="ml-auto text-sm text-gray-500">Pay when you receive</span>
              </label>
            </div>

            @if (isProcessing()) {
            <div class="text-center py-8">
              <div
                class="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"
              ></div>
              <p class="mt-4 text-gray-600">Processing payment...</p>
            </div>
            } @else {
            <!-- PayPal Container -->
            <div [hidden]="selectedPaymentMethod() !== 'PayPal'" id="paypal-button-container"></div>

            <!-- Cash Button -->
            @if (selectedPaymentMethod() === 'Cash') {
            <button
              (click)="placeCashOrder()"
              class="w-full bg-green-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-green-700 transition"
            >
              Place Order ({{ cartService.totalPrice() }} EGP)
            </button>
            } }
          </div>
        </div>
      </div>
      }
    </div>
  `,
})
export class CheckoutComponent implements OnInit {
  cartService = inject(CartService);
  private orderService = inject(OrderService);
  private authService = inject(AuthService);
  private router = inject(Router);

  isProcessing = signal(false);
  selectedPaymentMethod = signal<'PayPal' | 'Cash'>('PayPal');

  ngOnInit() {
    if (this.cartService.items().length > 0) {
      this.loadPayPalScript();
    }
  }

  private loadPayPalScript() {
    const script = document.createElement('script');
    script.src = `https://www.paypal.com/sdk/js?client-id=Af4urSLoWfjiONwfyEPkIA562T3mLNAoZYYPH9FVYPCODTikgx4dGMbsT3jm1i4brzV3JTRL8CTl_c1Z&currency=USD`;
    script.onload = () => this.initializePayPal();
    document.body.appendChild(script);
  }

  private initializePayPal() {
    const totalInUSD = (this.cartService.totalPrice() / 50).toFixed(2); // Convert EGP to USD (approximate rate)

    paypal
      .Buttons({
        createOrder: (data: any, actions: any) => {
          return actions.order.create({
            purchase_units: [
              {
                amount: {
                  value: totalInUSD,
                  currency_code: 'USD',
                },
                description: 'BarberShop Products',
              },
            ],
          });
        },
        onApprove: (data: any, actions: any) => {
          return actions.order.capture().then((details: any) => {
            this.handleOrderCreation('PayPal');
          });
        },
        onError: (err: any) => {
          console.error('PayPal Error:', err);
          alert('Payment failed. Please try again.');
          this.isProcessing.set(false);
        },
      })
      .render('#paypal-button-container');
  }

  placeCashOrder() {
    if (confirm('Place order with Cash on Delivery?')) {
      this.handleOrderCreation('Cash');
    }
  }

  private handleOrderCreation(paymentMethod: string) {
    this.isProcessing.set(true);

    // Create order for backend
    const orderItems: OrderItemDto[] = this.cartService.items().map((item) => ({
      productId: item.productId,
      name: item.productName,
      quantity: item.quantity,
      price: item.price,
    }));

    // Get actual user ID from AuthService
    const userId = this.authService.userId || this.authService.currentUser()?.id || 'guest';

    const order: CreateOrderRequest = {
      userId: userId,
      phoneNumber: this.cartService.checkoutPhone(),
      address: this.cartService.checkoutAddress(),
      paymentMethod: paymentMethod,
      items: orderItems,
    };

    // Send order to backend
    this.orderService.createOrder(order).subscribe({
      next: (createdOrder) => {
        console.log('Order created:', createdOrder);
        this.cartService.clearCart();

        const message =
          paymentMethod === 'PayPal'
            ? `Payment successful! Order ID: ${createdOrder.id || 'N/A'}`
            : `Order placed successfully! Order ID: ${
                createdOrder.id || 'N/A'
              }. Pay cash on delivery.`;

        alert(message);
        this.router.navigate(['/my-history']);
      },
      error: (error) => {
        console.error('Error creating order:', error);
        alert('Error saving your order. Please contact support.');
        this.isProcessing.set(false);
      },
    });
  }
}
