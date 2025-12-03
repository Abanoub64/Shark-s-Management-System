import { Component, inject } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';
import { LanguageService } from '../../../core/services/language.service';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive, CommonModule],
  template: `
    <div class="min-h-screen flex flex-col font-sans">
      <!-- Header -->
      <header class="bg-white shadow-sm sticky top-0 z-50">
        <nav class="container mx-auto px-4 h-16 flex items-center justify-between">
          <!-- Logo -->
          <a routerLink="/" class="text-2xl font-bold text-primary flex items-center gap-2">
            <span class="text-secondary text-3xl">✂</span>
            <span>BarberChain</span>
          </a>

          <!-- Desktop Navigation -->
          <div class="hidden md:flex items-center gap-8">
            <a
              routerLink="/"
              routerLinkActive="text-secondary"
              [routerLinkActiveOptions]="{ exact: true }"
              class="text-gray-600 hover:text-primary font-medium transition-colors"
              >Home</a
            >
            <a
              routerLink="/branches"
              routerLinkActive="text-secondary"
              class="text-gray-600 hover:text-primary font-medium transition-colors"
              >Branches</a
            >
            <a
              routerLink="/my-bookings"
              routerLinkActive="text-secondary"
              class="text-gray-600 hover:text-primary font-medium transition-colors"
              >My Bookings</a
            >
          </div>

          <!-- Actions -->
          <div class="flex items-center gap-4">
            <button
              (click)="langService.toggleLanguage()"
              class="text-sm font-medium text-gray-600 hover:text-primary"
            >
              {{ langService.currentLang() === 'en' ? 'العربية' : 'English' }}
            </button>
            <a
              routerLink="/auth/login"
              class="hidden md:block bg-primary text-white px-4 py-2 rounded-md hover:bg-gray-800 transition-colors"
            >
              Sign In
            </a>
            <!-- Mobile Menu Button (Placeholder) -->
            <button class="md:hidden text-gray-600">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke="currentColor"
                class="w-6 h-6"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
                />
              </svg>
            </button>
          </div>
        </nav>
      </header>

      <!-- Main Content -->
      <main class="flex-grow">
        <router-outlet></router-outlet>
      </main>

      <!-- Footer -->
      <footer class="bg-primary text-white py-12">
        <div class="container mx-auto px-4">
          <div class="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 class="text-xl font-bold mb-4 flex items-center gap-2">
                <span class="text-secondary">✂</span> BarberChain
              </h3>
              <p class="text-gray-400 text-sm">
                Premium grooming services for the modern gentleman.
              </p>
            </div>
            <div>
              <h4 class="font-bold mb-4">Quick Links</h4>
              <ul class="space-y-2 text-sm text-gray-400">
                <li><a routerLink="/branches" class="hover:text-white">Find a Branch</a></li>
                <li><a routerLink="/services" class="hover:text-white">Services</a></li>
                <li><a routerLink="/about" class="hover:text-white">About Us</a></li>
              </ul>
            </div>
            <div>
              <h4 class="font-bold mb-4">Support</h4>
              <ul class="space-y-2 text-sm text-gray-400">
                <li><a routerLink="/contact" class="hover:text-white">Contact Us</a></li>
                <li><a routerLink="/faq" class="hover:text-white">FAQ</a></li>
                <li><a routerLink="/privacy" class="hover:text-white">Privacy Policy</a></li>
              </ul>
            </div>
            <div>
              <h4 class="font-bold mb-4">Connect</h4>
              <div class="flex gap-4">
                <!-- Social Icons Placeholders -->
                <div class="w-8 h-8 bg-gray-700 rounded-full"></div>
                <div class="w-8 h-8 bg-gray-700 rounded-full"></div>
                <div class="w-8 h-8 bg-gray-700 rounded-full"></div>
              </div>
            </div>
          </div>
          <div class="border-t border-gray-800 mt-8 pt-8 text-center text-sm text-gray-400">
            &copy; 2025 BarberChain. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  `,
})
export class MainLayoutComponent {
  langService = inject(LanguageService);
}
