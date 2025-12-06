import { Routes } from '@angular/router';

// ============================================
// ROUTE CONFIGURATION
// ============================================

export const routes: Routes = [
  // Public Routes (Main Layout)
  {
    path: '',
    loadComponent: () =>
      import('./components/layout/main-layout/main-layout.component').then(
        (m) => m.MainLayoutComponent
      ),
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./pages/home/landing-page/landing-page.component').then(
            (m) => m.LandingPageComponent
          ),
      },
      {
        path: 'store',
        loadComponent: () => import('./pages/store/store.component').then((m) => m.StoreComponent),
      },

      // Branches
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

      // Booking Flow
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

      // User Dashboard
      {
        path: 'my-bookings',
        loadComponent: () =>
          import('./pages/dashboard/my-bookings/my-bookings.component').then(
            (m) => m.MyBookingsComponent
          ),
      },

      // Authentication
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

  // Super Admin Routes
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
      {
        path: 'branches',
        loadComponent: () =>
          import('./pages/admin/branches/branches.component').then((m) => m.BranchesComponent),
      },
      {
        path: 'employees',
        loadComponent: () =>
          import('./pages/admin/employees/employees.component').then((m) => m.EmployeesComponent),
      },
      {
        path: 'services',
        loadComponent: () =>
          import('./pages/admin/services/services.component').then((m) => m.ServicesComponent),
      },
      {
        path: 'bookings',
        loadComponent: () =>
          import('./pages/admin/bookings/bookings.component').then((m) => m.BookingsComponent),
      },
      {
        path: 'analytics',
        loadComponent: () =>
          import('./pages/admin/analytics/analytics.component').then((m) => m.AnalyticsComponent),
      },
    ],
  },

  // Branch Admin Routes
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
      // TODO: Add more branch-admin routes (schedule, staff, analytics, promotions, etc.)
    ],
  },

  // Staff/Barber Routes
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
      // TODO: Add more staff routes (performance, availability, etc.)
    ],
  },

  // Public Queue System Routes
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
      // TODO: Add more public routes (walk-in, queue-status, etc.)
    ],
  },

  // Fallback
  { path: '**', redirectTo: '' },
];
