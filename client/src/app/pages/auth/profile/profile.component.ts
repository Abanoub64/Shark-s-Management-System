import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UiButtonComponent } from '../../../components/shared/ui-button.component';
import { UiInputComponent } from '../../../components/shared/ui-input.component';
import { ReactiveFormsModule, FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, UiButtonComponent, UiInputComponent, ReactiveFormsModule],
  template: `
    <div class="container mx-auto px-4 py-8">
      <h1 class="text-3xl font-bold mb-8">My Profile</h1>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
        <!-- Sidebar / Avatar -->
        <div class="md:col-span-1">
          <div class="bg-white rounded-lg shadow-md p-6 text-center">
            <div class="w-32 h-32 bg-gray-200 rounded-full mx-auto mb-4 overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=2070&auto=format&fit=crop"
                alt="Profile"
                class="w-full h-full object-cover"
              />
            </div>
            <h2 class="text-xl font-bold">John Doe</h2>
            <p class="text-gray-500 mb-4">Member since 2024</p>
            <app-ui-button variant="outline" size="sm">Change Photo</app-ui-button>
          </div>
        </div>

        <!-- Details Form -->
        <div class="md:col-span-2">
          <div class="bg-white rounded-lg shadow-md p-6">
            <h3 class="text-xl font-bold mb-6">Personal Information</h3>
            <form [formGroup]="profileForm" class="space-y-6">
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <app-ui-input label="First Name" formControlName="firstName"></app-ui-input>
                <app-ui-input label="Last Name" formControlName="lastName"></app-ui-input>
              </div>

              <app-ui-input label="Email" type="email" formControlName="email"></app-ui-input>
              <app-ui-input label="Phone Number" type="tel" formControlName="phone"></app-ui-input>

              <div class="pt-4 border-t border-gray-200">
                <h3 class="text-xl font-bold mb-4">Notifications</h3>
                <div class="space-y-3">
                  <div class="flex items-center">
                    <input
                      type="checkbox"
                      id="sms"
                      class="h-4 w-4 text-primary rounded border-gray-300"
                      checked
                    />
                    <label for="sms" class="ml-2 text-gray-700">SMS Notifications</label>
                  </div>
                  <div class="flex items-center">
                    <input
                      type="checkbox"
                      id="email"
                      class="h-4 w-4 text-primary rounded border-gray-300"
                      checked
                    />
                    <label for="email" class="ml-2 text-gray-700">Email Notifications</label>
                  </div>
                </div>
              </div>

              <div class="pt-6 flex justify-end">
                <app-ui-button type="submit">Save Changes</app-ui-button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  `,
})
export class ProfileComponent {
  profileForm = new FormGroup({
    firstName: new FormControl('John'),
    lastName: new FormControl('Doe'),
    email: new FormControl('john.doe@example.com'),
    phone: new FormControl('+20 123 456 7890'),
  });
}
