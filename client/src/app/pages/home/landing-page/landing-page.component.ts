import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { UiButtonComponent } from '../../../components/shared/ui-button.component';
import { UiCardComponent } from '../../../components/shared/ui-card.component';

@Component({
  selector: 'app-landing-page',
  standalone: true,
  imports: [CommonModule, RouterLink, UiButtonComponent, UiCardComponent],
  template: `
    <!-- Hero Section -->
    <section class="relative bg-gray-900 text-white py-24 overflow-hidden">
      <div class="absolute inset-0 z-0 opacity-40">
        <img
          src="https://images.unsplash.com/photo-1585747860715-2ba37e788b70?q=80&w=2074&auto=format&fit=crop"
          alt="Barber Shop"
          class="w-full h-full object-cover"
        />
      </div>
      <div class="container mx-auto px-4 relative z-10 text-center md:text-left">
        <h1 class="text-4xl md:text-6xl font-bold mb-6 leading-tight">
          Experience the Art of <br />
          <span class="text-secondary">Grooming</span>
        </h1>
        <p class="text-xl text-gray-300 mb-8 max-w-2xl">
          Premium cuts, shaves, and styling for the modern gentleman. Book your appointment today at
          one of our exclusive locations.
        </p>
        <div class="flex flex-col md:flex-row gap-4 justify-center md:justify-start">
          <app-ui-button routerLink="/branches" size="lg">Book Now</app-ui-button>
          <app-ui-button
            routerLink="/services"
            variant="outline"
            size="lg"
            class="text-white border-white hover:bg-white/10"
            >View Services</app-ui-button
          >
        </div>
      </div>
    </section>

    <!-- Features Section -->
    <section class="py-16 bg-white">
      <div class="container mx-auto px-4">
        <div class="text-center mb-12">
          <h2 class="text-3xl font-bold mb-4">Why Choose BarberChain?</h2>
          <p class="text-gray-600 max-w-2xl mx-auto">
            We combine traditional techniques with modern style to give you the best look.
          </p>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div class="text-center p-6">
            <div
              class="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4 text-3xl"
            >
              ✂️
            </div>
            <h3 class="text-xl font-bold mb-2">Expert Barbers</h3>
            <p class="text-gray-600">
              Our team consists of highly trained professionals with years of experience.
            </p>
          </div>
          <div class="text-center p-6">
            <div
              class="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4 text-3xl"
            >
              💺
            </div>
            <h3 class="text-xl font-bold mb-2">Premium Comfort</h3>
            <p class="text-gray-600">
              Relax in our luxury chairs and enjoy a complimentary beverage with every cut.
            </p>
          </div>
          <div class="text-center p-6">
            <div
              class="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4 text-3xl"
            >
              📅
            </div>
            <h3 class="text-xl font-bold mb-2">Easy Booking</h3>
            <p class="text-gray-600">
              Book your appointment online in seconds. Choose your barber and time slot.
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- Branch Spotlight (Mock) -->
    <section class="py-16 bg-gray-50">
      <div class="container mx-auto px-4">
        <div class="flex justify-between items-end mb-8">
          <div>
            <h2 class="text-3xl font-bold mb-2">Popular Branches</h2>
            <p class="text-gray-600">Find a location near you.</p>
          </div>
          <a routerLink="/branches" class="text-primary font-medium hover:underline">View All -></a>
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
                <h3 class="text-lg font-bold">Downtown Elite</h3>
                <span class="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">Open</span>
              </div>
              <p class="text-gray-500 text-sm mb-4">123 Main St, Cairo</p>
              <div class="flex justify-between items-center">
                <span class="text-yellow-500 text-sm font-bold">★ 4.9 (120)</span>
                <app-ui-button size="sm" variant="secondary" routerLink="/branches/1"
                  >Book</app-ui-button
                >
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
                <h3 class="text-lg font-bold">Zamalek Classic</h3>
                <span class="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">Open</span>
              </div>
              <p class="text-gray-500 text-sm mb-4">45 Nile St, Zamalek</p>
              <div class="flex justify-between items-center">
                <span class="text-yellow-500 text-sm font-bold">★ 4.8 (95)</span>
                <app-ui-button size="sm" variant="secondary" routerLink="/branches/2"
                  >Book</app-ui-button
                >
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
                <h3 class="text-lg font-bold">New Cairo Hub</h3>
                <span class="bg-red-100 text-red-800 text-xs px-2 py-1 rounded-full">Closed</span>
              </div>
              <p class="text-gray-500 text-sm mb-4">90th St, New Cairo</p>
              <div class="flex justify-between items-center">
                <span class="text-yellow-500 text-sm font-bold">★ 4.7 (80)</span>
                <app-ui-button size="sm" variant="secondary" routerLink="/branches/3"
                  >Book</app-ui-button
                >
              </div>
            </div>
          </app-ui-card>
        </div>
      </div>
    </section>
  `,
})
export class LandingPageComponent {}
