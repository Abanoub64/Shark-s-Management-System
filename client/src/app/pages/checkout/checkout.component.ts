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
    <div class="min-h-screen bg-white py-12">
      <div class="container mx-auto px-4">
        <h1 class="text-4xl font-bold mb-8 text-black font-serif border-b border-gray-100 pb-4">
          Checkout
        </h1>

        @if (cartService.items().length === 0) {
        <div class="text-center py-20 bg-gray-50 rounded-3xl border border-gray-100">
          <div class="text-6xl mb-4">🛒</div>
          <p class="text-gray-500 mb-6 text-lg">Your cart is empty</p>
          <a
            routerLink="/store"
            class="inline-block bg-black text-white px-8 py-3 rounded-full font-bold hover:bg-secondary hover:text-black transition-colors duration-300 shadow-lg"
          >
            Continue Shopping
          </a>
        </div>
        } @else {
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <!-- Order Summary -->
          <div class="lg:col-span-2">
            <h2 class="text-2xl font-bold mb-6 text-black flex items-center gap-2">
              <span class="text-secondary">01.</span> Order Summary
            </h2>
            <div class="bg-gray-50 rounded-3xl p-8 border border-gray-100 shadow-sm">
              <!-- Contact Info Preview -->
              <div class="mb-8 pb-8 border-b border-gray-200">
                <h3 class="font-bold text-gray-900 mb-4 uppercase tracking-wider text-sm">
                  Shipping Details
                </h3>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div class="bg-white p-4 rounded-xl border border-gray-100">
                    <span class="block text-xs text-gray-400 uppercase tracking-widest mb-1"
                      >Phone</span
                    >
                    <span class="font-medium text-black">{{ cartService.checkoutPhone() }}</span>
                  </div>
                  <div class="bg-white p-4 rounded-xl border border-gray-100">
                    <span class="block text-xs text-gray-400 uppercase tracking-widest mb-1"
                      >Address</span
                    >
                    <span class="font-medium text-black">{{ cartService.checkoutAddress() }}</span>
                  </div>
                </div>
              </div>

              <div class="space-y-4">
                @for (item of cartService.items(); track item.productId) {
                <div
                  class="flex items-center justify-between bg-white p-4 rounded-xl border border-gray-100"
                >
                  <div class="flex items-center gap-4">
                    <div
                      class="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center text-xl"
                    >
                      🛍️
                    </div>
                    <div>
                      <p class="font-bold text-black">{{ item.productName }}</p>
                      <p class="text-sm text-gray-500">
                        Qty: {{ item.quantity }} × {{ item.price }} EGP
                      </p>
                    </div>
                  </div>
                  <p class="font-bold text-lg text-black">
                    {{ item.price * item.quantity }} <span class="text-sm text-gray-400">EGP</span>
                  </p>
                </div>
                }
              </div>

              <div class="mt-8 pt-6 border-t border-gray-200">
                <div class="flex justify-between items-end">
                  <span class="text-gray-500 font-medium">Total Amount</span>
                  <span class="text-3xl font-bold text-black font-serif"
                    >{{ cartService.totalPrice() }}
                    <span class="text-secondary text-lg">EGP</span></span
                  >
                </div>
              </div>
            </div>
          </div>

          <!-- Payment -->
          <div>
            <h2 class="text-2xl font-bold mb-6 text-black flex items-center gap-2">
              <span class="text-secondary">02.</span> Payment
            </h2>
            <div class="bg-gray-50 rounded-3xl p-8 border border-gray-100 shadow-sm sticky top-24">
              <!-- Payment Method Selection -->
              <div class="space-y-4 mb-8">
                <label
                  class="flex items-center p-4 border rounded-xl cursor-pointer transition-all duration-300"
                  [class.border-secondary]="selectedPaymentMethod() === 'PayPal'"
                  [class.bg-white]="selectedPaymentMethod() === 'PayPal'"
                  [class.shadow-md]="selectedPaymentMethod() === 'PayPal'"
                  [class.border-gray-200]="selectedPaymentMethod() !== 'PayPal'"
                >
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="PayPal"
                    [ngModel]="selectedPaymentMethod()"
                    (ngModelChange)="selectedPaymentMethod.set($event)"
                    class="w-5 h-5 text-secondary focus:ring-secondary border-gray-300"
                  />
                  <div class="ml-3">
                    <span class="block font-bold text-black">PayPal</span>
                    <span class="block text-xs text-gray-500">Credit / Debit Card</span>
                  </div>
                </label>

                <label
                  class="flex items-center p-4 border rounded-xl cursor-pointer transition-all duration-300"
                  [class.border-secondary]="selectedPaymentMethod() === 'Cash'"
                  [class.bg-white]="selectedPaymentMethod() === 'Cash'"
                  [class.shadow-md]="selectedPaymentMethod() === 'Cash'"
                  [class.border-gray-200]="selectedPaymentMethod() !== 'Cash'"
                >
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="Cash"
                    [ngModel]="selectedPaymentMethod()"
                    (ngModelChange)="selectedPaymentMethod.set($event)"
                    class="w-5 h-5 text-secondary focus:ring-secondary border-gray-300"
                  />
                  <div class="ml-3">
                    <span class="block font-bold text-black">Cash on Delivery</span>
                    <span class="block text-xs text-gray-500">Pay when received</span>
                  </div>
                </label>
              </div>

              @if (isProcessing()) {
              <div class="text-center py-8">
                <div
                  class="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-secondary"
                ></div>
                <p class="mt-4 text-gray-600 font-medium">Processing payment...</p>
              </div>
              } @else {
              <!-- PayPal Container -->
              <div
                [hidden]="selectedPaymentMethod() !== 'PayPal'"
                id="paypal-button-container"
                class="mb-4"
              ></div>

              <!-- Cash Button -->
              @if (selectedPaymentMethod() === 'Cash') {
              <button
                (click)="placeCashOrder()"
                class="w-full bg-gradient-to-r from-secondary to-yellow-500 text-black font-bold py-4 px-6 rounded-xl hover:shadow-lg hover:scale-[1.02] transition-all duration-300 shadow-md shadow-yellow-500/20"
              >
                Place Order ({{ cartService.totalPrice() }} EGP)
              </button>
              } }
            </div>
          </div>
        </div>
        }
      </div>
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
