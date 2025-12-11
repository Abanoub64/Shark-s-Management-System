import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { UiButtonComponent } from '../../../components/shared/ui-button.component';
import { UiCardComponent } from '../../../components/shared/ui-card.component';
import { LanguageService } from '../../../core/services/language.service';
import { BranchService, BranchExtended } from '../../../core/services/branch.service';

@Component({
  selector: 'app-landing-page',
  standalone: true,
  imports: [CommonModule, RouterLink, UiButtonComponent, UiCardComponent],
  template: `
    <!-- Hero Section -->
    <section class="relative min-h-[600px] flex items-center bg-gray-900 overflow-hidden">
      <!-- Background Image with Gradient Overlay -->
      <div class="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1585747860715-2ba37e788b70?q=80&w=2074&auto=format&fit=crop"
          alt="Barber Shop"
          class="w-full h-full object-cover"
        />
        <!-- Premium Gradient Overlay -->
        <div
          class="absolute inset-0 bg-gradient-to-r from-gray-900 via-gray-900/90 to-transparent"
        ></div>
      </div>

      <!-- Content -->
      <div class="container mx-auto px-4 relative z-10 pt-20">
        <div class="max-w-3xl">
          <span
            class="inline-block py-1 px-3 rounded-full bg-yellow-500/10 border border-yellow-500/20 text-yellow-500 text-sm font-semibold tracking-wide uppercase mb-6 backdrop-blur-sm"
          >
            {{ t().premiumBarberExperience }}
          </span>
          <h1 class="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight">
            {{ t().experienceArt }} <br />
            <span
              class="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-yellow-600"
              >{{ t().masterfulGrooming }}</span
            >
          </h1>
          <p class="text-lg md:text-xl text-gray-200 mb-8 max-w-xl leading-relaxed">
            {{ t().heroSubtitle }}
          </p>
          <div class="flex flex-col sm:flex-row gap-4">
            <app-ui-button routerLink="/branches" size="lg" class="shadow-lg shadow-yellow-500/20">
              {{ t().bookAppointment }}
            </app-ui-button>
            <app-ui-button
              routerLink="/services"
              variant="outline"
              size="lg"
              class="border-white text-white hover:bg-white/10 hover:border-white backdrop-blur-sm transition-all"
            >
              {{ t().exploreServices }}
            </app-ui-button>
          </div>

          <!-- Quick Stats -->
          <div class="mt-12 flex gap-8 md:gap-12 border-t border-gray-800 pt-8">
            <div>
              <p class="text-3xl font-bold text-white">4.9</p>
              <p class="text-sm text-gray-400">{{ t().averageRating }}</p>
            </div>
            <div>
              <p class="text-3xl font-bold text-white">15k+</p>
              <p class="text-sm text-gray-400">{{ t().happyClients }}</p>
            </div>
            <div>
              <p class="text-3xl font-bold text-white">10+</p>
              <p class="text-sm text-gray-400">{{ t().yearsExperience }}</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Features Section -->
    <section class="py-16 bg-white dark:bg-gray-800 dark:text-white transition-colors duration-300">
      <div class="container mx-auto px-4">
        <div class="text-center mb-12">
          <h2 class="text-3xl font-bold mb-4 text-gray-900 dark:text-white">{{ t().whyChoose }}</h2>
          <p class="text-gray-700 dark:text-gray-300 max-w-2xl mx-auto">
            {{ t().whyChooseSubtitle }}
          </p>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div class="text-center p-6">
            <div
              class="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4 text-3xl"
            >
              ✂️
            </div>
            <h3 class="text-xl font-bold mb-2 text-gray-900 dark:text-white">
              {{ t().expertBarbers }}
            </h3>
            <p class="text-gray-700 dark:text-gray-300">
              {{ t().expertBarbersDesc }}
            </p>
          </div>
          <div class="text-center p-6">
            <div
              class="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4 text-3xl"
            >
              💺
            </div>
            <h3 class="text-xl font-bold mb-2 text-gray-900 dark:text-white">
              {{ t().premiumComfort }}
            </h3>
            <p class="text-gray-700 dark:text-gray-300">
              {{ t().premiumComfortDesc }}
            </p>
          </div>
          <div class="text-center p-6">
            <div
              class="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4 text-3xl"
            >
              📅
            </div>
            <h3 class="text-xl font-bold mb-2 text-gray-900 dark:text-white">
              {{ t().easyBooking }}
            </h3>
            <p class="text-gray-700 dark:text-gray-300">
              {{ t().easyBookingDesc }}
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- Branch Spotlight -->
    <section class="py-16 bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      <div class="container mx-auto px-4">
        <div class="flex justify-between items-end mb-8">
          <div>
            <h2 class="text-3xl font-bold mb-2 text-gray-900 dark:text-white">
              {{ t().popularBranches }}
            </h2>
            <p class="text-gray-700 dark:text-gray-300">{{ t().findLocation }}</p>
          </div>
          <a routerLink="/branches" class="text-primary font-medium hover:underline"
            >{{ t().viewAll }} -></a
          >
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          @for (branch of popularBranches(); track branch.id) {
          <app-ui-card>
            <img
              [src]="branch.image || defaultImage"
              [alt]="branch.name"
              class="w-full h-48 object-cover"
            />
            <div class="p-4">
              <div class="flex justify-between items-start mb-2">
                <h3 class="text-lg font-bold text-gray-900 dark:text-white">{{ branch.name }}</h3>
                <span
                  class="text-xs px-2 py-1 rounded-full"
                  [class.bg-green-100]="branch.isOpen !== false"
                  [class.text-green-800]="branch.isOpen !== false"
                  [class.bg-red-100]="branch.isOpen === false"
                  [class.text-red-800]="branch.isOpen === false"
                >
                  {{ branch.isOpen !== false ? t().open : t().closed }}
                </span>
              </div>
              <p class="text-gray-600 dark:text-gray-400 text-sm mb-4 flex items-center gap-1">
                <span>📍</span> {{ branch.location }}
              </p>
              <div class="flex justify-between items-center">
                <span class="text-yellow-500 text-sm font-bold">
                  ★ {{ branch.rating || 'New' }}
                  <span class="text-gray-400 font-normal">({{ branch.reviewCount || 0 }})</span>
                </span>
                <app-ui-button
                  size="sm"
                  variant="secondary"
                  [routerLink]="['/branches', branch.id]"
                >
                  {{ t().book }}
                </app-ui-button>
              </div>
            </div>
          </app-ui-card>
          } @empty {
          <div class="col-span-3 text-center py-12 text-gray-500">
            No branches available at the moment.
          </div>
          }
        </div>
      </div>
    </section>
  `,
})
export class LandingPageComponent implements OnInit {
  private languageService = inject(LanguageService);
  private branchService = inject(BranchService);

  t = this.languageService.t;
  popularBranches = signal<BranchExtended[]>([]);
  defaultImage =
    'https://images.unsplash.com/photo-1503951914875-452162b7f304?q=80&w=2070&auto=format&fit=crop';

  ngOnInit() {
    this.branchService.getAllBranches().subscribe({
      next: (branches) => {
        // Take first 3 branches as popular ones
        this.popularBranches.set(branches.slice(0, 3) as BranchExtended[]);
      },
      error: (err) => console.error('Error fetching branches:', err),
    });
  }
}
