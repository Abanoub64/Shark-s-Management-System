import { Routes } from '@angular/router';
import { MainLayoutComponent } from './components/layout/main-layout/main-layout.component';
import { LandingPageComponent } from './pages/home/landing-page/landing-page.component';

export const routes: Routes = [
  {
    path: '',
    component: MainLayoutComponent,
    children: [
      { path: '', component: LandingPageComponent },
      {
        path: 'branches',
        loadComponent: () =>
          import('./pages/branches/branch-list/branch-list.component').then(
            (m) => m.BranchListComponent
          ),
      },
      {
        path: 'branches/:id',
        loadComponent: () =>
          import('./pages/branches/branch-detail/branch-detail.component').then(
            (m) => m.BranchDetailComponent
          ),
      },
      {
        path: 'booking',
        loadComponent: () =>
          import('./pages/booking/booking-flow/booking-flow.component').then(
            (m) => m.BookingFlowComponent
          ),
        children: [
          { path: '', redirectTo: 'service', pathMatch: 'full' },
          {
            path: 'service',
            loadComponent: () =>
              import('./pages/booking/steps/select-service/select-service.component').then(
                (m) => m.SelectServiceComponent
              ),
          },
          {
            path: 'date-time',
            loadComponent: () =>
              import('./pages/booking/steps/select-date-time/select-date-time.component').then(
                (m) => m.SelectDateTimeComponent
              ),
          },
          {
            path: 'barber',
            loadComponent: () =>
              import('./pages/booking/steps/select-barber/select-barber.component').then(
                (m) => m.SelectBarberComponent
              ),
          },
          {
            path: 'payment',
            loadComponent: () =>
              import('./pages/booking/steps/payment/payment.component').then(
                (m) => m.PaymentComponent
              ),
          },
          {
            path: 'confirmation',
            loadComponent: () =>
              import('./pages/booking/steps/confirmation/confirmation.component').then(
                (m) => m.ConfirmationComponent
              ),
          },
        ],
      },
      {
        path: 'my-bookings',
        loadComponent: () =>
          import('./pages/dashboard/my-bookings/my-bookings.component').then(
            (m) => m.MyBookingsComponent
          ),
      },
      {
        path: 'auth/login',
        loadComponent: () =>
          import('./pages/auth/login/login.component').then((m) => m.LoginComponent),
      },
      {
        path: 'profile',
        loadComponent: () =>
          import('./pages/auth/profile/profile.component').then((m) => m.ProfileComponent),
      },
    ],
  },
  {
    path: 'admin',
    loadComponent: () =>
      import('./components/layout/admin-layout/admin-layout.component').then(
        (m) => m.AdminLayoutComponent
      ),
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      {
        path: 'dashboard',
        loadComponent: () =>
          import('./pages/admin/dashboard/admin-dashboard.component').then(
            (m) => m.AdminDashboardComponent
          ),
      },
    ],
  },
  {
    path: 'branch-admin',
    loadComponent: () =>
      import('./components/layout/admin-layout/admin-layout.component').then(
        (m) => m.AdminLayoutComponent
      ),
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      {
        path: 'dashboard',
        loadComponent: () =>
          import('./pages/branch-admin/dashboard/branch-dashboard.component').then(
            (m) => m.BranchDashboardComponent
          ),
      },
      {
        path: 'queue',
        loadComponent: () =>
          import('./pages/branch-admin/queue-manager/queue-manager.component').then(
            (m) => m.QueueManagerComponent
          ),
      },
    ],
  },
  {
    path: 'staff',
    loadComponent: () =>
      import('./components/layout/staff-layout/staff-layout.component').then(
        (m) => m.StaffLayoutComponent
      ),
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      {
        path: 'dashboard',
        loadComponent: () =>
          import('./pages/staff/dashboard/staff-dashboard.component').then(
            (m) => m.StaffDashboardComponent
          ),
      },
      {
        path: 'queue',
        loadComponent: () =>
          import('./pages/staff/queue/staff-queue.component').then((m) => m.StaffQueueComponent),
      },
    ],
  },
  {
    path: 'public',
    children: [
      {
        path: 'queue-display',
        loadComponent: () =>
          import('./pages/public/queue-display/queue-display.component').then(
            (m) => m.QueueDisplayComponent
          ),
      },
      {
        path: 'qr',
        loadComponent: () =>
          import('./pages/public/qr-landing/qr-landing.component').then(
            (m) => m.QrLandingComponent
          ),
      },
    ],
  },
  { path: '**', redirectTo: '' },
];
