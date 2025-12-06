import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { UiButtonComponent } from '../../../components/shared/ui-button.component';
import { UiCardComponent } from '../../../components/shared/ui-card.component';
import { LanguageService } from '../../../core/services/language.service';

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
          <p class="text-lg md:text-xl text-gray-300 mb-8 max-w-xl leading-relaxed">
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
          <h2 class="text-3xl font-bold mb-4">{{ t().whyChoose }}</h2>
          <p class="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
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
            <h3 class="text-xl font-bold mb-2">{{ t().expertBarbers }}</h3>
            <p class="text-gray-600 dark:text-gray-300">
              {{ t().expertBarbersDesc }}
            </p>
          </div>
          <div class="text-center p-6">
            <div
              class="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4 text-3xl"
            >
              💺
            </div>
            <h3 class="text-xl font-bold mb-2">{{ t().premiumComfort }}</h3>
            <p class="text-gray-600 dark:text-gray-300">
              {{ t().premiumComfortDesc }}
            </p>
          </div>
          <div class="text-center p-6">
            <div
              class="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4 text-3xl"
            >
              📅
            </div>
            <h3 class="text-xl font-bold mb-2">{{ t().easyBooking }}</h3>
            <p class="text-gray-600 dark:text-gray-300">
              {{ t().easyBookingDesc }}
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- Branch Spotlight (Mock) -->
    <section class="py-16 bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      <div class="container mx-auto px-4">
        <div class="flex justify-between items-end mb-8">
          <div>
            <h2 class="text-3xl font-bold mb-2 dark:text-white">{{ t().popularBranches }}</h2>
            <p class="text-gray-600 dark:text-gray-400">{{ t().findLocation }}</p>
          </div>
          <a routerLink="/branches" class="text-primary font-medium hover:underline"
            >{{ t().viewAll }} -></a
          >
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <!-- Mock Branch 1 -->
          <app-ui-card>
            <img
              src="https://images.unsplash.com/photo-1503951914875-452162b7f304?q=80&w=2070&auto=format&fit=crop"
              alt="Downtown Branch"
              class="w-full h-48 object-cover"
            />
            <div class="p-4">
              <div class="flex justify-between items-start mb-2">
                <h3 class="text-lg font-bold dark:text-white">Downtown Elite</h3>
                <span class="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">{{
                  t().open
                }}</span>
              </div>
              <p class="text-gray-500 text-sm mb-4">123 Main St, Cairo</p>
              <div class="flex justify-between items-center">
                <span class="text-yellow-500 text-sm font-bold">★ 4.9 (120)</span>
                <app-ui-button size="sm" variant="secondary" routerLink="/branches/1">{{
                  t().book
                }}</app-ui-button>
              </div>
            </div>
          </app-ui-card>

          <!-- Mock Branch 2 -->
          <app-ui-card>
            <img
              src="https://images.unsplash.com/photo-1622287162716-f311baa36489?q=80&w=2070&auto=format&fit=crop"
              alt="Zamalek Branch"
              class="w-full h-48 object-cover"
            />
            <div class="p-4">
              <div class="flex justify-between items-start mb-2">
                <h3 class="text-lg font-bold dark:text-white">Zamalek Classic</h3>
                <span class="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">{{
                  t().open
                }}</span>
              </div>
              <p class="text-gray-500 text-sm mb-4">45 Nile St, Zamalek</p>
              <div class="flex justify-between items-center">
                <span class="text-yellow-500 text-sm font-bold">★ 4.8 (95)</span>
                <app-ui-button size="sm" variant="secondary" routerLink="/branches/2">{{
                  t().book
                }}</app-ui-button>
              </div>
            </div>
          </app-ui-card>

          <!-- Mock Branch 3 -->
          <app-ui-card>
            <img
              src="https://images.unsplash.com/photo-1599351431202-1e0f0137899a?q=80&w=1976&auto=format&fit=crop"
              alt="New Cairo Branch"
              class="w-full h-48 object-cover"
            />
            <div class="p-4">
              <div class="flex justify-between items-start mb-2">
                <h3 class="text-lg font-bold dark:text-white">New Cairo Hub</h3>
                <span class="bg-red-100 text-red-800 text-xs px-2 py-1 rounded-full">{{
                  t().closed
                }}</span>
              </div>
              <p class="text-gray-500 text-sm mb-4">90th St, New Cairo</p>
              <div class="flex justify-between items-center">
                <span class="text-yellow-500 text-sm font-bold">★ 4.7 (80)</span>
                <app-ui-button size="sm" variant="secondary" routerLink="/branches/3">{{
                  t().book
                }}</app-ui-button>
              </div>
            </div>
          </app-ui-card>
        </div>
      </div>
    </section>
  `,
})
export class LandingPageComponent {
  private languageService = inject(LanguageService);
  t = this.languageService.t;
}
