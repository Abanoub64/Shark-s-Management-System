import { Injectable, signal, inject, PLATFORM_ID, EffectRef, effect } from '@angular/core';
import { DOCUMENT, isPlatformBrowser } from '@angular/common';

export type Language = 'en' | 'ar';

@Injectable({
  providedIn: 'root',
})
export class LanguageService {
  private document = inject(DOCUMENT);
  private platformId = inject(PLATFORM_ID);

  currentLang = signal<Language>('en');

  constructor() {
    if (isPlatformBrowser(this.platformId)) {
      // Load saved language or default to 'en'
      const savedLang = localStorage.getItem('lang') as Language;
      if (savedLang) {
        this.setLanguage(savedLang);
      }
    }

    effect(() => {
      const lang = this.currentLang();
      if (isPlatformBrowser(this.platformId)) {
        localStorage.setItem('lang', lang);
        this.updateDocument(lang);
      }
    });
  }

  toggleLanguage() {
    this.setLanguage(this.currentLang() === 'en' ? 'ar' : 'en');
  }

  setLanguage(lang: Language) {
    this.currentLang.set(lang);
  }

  private updateDocument(lang: Language) {
    const dir = lang === 'ar' ? 'rtl' : 'ltr';
    this.document.documentElement.lang = lang;
    this.document.documentElement.dir = dir;
  }
}
