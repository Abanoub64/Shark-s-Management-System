import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, Router } from '@angular/router';
import { UiInputComponent } from '../../../components/shared/ui-input.component';
import { UiButtonComponent } from '../../../components/shared/ui-button.component';
import { ReactiveFormsModule, FormControl, Validators, FormGroup } from '@angular/forms';
import { AuthService } from '../../../core/services/auth.service';
import { LanguageService } from '../../../core/services/language.service';

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
    if (this.registerForm.valid && !this.passwordMismatchError()) {
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
            // Ideally show a toast here
          },
        });
    }
  }
}
