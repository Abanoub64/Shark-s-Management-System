import { Component, Input, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Product } from '../../../core/models/product.model';
import { LanguageService } from '../../../core/services/language.service';

@Component({
  selector: 'app-product-card',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div
      class="bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group h-full flex flex-col"
    >
      <!-- Product Image -->
      <div class="relative h-48 overflow-hidden">
        <img
          [src]="product.imageUrl"
          [alt]="product.name"
          class="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
        />
        <div class="absolute top-2 right-2">
          <span
            class="px-2 py-1 text-xs font-semibold rounded-full"
            [ngClass]="product.inStock ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'"
          >
            {{ product.inStock ? t().inStock : t().outOfStock }}
          </span>
        </div>
      </div>

      <!-- Content -->
      <div class="p-4 flex-1 flex flex-col">
        <div class="flex-1">
          <h3 class="text-lg font-bold text-gray-900 dark:text-white mb-1">{{ product.name }}</h3>
          <p class="text-sm text-gray-500 dark:text-gray-400 line-clamp-2 mb-3">
            {{ product.description }}
          </p>
        </div>

        <div class="mt-4 flex items-center justify-between">
          <div class="flex flex-col">
            <span class="text-xs text-gray-500">{{ t().price }}</span>
            <span class="text-xl font-bold text-primary-600 dark:text-primary-400">
              {{ product.price }} {{ t().currency }}
            </span>
          </div>

          <button
            [disabled]="!product.inStock"
            class="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg shadow-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
              />
            </svg>
            <span class="hidden sm:inline">{{ t().addToCart }}</span>
          </button>
        </div>
      </div>
    </div>
  `,
})
export class ProductCardComponent {
  @Input({ required: true }) product!: Product;

  private languageService = inject(LanguageService);
  t = this.languageService.t;
}
