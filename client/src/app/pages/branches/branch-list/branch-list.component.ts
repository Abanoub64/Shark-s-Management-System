import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { BranchService, Branch } from '../../../core/services/branch.service';
import { UiCardComponent } from '../../../components/shared/ui-card.component';
import { UiButtonComponent } from '../../../components/shared/ui-button.component';
import { UiInputComponent } from '../../../components/shared/ui-input.component';
import { FormControl, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-branch-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    UiCardComponent,
    UiButtonComponent,
    UiInputComponent,
    ReactiveFormsModule,
  ],
  template: `
    <div class="container mx-auto px-4 py-8">
      <h1 class="text-3xl font-bold mb-8">Find a Branch</h1>

      <!-- Search & Filter -->
      <div class="mb-8">
        <app-ui-input
          [formControl]="searchControl"
          placeholder="Search by name or location..."
          class="max-w-md"
        >
          <span icon class="text-gray-400">🔍</span>
        </app-ui-input>
      </div>

      <!-- Branch List -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        @for (branch of filteredBranches(); track branch.id) {
        <app-ui-card>
          <div class="relative h-48">
            <img [src]="branch.image" [alt]="branch.name" class="w-full h-full object-cover" />
            <div class="absolute top-4 right-4">
              <span
                class="px-2 py-1 rounded-full text-xs font-medium"
                [class.bg-green-100]="branch.isOpen"
                [class.text-green-800]="branch.isOpen"
                [class.bg-red-100]="!branch.isOpen"
                [class.text-red-800]="!branch.isOpen"
              >
                {{ branch.isOpen ? 'Open' : 'Closed' }}
              </span>
            </div>
          </div>
          <div class="p-4">
            <div class="flex justify-between items-start mb-2">
              <h3 class="text-xl font-bold">{{ branch.name }}</h3>
              <span class="flex items-center text-yellow-500 text-sm font-bold">
                ★ {{ branch.rating }}
                <span class="text-gray-400 font-normal ml-1">({{ branch.reviewCount }})</span>
              </span>
            </div>
            <p class="text-gray-500 text-sm mb-4 flex items-center gap-1">
              <span>📍</span> {{ branch.address }}
            </p>
            <div class="flex items-center justify-between mt-4">
              <span class="text-sm text-gray-500">{{ branch.hours }}</span>
              <app-ui-button [routerLink]="['/branches', branch.id]" variant="secondary" size="sm">
                View Details
              </app-ui-button>
            </div>
          </div>
        </app-ui-card>
        } @empty {
        <div class="col-span-full text-center py-12 text-gray-500">
          No branches found matching your search.
        </div>
        }
      </div>
    </div>
  `,
})
export class BranchListComponent {
  branchService = inject(BranchService);
  searchControl = new FormControl('');

  filteredBranches = computed(() => {
    const query = this.searchControl.value?.toLowerCase() || '';
    return this.branchService
      .branches()
      .filter(
        (b: Branch) =>
          b.name.toLowerCase().includes(query) || b.address.toLowerCase().includes(query)
      );
  });

  constructor() {
    this.searchControl.valueChanges.subscribe(() => {
      // Trigger change detection if needed, but computed handles it
    });
  }
}
