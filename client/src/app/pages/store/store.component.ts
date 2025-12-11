import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Product } from '../../core/models/product.model';
import { ProductCardComponent } from '../../components/store/product-card/product-card.component';
import { LanguageService } from '../../core/services/language.service';
import { ProductService } from '../../core/services/product.service';

@Component({
  selector: 'app-store',
  standalone: true,
  imports: [CommonModule, ProductCardComponent],
  template: `
    <div
      class="min-h-screen bg-gray-50 dark:bg-gray-900 pt-20 pb-12 transition-colors duration-300"
    >
      <div class="container mx-auto px-4 sm:px-6 lg:px-8">
        <!-- Header -->
        <div class="mb-8 text-center sm:text-left">
          <h1
            class="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight"
          >
            {{ t().store }}
          </h1>
          <p class="mt-2 text-lg text-gray-500 dark:text-gray-400">
            {{ t().products }}
          </p>
        </div>

        <!-- Filters (Placeholder for future) -->
        <!-- <div class="mb-6 flex gap-2 overflow-x-auto pb-2">
           ... filters ...
        </div> -->

        <!-- Loading State -->
        @if (isLoading()) {
        <div class="text-center py-12">
          <p class="text-gray-500">Loading products...</p>
        </div>
        }

        <!-- Product Grid -->
        @if (!isLoading() && products().length > 0) {
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          @for (product of products(); track product.id) {
          <app-product-card [product]="product"></app-product-card>
          }
        </div>
        }

        <!-- Empty State -->
        @if (!isLoading() && products().length === 0) {
        <div class="text-center py-12">
          <p class="text-gray-500">No products available at the moment</p>
        </div>
        }
      </div>
    </div>
  `,
})
export class StoreComponent implements OnInit {
  private languageService = inject(LanguageService);
  private productService = inject(ProductService);
  t = this.languageService.t;

  products = signal<Product[]>([]);
  isLoading = signal(false);

  ngOnInit() {
    this.loadProducts();
  }

  loadProducts() {
    this.isLoading.set(true);
    this.productService.getProducts().subscribe({
      next: (products) => {
        this.products.set(products);
        this.isLoading.set(false);
      },
      error: (error) => {
        console.error('Error loading products:', error);
        this.isLoading.set(false);
      },
    });
  }
}
