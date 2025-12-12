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
    <div class="min-h-screen bg-white pt-24 pb-12">
      <div class="container mx-auto px-4 sm:px-6 lg:px-8">
        <!-- Header -->
        <div class="mb-12 text-center sm:text-left border-b border-gray-100 pb-8">
          <h1 class="text-4xl sm:text-5xl font-bold text-black font-serif tracking-tight mb-3">
            <span class="text-secondary">Sharks</span> {{ t().store }}
          </h1>
          <p class="text-lg text-gray-500 max-w-2xl font-light">
            {{ t().products }}
          </p>
        </div>

        <!-- Loading State -->
        @if (isLoading()) {
        <div class="text-center py-20">
          <div
            class="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-secondary mb-4"
          ></div>
          <p class="text-gray-500">Loading products...</p>
        </div>
        }

        <!-- Product Grid -->
        @if (!isLoading() && products().length > 0) {
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          @for (product of products(); track product.id) {
          <app-product-card [product]="product"></app-product-card>
          }
        </div>
        }

        <!-- Empty State -->
        @if (!isLoading() && products().length === 0) {
        <div class="text-center py-20 bg-gray-50 rounded-3xl border border-gray-100">
          <p class="text-gray-400 text-lg">No products available at the moment</p>
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
