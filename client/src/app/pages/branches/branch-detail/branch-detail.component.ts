import { Component, inject, input, signal, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { BranchService, BranchExtended } from '../../../core/services/branch.service';
import { BookingService } from '../../../core/services/booking.service';
import { UiButtonComponent } from '../../../components/shared/ui-button.component';
import { UiSkeletonComponent } from '../../../components/shared/ui-skeleton.component';

@Component({
  selector: 'app-branch-detail',
  standalone: true,
  imports: [CommonModule, RouterLink, UiButtonComponent, UiSkeletonComponent],
  template: `
    @if (isLoading()) {
    <div class="bg-white border-b border-gray-200">
      <div class="container mx-auto px-4 py-8">
        <div class="flex flex-col md:flex-row gap-8 items-start">
          <div class="w-full md:w-1/3">
            <app-ui-skeleton height="256px" className="rounded-lg shadow-md"></app-ui-skeleton>
          </div>
          <div class="flex-1 w-full space-y-4">
            <app-ui-skeleton width="60%" height="40px"></app-ui-skeleton>
            <div class="flex items-center gap-2">
               <app-ui-skeleton width="24px" height="24px" className="rounded-full"></app-ui-skeleton>
               <app-ui-skeleton width="40%" height="20px"></app-ui-skeleton>
            </div>
            <div class="space-y-2 pt-2">
                <app-ui-skeleton width="100%" height="16px"></app-ui-skeleton>
                <app-ui-skeleton width="100%" height="16px"></app-ui-skeleton>
                <app-ui-skeleton width="80%" height="16px"></app-ui-skeleton>
            </div>
            <div class="pt-4">
               <app-ui-skeleton width="160px" height="48px" className="rounded-lg"></app-ui-skeleton>
            </div>
          </div>
        </div>
      </div>
    </div>
    } @else if (branch()) {
    <div class="bg-white border-b border-gray-200 animate-in fade-in duration-300">
      <div class="container mx-auto px-4 py-8">
        <div class="flex flex-col md:flex-row gap-8 items-start">
          <div class="w-full md:w-1/3">
            <img
              [src]="
                branch()?.image ||
                'https://png.pngtree.com/background/20250116/original/pngtree-modern-barbershop-interior-with-empty-black-chairs-wooden-walls-and-mirrors-picture-image_16212968.jpg'
              "
              [alt]="branch()?.name"
              class="w-full h-64 object-cover rounded-lg shadow-md bg-gray-100"
            />
          </div>
          <div class="flex-1">
            <h1 class="text-3xl font-bold mb-2">{{ branch()?.name }}</h1>
            <p class="text-gray-500 mb-4 flex items-center gap-2">
              <span>📍</span> {{ branch()?.location }}
            </p>
            <p class="text-gray-700 mb-6">{{ branch()?.description }}</p>
            <app-ui-button (click)="bookAppointment(branch()!)" size="lg">
              Book Appointment
            </app-ui-button>
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

  authService = inject(AuthService);
  router = inject(Router);
  bookingService = inject(BookingService);

  branch = signal<BranchExtended | null>(null);
  isLoading = signal<boolean>(true);

  constructor() {
    effect(() => {
      const branchId = this.id();
      if (branchId) {
        this.isLoading.set(true);
        this.branchService.getBranch(branchId).subscribe({
          next: (data) => {
            this.branch.set(data);
            this.isLoading.set(false);
          },
          error: (err) => {
            console.error('Failed to load branch', err);
            this.branch.set(null); // Ensure null on error to show Not Found or handle differently
            this.isLoading.set(false);
          }
        });
      }
    });
  }

  bookAppointment(branch: BranchExtended) {
    this.bookingService.selectedBranch.set(branch);
    if (this.authService.isAuthenticated) {
      this.router.navigate(['/booking/service']);
    } else {
      this.router.navigate(['/auth/login'], {
        queryParams: { returnUrl: '/booking/service' },
      });
    }
  }
}
