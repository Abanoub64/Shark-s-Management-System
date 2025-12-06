import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Product } from '../../core/models/product.model';
import { ProductCardComponent } from '../../components/store/product-card/product-card.component';
import { LanguageService } from '../../core/services/language.service';

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

        <!-- Product Grid -->
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          @for (product of products(); track product.id) {
          <app-product-card [product]="product"></app-product-card>
          }
        </div>

        <!-- Empty State -->
        @if (products().length === 0) {
        <div class="text-center py-12">
          <p class="text-gray-500">{{ t().noEmployeesFound }}</p>
          <!-- Using existing key or add generic 'noItems' -->
        </div>
        }
      </div>
    </div>
  `,
})
export class StoreComponent {
  private languageService = inject(LanguageService);
  t = this.languageService.t;

  // Mock Data
  products = signal<Product[]>([
    {
      id: '1',
      name: 'Premium Hair Wax',
      description: 'Strong hold with a matte finish. Perfect for textured styles.',
      price: 250,
      imageUrl:
        'https://images.unsplash.com/photo-1599305090598-fe179d501227?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
      category: 'Styling',
      inStock: true,
    },
    {
      id: '2',
      name: 'Beard Oil',
      description: 'Nourishing oil for a soft and healthy beard. Sandalwood scent.',
      price: 180,
      imageUrl:
        'https://images.unsplash.com/photo-1626285861696-9f0bf5a49c6d?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
      category: 'Beard Care',
      inStock: true,
    },
    {
      id: '3',
      name: 'Professional Comb Set',
      description: 'Anti-static carbon fiber combs for precise styling.',
      price: 120,
      imageUrl:
        'https://images.unsplash.com/photo-1616391182219-e080b4d1043a?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
      category: 'Tools',
      inStock: true,
    },
    {
      id: '4',
      name: 'Shaving Cream',
      description: 'Rich lather for a smooth and comfortable shave.',
      price: 150,
      imageUrl:
        'https://images.unsplash.com/photo-1629198729587-c1a1793d9396?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
      category: 'Shaving',
      inStock: false,
    },
  ]);
}
