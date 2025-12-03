import { Component, inject, input, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { BranchService } from '../../../core/services/branch.service';
import { UiButtonComponent } from '../../../components/shared/ui-button.component';
import { UiCardComponent } from '../../../components/shared/ui-card.component';

@Component({
  selector: 'app-branch-detail',
  standalone: true,
  imports: [CommonModule, RouterLink, UiButtonComponent, UiCardComponent],
  template: `
    @if (branch() | async; as branch) {
    <div class="bg-white border-b border-gray-200">
      <div class="container mx-auto px-4 py-8">
        <div class="flex flex-col md:flex-row gap-8 items-start">
          <div class="w-full md:w-1/3">
            <img
              [src]="branch.image"
              [alt]="branch.name"
              class="w-full h-64 object-cover rounded-lg shadow-md"
            />
          </div>
          <div class="flex-1">
            <h1 class="text-3xl font-bold mb-2">{{ branch.name }}</h1>
            <p class="text-gray-500 mb-4 flex items-center gap-2">
              <span>📍</span> {{ branch.address }}
            </p>
            <div class="flex items-center gap-4 mb-6">
              <span class="flex items-center text-yellow-500 font-bold">
                ★ {{ branch.rating }}
                <span class="text-gray-400 font-normal ml-1"
                  >({{ branch.reviewCount }} reviews)</span
                >
              </span>
              <span
                class="px-2 py-1 rounded-full text-xs font-medium"
                [class.bg-green-100]="branch.isOpen"
                [class.text-green-800]="branch.isOpen"
                [class.bg-red-100]="!branch.isOpen"
                [class.text-red-800]="!branch.isOpen"
              >
                {{ branch.isOpen ? 'Open Now' : 'Closed' }}
              </span>
            </div>
            <p class="text-gray-700 mb-6">{{ branch.description }}</p>
            <app-ui-button routerLink="/booking" [queryParams]="{ branchId: branch.id }" size="lg">
              Book Appointment
            </app-ui-button>
          </div>
        </div>
      </div>
    </div>

    <div class="container mx-auto px-4 py-12">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-12">
        <!-- Services -->
        <div>
          <h2 class="text-2xl font-bold mb-6">Services</h2>
          <div class="space-y-4">
            @for (service of branch.services; track service) {
            <div class="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
              <span class="font-medium">{{ service }}</span>
              <span class="text-gray-500 text-sm">from $20</span>
            </div>
            }
          </div>
        </div>

        <!-- Barbers -->
        <div>
          <h2 class="text-2xl font-bold mb-6">Our Barbers</h2>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            @for (barber of branch.barbers; track barber.id) {
            <app-ui-card>
              <div class="flex items-center p-4 gap-4">
                <img
                  [src]="barber.image"
                  [alt]="barber.name"
                  class="w-16 h-16 rounded-full object-cover"
                />
                <div>
                  <h3 class="font-bold">{{ barber.name }}</h3>
                  <p class="text-sm text-gray-500">{{ barber.experience }} years exp.</p>
                  <div class="text-yellow-500 text-sm">★ {{ barber.rating }}</div>
                </div>
              </div>
            </app-ui-card>
            }
          </div>
        </div>
      </div>
    </div>
    } @else {
    <div class="container mx-auto px-4 py-12 text-center">
      <h2 class="text-2xl font-bold text-gray-700">Branch not found</h2>
      <app-ui-button routerLink="/branches" variant="outline" class="mt-4"
        >Back to List</app-ui-button
      >
    </div>
    }
  `,
})
export class BranchDetailComponent {
  branchService = inject(BranchService);
  id = input<string>();

  // Using a getter because input signal is not available in constructor for computed immediately in some versions,
  // but in latest Angular it is. However, `branchService.getBranch` is synchronous.
  // Let's use a computed property.

  // Note: 'id' comes from route params withComponentInputBinding

  branch = computed(() => {
    const branchId = this.id();
    return branchId ? this.branchService.getBranch(branchId) : undefined;
  });
}
