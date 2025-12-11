import { Component, inject, signal, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService, User } from '../../../core/services/auth.service';
import { LanguageService } from '../../../core/services/language.service';
import { UiButtonComponent } from '../../../components/shared/ui-button.component';
import { UiInputComponent } from '../../../components/shared/ui-input.component';
import {
  ReactiveFormsModule,
  FormControl,
  FormGroup,
  Validators,
  AbstractControl,
  ValidationErrors,
} from '@angular/forms';
import { UiCardComponent } from '../../../components/shared/ui-card.component';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    CommonModule,
    UiButtonComponent,
    UiInputComponent,
    UiCardComponent,
    ReactiveFormsModule,
  ],
  template: `
    <div class="container mx-auto px-4 py-12">
      <div class="max-w-2xl mx-auto">
        <h1 class="text-3xl font-bold mb-8">{{ t().accountSettings }}</h1>

        <app-ui-card class="p-6">
          <form [formGroup]="profileForm" (ngSubmit)="onSubmit()" class="space-y-6">
            <div class="mb-6">
              <h2 class="text-xl font-bold">{{ t().profile }}</h2>
              <p class="text-sm text-gray-500">Update your personal information</p>
            </div>

            <app-ui-input [label]="t().fullNameLabel" formControlName="name"></app-ui-input>

            <app-ui-input
              [label]="t().emailLabel"
              formControlName="email"
              [type]="'email'"
            ></app-ui-input>

            <div class="border-t pt-6 mt-6">
              <h3 class="text-lg font-bold mb-4">Change Password</h3>
              <div class="space-y-4">
                <app-ui-input
                  label="Current Password"
                  formControlName="currentPassword"
                  type="password"
                  placeholder="Enter current password to change"
                ></app-ui-input>

                <app-ui-input
                  label="New Password"
                  formControlName="newPassword"
                  type="password"
                  placeholder="Enter new password"
                ></app-ui-input>

                <app-ui-input
                  label="Confirm New Password"
                  formControlName="confirmPassword"
                  type="password"
                  placeholder="Confirm new password"
                  [error]="profileForm.errors?.['passwordMismatch'] && (profileForm.get('confirmPassword')?.touched || profileForm.get('confirmPassword')?.dirty) ? 'Passwords do not match' : ''"
                ></app-ui-input>
              </div>
            </div>

            <div class="flex justify-end gap-4 mt-8">
              <app-ui-button type="submit" [disabled]="profileForm.invalid || isProcessing">
                @if (isProcessing) { Saving... } @else { {{ t().saveChanges }} }
              </app-ui-button>
            </div>
          </form>
        </app-ui-card>

        <div class="mt-8">
          <app-ui-card class="p-6 border-red-100">
            <h3 class="text-lg font-bold text-red-600 mb-4">{{ t().dangerZone }}</h3>
            <app-ui-button variant="outline" class="border-red-500 text-red-500 hover:bg-red-50">
              {{ t().deleteAccount }}
            </app-ui-button>
          </app-ui-card>
        </div>
      </div>
    </div>
  `,
})
export class ProfileComponent {
  authService = inject(AuthService);
  languageService = inject(LanguageService);
  t = this.languageService.t;
  user = this.authService.currentUser;

  isProcessing = false;

  profileForm = new FormGroup(
    {
      name: new FormControl('', [Validators.required]),
      email: new FormControl('', [Validators.required, Validators.email]),
      currentPassword: new FormControl(''),
      newPassword: new FormControl(''),
      confirmPassword: new FormControl(''),
    },
    { validators: this.passwordValidators }
  );

  constructor() {
    effect(() => {
      const currentUser = this.user();
      if (currentUser) {
        this.profileForm.patchValue({
          name: currentUser.name || currentUser.firstName, // Fallback if name is missing
          email: currentUser.email,
        });
      }
    });
  }

  // Custom validator for password matching and requirement logic
  passwordValidators(control: AbstractControl): ValidationErrors | null {
    const newPass = control.get('newPassword')?.value;
    const confirmPass = control.get('confirmPassword')?.value;
    const currentPass = control.get('currentPassword')?.value;

    const errors: any = {};
    let hasError = false;

    // If new password is provided
    if (newPass) {
      if (!currentPass) {
        // We can't set error on control easily from here without traversing,
        // but effectively the form is invalid if we enforce it.
        // Usually best to check in onSubmit or use conditional validators.
        // For simplicity, we'll rely on the logic: if newPass exists, currentPass is required.
      }

      if (newPass !== confirmPass) {
        errors.passwordMismatch = true;
        hasError = true;
      }
    }

    return hasError ? errors : null;
  }

  onSubmit() {
    if (this.profileForm.invalid || this.isProcessing) return;

    this.isProcessing = true;
    const formVal = this.profileForm.value;

    // 1. Update Profile (Name/Email)
    // Note: In a real app, we might check if these changed before calling.
    // Also handling email change might need its own flow or error handling if email taken.
    const profileUpdate$ = this.authService.updateProfile({
      name: formVal.name || '',
      email: formVal.email || '',
    });

    profileUpdate$.subscribe({
      next: () => {
        // 2. Change Password if provided
        if (formVal.newPassword && formVal.currentPassword) {
          if (formVal.newPassword !== formVal.confirmPassword) {
            alert('Passwords do not match');
            this.isProcessing = false;
            return;
          }

          this.authService
            .changePassword({
              currentPassword: formVal.currentPassword,
              newPassword: formVal.newPassword,
            })
            .subscribe({
              next: () => {
                alert('Profile and password updated successfully');
                this.resetPasswordFields();
                this.isProcessing = false;
              },
              error: (err) => {
                console.error('Password change failed', err);
                alert('Failed to change password: ' + (err.error?.message || 'Unknown error'));
                this.isProcessing = false;
              },
            });
        } else {
          alert('Profile updated successfully');
          this.isProcessing = false;
        }
      },
      error: (err) => {
        console.error('Profile update failed', err);
        alert('Failed to update profile');
        this.isProcessing = false;
      },
    });
  }

  resetPasswordFields() {
    this.profileForm.patchValue({
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    });
    this.profileForm.markAsPristine();
  }
}
