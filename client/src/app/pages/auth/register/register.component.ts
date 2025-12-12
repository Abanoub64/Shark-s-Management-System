import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, Router } from '@angular/router';
import { UiInputComponent } from '../../../components/shared/ui-input.component';
import { UiButtonComponent } from '../../../components/shared/ui-button.component';
import { ReactiveFormsModule, FormControl, Validators, FormGroup } from '@angular/forms';
import { AuthService } from '../../../core/services/auth.service';
import { LanguageService } from '../../../core/services/language.service';
import { ToastService } from '../../../core/services/toast.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, RouterLink, UiInputComponent, UiButtonComponent, ReactiveFormsModule],
  template: `
    <div
      class="min-h-[calc(100vh-64px)] flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8"
    >
      <div class="max-w-md w-full space-y-8 bg-white p-8 rounded-xl shadow-lg">
        <div class="text-center">
          <h2 class="mt-6 text-3xl font-extrabold text-gray-900">{{ t().registerTitle }}</h2>
          <p class="mt-2 text-sm text-gray-600">
            {{ t().or }}
            <a routerLink="/auth/login" class="font-medium text-primary hover:text-gray-800">
              {{ t().signInToExisting }}
            </a>
          </p>
        </div>
        <form class="mt-8 space-y-6" [formGroup]="registerForm" (ngSubmit)="onSubmit()">
          <div class="space-y-4">
            <div class="grid grid-cols-2 gap-4">
              <app-ui-input
                label="First Name"
                type="text"
                placeholder="John"
                formControlName="firstName"
                [required]="true"
              ></app-ui-input>

              <app-ui-input
                label="Last Name"
                type="text"
                placeholder="Doe"
                formControlName="lastName"
                [required]="true"
              ></app-ui-input>
            </div>

            <app-ui-input
              label="Phone Number"
              type="tel"
              placeholder="+1234567890"
              formControlName="phoneNumber"
              [required]="true"
            ></app-ui-input>

            <app-ui-input
              [label]="t().emailLabel"
              type="email"
              [placeholder]="t().emailPlaceholder"
              formControlName="email"
              [required]="true"
            ></app-ui-input>

            <app-ui-input
              [label]="t().passwordLabel"
              type="password"
              [placeholder]="t().passwordPlaceholder"
              formControlName="password"
              [required]="true"
            ></app-ui-input>

            <!-- Password Requirements Feedback -->
            <div
              class="text-sm space-y-1 bg-gray-50 p-3 rounded-md"
              *ngIf="registerForm.get('password')?.value"
            >
              <p class="font-medium text-gray-700 mb-2">Password must contain:</p>
              <div
                class="flex items-center gap-2"
                [class.text-green-600]="checkPassword('minLength')"
                [class.text-gray-500]="!checkPassword('minLength')"
              >
                <span *ngIf="checkPassword('minLength')">✓</span>
                <span *ngIf="!checkPassword('minLength')">○</span>
                At least 6 characters
              </div>
              <div
                class="flex items-center gap-2"
                [class.text-green-600]="checkPassword('uppercase')"
                [class.text-gray-500]="!checkPassword('uppercase')"
              >
                <span *ngIf="checkPassword('uppercase')">✓</span>
                <span *ngIf="!checkPassword('uppercase')">○</span>
                Uppercase letter
              </div>
              <div
                class="flex items-center gap-2"
                [class.text-green-600]="checkPassword('lowercase')"
                [class.text-gray-500]="!checkPassword('lowercase')"
              >
                <span *ngIf="checkPassword('lowercase')">✓</span>
                <span *ngIf="!checkPassword('lowercase')">○</span>
                Lowercase letter
              </div>
              <div
                class="flex items-center gap-2"
                [class.text-green-600]="checkPassword('number')"
                [class.text-gray-500]="!checkPassword('number')"
              >
                <span *ngIf="checkPassword('number')">✓</span>
                <span *ngIf="!checkPassword('number')">○</span>
                Number
              </div>
              <div
                class="flex items-center gap-2"
                [class.text-green-600]="checkPassword('special')"
                [class.text-gray-500]="!checkPassword('special')"
              >
                <span *ngIf="checkPassword('special')">✓</span>
                <span *ngIf="!checkPassword('special')">○</span>
                Special character
              </div>
            </div>

            <app-ui-input
              [label]="t().confirmPasswordLabel"
              type="password"
              [placeholder]="t().passwordPlaceholder"
              formControlName="confirmPassword"
              [required]="true"
              [error]="passwordMismatchError()"
            ></app-ui-input>
          </div>

          <div>
            <app-ui-button type="submit" [fullWidth]="true" [disabled]="registerForm.invalid">
              {{ t().createAccountButton }}
            </app-ui-button>
          </div>
        </form>
      </div>
    </div>
  `,
})
export class RegisterComponent {
  authService = inject(AuthService);
  router = inject(Router);
  languageService = inject(LanguageService);
  toastService = inject(ToastService);
  t = this.languageService.t;

  registerForm = new FormGroup({
    firstName: new FormControl('', [Validators.required, Validators.minLength(2)]),
    lastName: new FormControl('', [Validators.required, Validators.minLength(2)]),
    phoneNumber: new FormControl('', [
      Validators.required,
      Validators.pattern(/^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/),
    ]),
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required, Validators.minLength(6)]),
    confirmPassword: new FormControl('', [Validators.required]),
  });

  // ... component logic
  passwordValidators = {
    minLength: (val: string) => val.length >= 6,
    uppercase: (val: string) => /[A-Z]/.test(val),
    lowercase: (val: string) => /[a-z]/.test(val),
    number: (val: string) => /[0-9]/.test(val),
    special: (val: string) => /[!@#$%^&*(),.?":{}|<>]/.test(val),
  };

  checkPassword(criterion: keyof typeof this.passwordValidators): boolean {
    const val = this.registerForm.get('password')?.value || '';
    return this.passwordValidators[criterion](val);
  }

  isPasswordValid(): boolean {
    const val = this.registerForm.get('password')?.value || '';
    return Object.values(this.passwordValidators).every((validator) => validator(val));
  }

  passwordMismatchError(): string | null {
    if (
      this.registerForm.get('confirmPassword')?.touched &&
      this.registerForm.get('password')?.value !== this.registerForm.get('confirmPassword')?.value
    ) {
      return 'Passwords do not match';
    }
    return null;
  }

  onSubmit() {
    if (this.registerForm.valid && !this.passwordMismatchError() && this.isPasswordValid()) {
      const { firstName, lastName, phoneNumber, email, password } = this.registerForm.value;
      this.authService
        .register({
          firstName: firstName!,
          lastName: lastName!,
          phoneNumber: phoneNumber!,
          email: email!,
          password: password!,
        })
        .subscribe({
          next: (response) => {
            if (response.isAuthenticated) {
              this.router.navigate(['/']);
            }
          },
          error: (err) => {
            console.error('Registration failed', err);
            this.toastService.error('Registration Failed', 'Please try again.');
          },
        });
    } else {
      this.registerForm.markAllAsTouched();
      if (!this.isPasswordValid()) {
        this.toastService.error(
          'Weak Password',
          'Please ensure your password meets all requirements.'
        );
      } else {
        this.toastService.error('Invalid Form', 'Please fill in all required fields correctly.');
      }
    }
  }
}
