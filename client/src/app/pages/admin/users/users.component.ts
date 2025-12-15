import { Component, signal, inject, OnInit, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { environment } from '../../../../environments/environment';
import { ToastService } from '../../../core/services/toast.service';
import { LanguageService } from '../../../core/services/language.service';
import { UiSkeletonComponent } from '../../../components/shared/ui-skeleton.component';

export interface UserDto {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  roles: string[];
}

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [CommonModule, FormsModule, UiSkeletonComponent],
  template: `
    <div class="space-y-6">
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 class="text-2xl md:text-3xl font-bold" [style.color]="'var(--text-primary)'">
            {{ langService.t().usersManagement }}
          </h1>
          <p class="text-sm md:text-base mt-1" [style.color]="'var(--text-secondary)'">
            {{ langService.t().viewManageUsers }}
          </p>
        </div>
      </div>

      <!-- Users List -->
      <div class="card">
        <div
          class="p-4 md:p-6 border-b flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
          [style.border-color]="'var(--border-light)'"
        >
          <h2 class="text-lg font-semibold" [style.color]="'var(--text-primary)'">
            {{ langService.t().allUsers }}
          </h2>
          <div class="flex gap-2">
            <!-- Search Input -->
            <input
              type="text"
              [(ngModel)]="searchTerm"
              [placeholder]="langService.t().search + '...'"
              class="input text-sm py-2 px-3 w-full sm:w-64"
            />
            <button class="btn-outline text-sm" (click)="exportData()">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              Export
            </button>
          </div>
        </div>

        <div class="overflow-x-auto">
          <table class="w-full">
            <thead
              class="border-b"
              [style.border-color]="'var(--border-light)'"
              [style.background-color]="'var(--bg-tertiary)'"
            >
              <tr>
                <th
                  class="px-4 py-3 text-left text-xs font-medium uppercase"
                  [style.color]="'var(--text-tertiary)'"
                >
                  {{ langService.t().name }}
                </th>
                <th
                  class="px-4 py-3 text-left text-xs font-medium uppercase"
                  [style.color]="'var(--text-tertiary)'"
                >
                  {{ langService.t().email }}
                </th>
                <th
                  class="px-4 py-3 text-left text-xs font-medium uppercase"
                  [style.color]="'var(--text-tertiary)'"
                >
                  {{ langService.t().phone }}
                </th>
                <th
                  class="px-4 py-3 text-left text-xs font-medium uppercase"
                  [style.color]="'var(--text-tertiary)'"
                >
                  {{ langService.t().roles }}
                </th>
              </tr>
            </thead>
            <tbody class="divide-y" [style.divide-color]="'var(--border-light)'">
              @if (isLoading()) { @for (item of [1, 2, 3, 4, 5]; track item) {
              <tr>
                <td class="px-4 py-3"><app-ui-skeleton width="150px"></app-ui-skeleton></td>
                <td class="px-4 py-3"><app-ui-skeleton width="180px"></app-ui-skeleton></td>
                <td class="px-4 py-3"><app-ui-skeleton width="120px"></app-ui-skeleton></td>
                <td class="px-4 py-3">
                  <div class="flex gap-1">
                    <app-ui-skeleton width="60px" borderRadius="9999px"></app-ui-skeleton>
                    <app-ui-skeleton width="60px" borderRadius="9999px"></app-ui-skeleton>
                  </div>
                </td>
              </tr>
              } } @else if (users().length === 0) {
              <tr>
                <td
                  colspan="4"
                  class="px-4 py-8 text-center"
                  [style.color]="'var(--text-secondary)'"
                >
                  {{ langService.t().noUsersFound }}
                </td>
              </tr>
              } @else { @for (user of filteredUsers(); track user.id) {
              <tr
                class="hover:bg-opacity-50 dark:hover:bg-opacity-50 transition-colors"
                style="hover:background-color: var(--bg-tertiary)"
              >
                <td class="px-4 py-3 text-sm font-medium" [style.color]="'var(--text-primary)'">
                  {{ user.firstName }} {{ user.lastName }}
                </td>
                <td class="px-4 py-3 text-sm" [style.color]="'var(--text-secondary)'">
                  {{ user.email }}
                </td>
                <td class="px-4 py-3 text-sm" [style.color]="'var(--text-secondary)'">
                  {{ user.phoneNumber }}
                </td>
                <td class="px-4 py-3">
                  <div class="flex flex-wrap gap-1">
                    @for (role of user.roles; track role) {
                    <span
                      class="badge"
                      [class.badge-success]="role === 'Admin'"
                      [class.badge-warning]="role === 'BranchManager'"
                      [class.badge-info]="role === 'Customer'"
                    >
                      {{ role }}
                    </span>
                    }
                  </div>
                </td>
              </tr>
              } }
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `,
})
export class UsersComponent implements OnInit {
  private http = inject(HttpClient);
  private toastService = inject(ToastService);
  langService = inject(LanguageService);

  users = signal<UserDto[]>([]);
  isLoading = signal(true);
  searchTerm = signal('');

  filteredUsers = computed(() => {
    const term = this.searchTerm().toLowerCase();
    if (!term) return this.users();
    return this.users().filter(
      (u) =>
        (u.firstName + ' ' + u.lastName).toLowerCase().includes(term) ||
        u.email.toLowerCase().includes(term)
    );
  });

  ngOnInit() {
    this.loadUsers();
  }

  loadUsers() {
    this.isLoading.set(true);
    this.http.get<UserDto[]>(`${environment.apiUrl}/Users/non-admin`).subscribe({
      next: (users) => {
        this.users.set(users);
        this.isLoading.set(false);
      },
      error: (error) => {
        console.error('Error loading users:', error);
        this.toastService.error('Error', 'Failed to load users');
        this.isLoading.set(false);
      },
    });
  }

  exportData() {
    const rows = this.filteredUsers();
    if (!rows.length) {
      this.toastService.error('Export', 'No data to export');
      return;
    }

    const headers = ['First Name', 'Last Name', 'Email', 'Phone', 'Roles'];
    const csvBody = [
      headers,
      ...rows.map((u) => [
        u.firstName ?? '',
        u.lastName ?? '',
        u.email ?? '',
        u.phoneNumber ?? '',
        u.roles?.join('; ') ?? '',
      ]),
    ]
      .map((row) => row.map((cell) => this.escapeCsv(cell)).join(','))
      .join('\n');

    const blob = new Blob(['\uFEFF' + csvBody], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'users.csv';
    link.click();
    URL.revokeObjectURL(url);

    this.toastService.success('Export', 'Users CSV downloaded');
  }

  private escapeCsv(value: string): string {
    const str = value ?? '';
    if (str.includes('"') || str.includes(',') || str.includes('\n')) {
      return `"${str.replace(/"/g, '""')}"`;
    }
    return str;
  }
}
