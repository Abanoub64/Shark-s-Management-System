import { Component, inject, signal, computed, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { Product } from '../../core/models/product.model';
import { ProductCardComponent } from '../../components/store/product-card/product-card.component';
import { LanguageService } from '../../core/services/language.service';
import { ProductService } from '../../core/services/product.service';
import { UiSkeletonComponent } from '../../components/shared/ui-skeleton.component';
import { UiInputComponent } from '../../components/shared/ui-input.component';

@Component({
  selector: 'app-store',
  standalone: true,
  imports: [CommonModule, ProductCardComponent, UiSkeletonComponent, UiInputComponent, ReactiveFormsModule],
  template: `
    <div class="min-h-screen bg-white pt-24 pb-12">
      <div class="container mx-auto px-4 sm:px-6 lg:px-8">
        <!-- Header -->
        <div class="mb-8 text-center sm:text-left border-b border-gray-100 pb-8 flex flex-col md:flex-row justify-between items-end gap-6">
          <div>
            <h1 class="text-4xl sm:text-5xl font-bold text-black font-serif tracking-tight mb-3">
              <span class="text-secondary">Sharks</span> {{ t().store }}
            </h1>
            <p class="text-lg text-gray-500 max-w-2xl font-light">
              {{ t().products }}
            </p>
          </div>
          
          <!-- Search Bar -->
          <div class="w-full md:w-96">
            <app-ui-input
              [formControl]="searchControl"
              [placeholder]="t().searchProductsPlaceholder"
            >
              <span icon class="text-gray-400">
                <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </span>
            </app-ui-input>
          </div>
        </div>

        <!-- Loading State -->
        @if (isLoading()) {
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          @for (item of [1, 2, 3, 4, 5, 6, 7, 8]; track item) {
          <div
            class="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm h-[400px]"
          >
            <app-ui-skeleton height="250px" width="100%"></app-ui-skeleton>
            <div class="p-4 space-y-3">
              <app-ui-skeleton height="24px" width="80%"></app-ui-skeleton>
              <app-ui-skeleton height="20px" width="60%"></app-ui-skeleton>
              <div class="flex justify-between items-center pt-2">
                <app-ui-skeleton height="24px" width="30%"></app-ui-skeleton>
                <app-ui-skeleton
                  height="36px"
                  width="40%"
                  className="rounded-full"
                ></app-ui-skeleton>
              </div>
            </div>
          </div>
          }
        </div>
        }

        <!-- Product Grid -->
        @if (!isLoading() && filteredProducts().length > 0) {
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 animate-in fade-in duration-500">
          @for (product of filteredProducts(); track product.id) {
          <app-product-card [product]="product"></app-product-card>
          }
        </div>
        }

        <!-- Empty State -->
        @if (!isLoading() && filteredProducts().length === 0) {
        <div class="text-center py-20 bg-gray-50 rounded-3xl border border-gray-100 animate-in zoom-in-95 duration-300">
          <div class="mb-4 text-gray-300">
             <svg xmlns="http://www.w3.org/2000/svg" class="w-16 h-16 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
               <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
             </svg>
          </div>
          <p class="text-gray-500 text-lg font-medium">No products found matching your search.</p>
          <button (click)="searchControl.setValue('')" class="mt-4 text-primary hover:underline">
            Clear search
          </button>
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
  private loadingTimeout?: number;

  searchControl = new FormControl('');

  filteredProducts = computed(() => {
    const query = this.searchControl.value?.toLowerCase() || '';
    const allProducts = this.products();

    if (!query) return allProducts;

    return allProducts.filter(product =>
      product.name.toLowerCase().includes(query) ||
      product.description?.toLowerCase().includes(query)
    );
  });

  ngOnInit() {
    this.loadProducts();
  }

  loadProducts() {
    // Only show loading skeleton if response takes more than 200ms
    this.loadingTimeout = window.setTimeout(() => {
      this.isLoading.set(true);
    }, 200);

    this.productService.getProducts().subscribe({
      next: (products) => {
        clearTimeout(this.loadingTimeout);
        this.products.set(products);
        this.isLoading.set(false);
      },
      error: (error) => {
        clearTimeout(this.loadingTimeout);
        console.error('Error loading products:', error);
        this.isLoading.set(false);
      },
    });
  }
}
