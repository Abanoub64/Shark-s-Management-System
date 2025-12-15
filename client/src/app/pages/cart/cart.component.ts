import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CartService } from '../../core/services/cart.service';
import { LanguageService } from '../../core/services/language.service';
import { AuthService } from '../../core/services/auth.service';
import { ToastService } from '../../core/services/toast.service';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  template: `
    <div class="min-h-screen bg-white py-12">
      <div class="container mx-auto px-4">
        <h1 class="text-4xl font-bold mb-8 text-black font-serif border-b border-gray-100 pb-4">
          {{ t().shoppingCart }}
        </h1>

        @if (cartService.items().length === 0) {
        <!-- Empty Cart -->
        <div class="text-center py-20 bg-gray-50 rounded-3xl border border-gray-100">
          <div class="text-6xl mb-4">🛒</div>
          <p class="text-gray-500 mb-6 text-lg">{{ t().addProductsMsg }}</p>
          <a
            routerLink="/store"
            class="inline-block bg-black text-white px-8 py-3 rounded-full font-bold hover:bg-secondary hover:text-black transition-colors duration-300 shadow-lg"
          >
            {{ t().continueShopping }}
          </a>
        </div>
        } @else {
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <!-- Cart Items -->
          <div class="lg:col-span-2">
            <div class="flex items-center justify-between mb-6">
              <h2 class="text-2xl font-bold text-black flex items-center gap-2">
                <span class="text-secondary">01.</span> {{ t().shoppingCart }}
              </h2>
              <button (click)="clearCart()" class="text-red-500 text-sm hover:underline">
                {{ t().clearCart }}
              </button>
            </div>

            <div class="space-y-4">
              @for (item of cartService.items(); track item.productId) {
              <div class="bg-gray-50 rounded-3xl p-4 border border-gray-100 shadow-sm flex gap-4">
                <!-- Product Image -->
                <img
                  [src]="
                    item.image ||
                    'https://st4.depositphotos.com/16122460/21586/i/1600/depositphotos_215866804-stock-photo-flat-lay-composition-hair-salon.jpg'
                  "
                  loading="lazy"
                  [alt]="item.productName"
                  (error)="$event.target['src'] = 'assets/product-placeholder.svg'"
                  class="w-20 h-20 object-cover rounded-2xl bg-white"
                />

                <!-- Product Details -->
                <div class="flex-1">
                  <h3 class="text-lg font-bold text-black">{{ item.productName }}</h3>
                  <p class="text-gray-500 text-sm">{{ item.price }} {{ t().currency }}</p>

                  <!-- Quantity Controls -->
                  <div class="flex items-center gap-3 mt-3">
                    <button
                      (click)="updateQuantity(item.productId, item.quantity - 1)"
                      class="w-8 h-8 flex items-center justify-center bg-white border border-gray-200 rounded-lg hover:border-gray-300"
                      [disabled]="item.quantity <= 1"
                    >
                      −
                    </button>
                    <span class="font-semibold text-black">{{ item.quantity }}</span>
                    <button
                      (click)="updateQuantity(item.productId, item.quantity + 1)"
                      class="w-8 h-8 flex items-center justify-center bg-white border border-gray-200 rounded-lg hover:border-gray-300"
                      [disabled]="item.quantity >= (item.stock || 99)"
                    >
                      +
                    </button>
                  </div>
                </div>

                <!-- Subtotal and Remove -->
                <div class="text-right">
                  <p class="text-lg font-bold text-black">
                    {{ item.price * item.quantity }} {{ t().currency }}
                  </p>
                  <button
                    (click)="removeItem(item.productId)"
                    class="mt-2 text-red-600 hover:text-red-800 text-sm"
                  >
                    {{ t().remove }}
                  </button>
                </div>
              </div>
              }
            </div>
          </div>

          <!-- Order Summary -->
          <div>
            <div class="bg-gray-50 rounded-3xl p-8 border border-gray-100 shadow-sm sticky top-24">
              <h2 class="text-2xl font-bold mb-6 text-black flex items-center gap-2">
                <span class="text-secondary">02.</span> {{ t().orderSummary }}
              </h2>

              <div class="space-y-4 mb-6">
                <!-- Contact Info Inputs -->
                <div>
                  <label class="block text-xs text-gray-500 uppercase tracking-widest mb-2">{{
                    t().phoneNumberLabel
                  }}</label>
                  <input
                    type="tel"
                    [(ngModel)]="phone"
                    (ngModelChange)="onInfoChange()"
                    placeholder="01xxxxxxxxx"
                    class="w-full px-3 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  />
                </div>

                <div>
                  <label class="block text-xs text-gray-500 uppercase tracking-widest mb-2">{{
                    t().shippingAddress
                  }}</label>
                  <textarea
                    [(ngModel)]="address"
                    (ngModelChange)="onInfoChange()"
                    [placeholder]="t().scAddressPlaceholder"
                    rows="3"
                    class="w-full px-3 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  ></textarea>
                </div>

                <div class="pt-4 border-t border-gray-200">
                  <div class="flex justify-between mb-2 text-gray-600 text-sm">
                    <span
                      >{{ t().subtotal }} ({{ cartService.totalItems() }}
                      {{ t().itemsCount }})</span
                    >
                    <span>{{ cartService.totalPrice() }} {{ t().currency }}</span>
                  </div>
                  <div class="flex justify-between items-center text-2xl font-bold text-black">
                    <span>{{ t().total }}</span>
                    <span>
                      {{ cartService.totalPrice() }}
                      <span class="text-secondary text-lg">{{ t().currency }}</span>
                    </span>
                  </div>
                </div>
              </div>

              <div class="flex flex-col gap-3">
                <button
                  (click)="proceedToCheckout()"
                  [disabled]="!isValid()"
                  [class.opacity-50]="!isValid()"
                  [class.cursor-not-allowed]="!isValid()"
                  class="block w-full bg-black text-white text-center px-6 py-3 rounded-full hover:bg-secondary hover:text-black transition-colors duration-300 font-bold shadow-lg"
                >
                  {{ t().proceedToCheckout }}
                </button>

                <a
                  routerLink="/store"
                  class="block w-full border border-gray-200 text-center text-gray-700 px-6 py-3 rounded-full hover:bg-gray-100 transition-colors duration-300 font-medium"
                >
                  {{ t().continueShopping }}
                </a>
              </div>
            </div>
          </div>
        </div>
        }
      </div>
    </div>
  `,
})
export class CartComponent implements OnInit {
  cartService = inject(CartService);
  langService = inject(LanguageService);
  private router = inject(Router);
  private authService = inject(AuthService);
  private toastService = inject(ToastService);
  t = this.langService.t;

  phone = '';
  address = '';

  ngOnInit() {
    this.phone = this.cartService.checkoutPhone();
    this.address = this.cartService.checkoutAddress();
  }

  onInfoChange() {
    this.cartService.updateCheckoutInfo(this.phone, this.address);
  }

  isValid() {
    return this.phone.trim().length > 0 && this.address.trim().length > 0;
  }

  proceedToCheckout() {
    if (this.isValid()) {
      if (this.authService.isAuthenticated) {
        this.router.navigate(['/checkout']);
      } else {
        this.router.navigate(['/auth/login'], {
          queryParams: { returnUrl: '/checkout' },
        });
      }
    }
  }

  updateQuantity(productId: number, newQuantity: number) {
    this.cartService.updateQuantity(productId, newQuantity);
  }

  removeItem(productId: number) {
    this.cartService.removeFromCart(productId);
    this.toastService.success(this.t().success, this.t().itemRemoved);
  }

  clearCart() {
    this.cartService.clearCart();
    this.toastService.success(this.t().success, this.t().cartCleared);
  }
}
