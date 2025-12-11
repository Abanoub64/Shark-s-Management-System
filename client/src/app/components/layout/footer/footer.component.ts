import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { LanguageService } from '../../../core/services/language.service';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <footer class="bg-primary text-white py-12">
      <div class="container mx-auto px-4">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 class="text-xl font-bold mb-4 flex items-center gap-2">
              <span class="text-secondary">✂</span> BarberChain
            </h3>
            <p class="text-gray-400 text-sm">
              {{ t().footerTagline }}
            </p>
          </div>
          <div>
            <h4 class="font-bold mb-4">{{ t().quickLinks }}</h4>
            <ul class="space-y-2 text-sm text-gray-400">
              <li>
                <a routerLink="/branches" class="hover:text-white">{{ t().findBranch }}</a>
              </li>
              <li>
                <a routerLink="/booking" class="hover:text-white">{{ t().bookAppointment }}</a>
              </li>
              <li>
                <a routerLink="/store" class="hover:text-white">{{ t().store }}</a>
              </li>
            </ul>
          </div>
          <div>
            <h4 class="font-bold mb-4">{{ t().support }}</h4>
            <ul class="space-y-2 text-sm text-gray-400">
              <li>
                <a routerLink="/contact" class="hover:text-white">{{ t().contactUs }}</a>
              </li>
              <li>
                <a routerLink="/faq" class="hover:text-white">{{ t().faq }}</a>
              </li>
            </ul>
          </div>
          <div>
            <h4 class="font-bold mb-4">{{ t().connect }}</h4>
            <a
              href="https://www.facebook.com/profile.php?id=61551409970406"
              target="_blank"
              class="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path
                  d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z"
                />
              </svg>
              {{ t().facebookPage }}
            </a>
          </div>
        </div>
        <div class="border-t border-gray-800 mt-8 pt-8 text-center text-sm text-gray-400">
          &copy; 2025 BarberChain. {{ t().rightsReserved }}
        </div>
      </div>
    </footer>
  `,
})
export class FooterComponent {
  langService = inject(LanguageService);
  t = this.langService.t;
}
