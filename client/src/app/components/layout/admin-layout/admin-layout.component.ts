import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { LanguageService } from '../../../core/services/language.service';

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive],
  template: `
    <div class="min-h-screen flex bg-gray-100 font-sans">
      <!-- Sidebar -->
      <aside class="w-64 bg-gray-900 text-white flex-shrink-0 hidden md:flex flex-col">
        <div class="h-16 flex items-center px-6 border-b border-gray-800">
          <span class="text-2xl font-bold text-white flex items-center gap-2">
            <span class="text-secondary">✂</span> Admin
          </span>
        </div>

        <nav class="flex-1 py-6 px-3 space-y-1">
          <div class="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 px-3">
            Head Office
          </div>
          <a
            routerLink="/admin/dashboard"
            routerLinkActive="bg-gray-800 text-white"
            class="flex items-center px-3 py-2 text-sm font-medium text-gray-300 rounded-md hover:bg-gray-800 hover:text-white group"
          >
            <span class="mr-3">📊</span> Dashboard
          </a>
          <a
            routerLink="/admin/branches"
            routerLinkActive="bg-gray-800 text-white"
            class="flex items-center px-3 py-2 text-sm font-medium text-gray-300 rounded-md hover:bg-gray-800 hover:text-white group"
          >
            <span class="mr-3">🏢</span> Branches
          </a>
          <a
            routerLink="/admin/barbers"
            routerLinkActive="bg-gray-800 text-white"
            class="flex items-center px-3 py-2 text-sm font-medium text-gray-300 rounded-md hover:bg-gray-800 hover:text-white group"
          >
            <span class="mr-3">💇</span> Barbers
          </a>
          <a
            routerLink="/admin/bookings"
            routerLinkActive="bg-gray-800 text-white"
            class="flex items-center px-3 py-2 text-sm font-medium text-gray-300 rounded-md hover:bg-gray-800 hover:text-white group"
          >
            <span class="mr-3">📅</span> All Bookings
          </a>

          <div class="mt-8 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 px-3">
            Branch Manager
          </div>
          <a
            routerLink="/branch-admin/dashboard"
            routerLinkActive="bg-gray-800 text-white"
            class="flex items-center px-3 py-2 text-sm font-medium text-gray-300 rounded-md hover:bg-gray-800 hover:text-white group"
          >
            <span class="mr-3">📈</span> Branch Overview
          </a>
          <a
            routerLink="/branch-admin/queue"
            routerLinkActive="bg-gray-800 text-white"
            class="flex items-center px-3 py-2 text-sm font-medium text-gray-300 rounded-md hover:bg-gray-800 hover:text-white group"
          >
            <span class="mr-3">🚶</span> Queue System
          </a>
          <a
            routerLink="/branch-admin/schedule"
            routerLinkActive="bg-gray-800 text-white"
            class="flex items-center px-3 py-2 text-sm font-medium text-gray-300 rounded-md hover:bg-gray-800 hover:text-white group"
          >
            <span class="mr-3">🕒</span> Staff Schedule
          </a>
        </nav>

        <div class="p-4 border-t border-gray-800">
          <div class="flex items-center gap-3">
            <div class="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center">A</div>
            <div>
              <p class="text-sm font-medium text-white">Admin User</p>
              <p class="text-xs text-gray-500">Head Office</p>
            </div>
          </div>
        </div>
      </aside>

      <!-- Main Content -->
      <div class="flex-1 flex flex-col overflow-hidden">
        <!-- Header -->
        <header class="bg-white shadow-sm h-16 flex items-center justify-between px-6 z-10">
          <div class="flex items-center gap-4">
            <button class="md:hidden text-gray-500 hover:text-gray-700">
              <span class="text-2xl">☰</span>
            </button>
            <h1 class="text-xl font-semibold text-gray-800">Dashboard</h1>
          </div>
          <div class="flex items-center gap-4">
            <button
              (click)="langService.toggleLanguage()"
              class="text-sm font-medium text-gray-600 hover:text-primary"
            >
              {{ langService.currentLang() === 'en' ? 'العربية' : 'English' }}
            </button>
            <button class="text-gray-500 hover:text-gray-700 relative">
              🔔
              <span
                class="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-500 ring-2 ring-white"
              ></span>
            </button>
            <a routerLink="/" class="text-sm text-gray-600 hover:text-primary">Exit Admin</a>
          </div>
        </header>

        <!-- Page Content -->
        <main class="flex-1 overflow-y-auto p-6">
          <router-outlet></router-outlet>
        </main>
      </div>
    </div>
  `,
})
export class AdminLayoutComponent {
  langService = inject(LanguageService);
}
