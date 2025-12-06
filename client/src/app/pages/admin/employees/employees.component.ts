import { Component, signal, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ToastService } from '../../../core/services/toast.service';
import { LanguageService } from '../../../core/services/language.service';
import { DeleteConfirmationModalComponent } from '../../../components/shared/delete-confirmation-modal/delete-confirmation-modal.component';

interface Employee {
  id: number;
  name: string;
  phone: string;
  photo?: string;
  role: string;
  branch: string;
  branchId: number;
  status: string;
  rating: number;
}

@Component({
  selector: 'app-employees',
  standalone: true,
  imports: [CommonModule, FormsModule, DeleteConfirmationModalComponent],
  template: `
    <div class="space-y-6">
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 class="text-2xl md:text-3xl font-bold" [style.color]="'var(--text-primary)'">
            {{ langService.t().employeesManagement }}
          </h1>
          <p class="text-sm md:text-base mt-1" [style.color]="'var(--text-secondary)'">
            {{ langService.t().manageStaff }}
          </p>
        </div>
        <button class="btn-primary" (click)="openAddModal()">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M12 4v16m8-8H4"
            />
          </svg>
          {{ langService.t().addEmployee }}
        </button>
      </div>

      <!-- Stats Cards -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div class="card p-4 md:p-6">
          <p class="text-xs md:text-sm" [style.color]="'var(--text-secondary)'">
            {{ langService.t().totalEmployees }}
          </p>
          <h3 class="text-2xl md:text-3xl font-bold mt-1" [style.color]="'var(--text-primary)'">
            {{ employees().length }}
          </h3>
        </div>
        <div class="card p-4 md:p-6">
          <p class="text-xs md:text-sm" [style.color]="'var(--text-secondary)'">
            {{ langService.t().activeToday }}
          </p>
          <h3 class="text-2xl md:text-3xl font-bold mt-1 text-green-600">
            {{ getActiveEmployees() }}
          </h3>
        </div>
        <div class="card p-4 md:p-6">
          <p class="text-xs md:text-sm" [style.color]="'var(--text-secondary)'">
            {{ langService.t().onLeave }}
          </p>
          <h3 class="text-2xl md:text-3xl font-bold mt-1 text-orange-600">
            {{ getOnLeaveEmployees() }}
          </h3>
        </div>
        <div class="card p-4 md:p-6">
          <p class="text-xs md:text-sm" [style.color]="'var(--text-secondary)'">
            {{ langService.t().avgPerformance }}
          </p>
          <h3 class="text-2xl md:text-3xl font-bold mt-1" [style.color]="'var(--text-primary)'">
            {{ getAvgRating() }}⭐
          </h3>
        </div>
      </div>

      <!-- Employees List -->
      <div class="card">
        <div class="p-4 md:p-6 border-b" [style.border-color]="'var(--border-light)'">
          <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <h2 class="text-lg font-semibold" [style.color]="'var(--text-primary)'">
              {{ langService.t().allEmployees }}
            </h2>
            <div class="flex gap-2">
              <!-- Name Filter -->
              <input
                type="text"
                [(ngModel)]="nameFilter"
                [placeholder]="langService.t().filterByName"
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
                {{ langService.t().export }}
              </button>
            </div>
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
                  {{ langService.t().phone }}
                </th>
                <th
                  class="px-4 py-3 text-left text-xs font-medium uppercase"
                  [style.color]="'var(--text-tertiary)'"
                >
                  {{ langService.t().role }}
                </th>
                <th
                  class="px-4 py-3 text-left text-xs font-medium uppercase"
                  [style.color]="'var(--text-tertiary)'"
                >
                  {{ langService.t().branch }}
                </th>
                <th
                  class="px-4 py-3 text-left text-xs font-medium uppercase"
                  [style.color]="'var(--text-tertiary)'"
                >
                  {{ langService.t().status }}
                </th>
                <th
                  class="px-4 py-3 text-left text-xs font-medium uppercase"
                  [style.color]="'var(--text-tertiary)'"
                >
                  {{ langService.t().rating }}
                </th>
                <th
                  class="px-4 py-3 text-left text-xs font-medium uppercase"
                  [style.color]="'var(--text-tertiary)'"
                >
                  {{ langService.t().actions }}
                </th>
              </tr>
            </thead>
            <tbody class="divide-y" [style.divide-color]="'var(--border-light)'">
              @for (employee of filteredEmployees(); track employee.id) {
              <tr
                class="hover:bg-opacity-50 dark:hover:bg-opacity-50 transition-colors cursor-pointer"
                style="hover:background-color: var(--bg-tertiary)"
              >
                <td class="px-4 py-3">
                  <div class="flex items-center gap-3">
                    @if (employee.photo) {
                    <img
                      [src]="employee.photo"
                      class="w-10 h-10 rounded-full object-cover"
                      [alt]="employee.name"
                    />
                    } @else {
                    <div
                      class="w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold text-sm"
                      style="background: var(--color-primary-500)"
                    >
                      {{ employee.name.charAt(0) }}
                    </div>
                    }
                    <span class="font-medium" [style.color]="'var(--text-primary)'">{{
                      employee.name
                    }}</span>
                  </div>
                </td>
                <td class="px-4 py-3 text-sm" [style.color]="'var(--text-secondary)'">
                  {{ employee.phone }}
                </td>
                <td class="px-4 py-3 text-sm" [style.color]="'var(--text-secondary)'">
                  {{ employee.role }}
                </td>
                <td class="px-4 py-3 text-sm" [style.color]="'var(--text-secondary)'">
                  {{ employee.branch }}
                </td>
                <td class="px-4 py-3">
                  <span
                    class="badge"
                    [class.badge-success]="employee.status === 'Active'"
                    [class.badge-warning]="employee.status === 'On Leave'"
                  >
                    {{ employee.status }}
                  </span>
                </td>
                <td class="px-4 py-3 text-sm" [style.color]="'var(--text-primary)'">
                  {{ employee.rating }} ⭐
                </td>
                <td class="px-4 py-3">
                  <div class="flex gap-2">
                    <button
                      class="text-blue-600 hover:text-blue-800 text-sm font-medium"
                      (click)="openEditModal(employee)"
                    >
                      {{ langService.t().edit }}
                    </button>
                    <button
                      class="text-red-600 hover:text-red-800 text-sm font-medium"
                      (click)="openDeleteModal(employee)"
                    >
                      {{ langService.t().delete }}
                    </button>
                  </div>
                </td>
              </tr>
              } @empty {
              <tr>
                <td
                  colspan="7"
                  class="px-4 py-8 text-center"
                  [style.color]="'var(--text-secondary)'"
                >
                  {{ langService.t().noEmployeesFound }} "{{ nameFilter() }}"
                </td>
              </tr>
              }
            </tbody>
          </table>
        </div>

        <!-- Add/Edit Employee Modal -->
        @if (showModal()) {
        <div
          class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
          (click)="closeModal()"
        >
          <div
            class="bg-white dark:bg-gray-800 rounded-2xl w-full max-w-md max-h-[90vh] overflow-y-auto shadow-xl"
            [style.background-color]="'var(--bg-secondary)'"
            (click)="$event.stopPropagation()"
          >
            <div
              class="p-6 border-b flex items-center justify-between"
              [style.border-color]="'var(--border-light)'"
            >
              <h3 class="text-xl font-bold" [style.color]="'var(--text-primary)'">
                {{ isEditMode() ? langService.t().editEmployee : langService.t().addNewEmployee }}
              </h3>
              <button
                (click)="closeModal()"
                class="transition-colors hover:opacity-70"
                [style.color]="'var(--text-tertiary)'"
              >
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
            <div class="p-6">
              <form (ngSubmit)="saveEmployee()" class="space-y-4">
                <!-- Photo Upload -->
                <div>
                  <label
                    class="block text-sm font-medium mb-2"
                    [style.color]="'var(--text-primary)'"
                    >{{ langService.t().employeePhoto }}</label
                  >
                  <div class="flex items-center gap-4">
                    @if (formData().photo) {
                    <img [src]="formData().photo" class="w-20 h-20 rounded-full object-cover" />
                    } @else {
                    <div
                      class="w-20 h-20 rounded-full flex items-center justify-center text-2xl text-white"
                      style="background: var(--color-primary-500)"
                    >
                      👤
                    </div>
                    }
                    <div class="flex-1">
                      <input
                        type="file"
                        #fileInput
                        (change)="onFileSelected($event)"
                        accept="image/*"
                        class="hidden"
                      />
                      <button
                        type="button"
                        (click)="fileInput.click()"
                        class="btn-outline text-sm w-full"
                      >
                        {{ langService.t().choosePhoto }}
                      </button>
                    </div>
                  </div>
                </div>

                <!-- Name -->
                <div>
                  <label
                    class="block text-sm font-medium mb-2"
                    [style.color]="'var(--text-primary)'"
                    >{{ langService.t().fullName }} *</label
                  >
                  <input
                    type="text"
                    [(ngModel)]="formData().name"
                    name="name"
                    required
                    class="input w-full"
                    placeholder="Enter full name"
                  />
                </div>

                <!-- Phone -->
                <div>
                  <label
                    class="block text-sm font-medium mb-2"
                    [style.color]="'var(--text-primary)'"
                    >{{ langService.t().phoneNumber }} *</label
                  >
                  <input
                    type="tel"
                    [(ngModel)]="formData().phone"
                    name="phone"
                    required
                    class="input w-full"
                    placeholder="+1 234 567 8900"
                  />
                </div>

                <!-- Branch -->
                <div>
                  <label
                    class="block text-sm font-medium mb-2"
                    [style.color]="'var(--text-primary)'"
                    >{{ langService.t().branch }} *</label
                  >
                  <select
                    [(ngModel)]="formData().branchId"
                    name="branchId"
                    required
                    class="input w-full"
                  >
                    <option value="">{{ langService.t().selectBranch }}</option>
                    @for (branch of availableBranches; track branch.id) {
                    <option [value]="branch.id">{{ branch.name }}</option>
                    }
                  </select>
                </div>

                <!-- Actions -->
                <div class="flex gap-3 pt-4">
                  <button type="button" (click)="closeModal()" class="btn-outline flex-1">
                    {{ langService.t().cancel }}
                  </button>
                  <button type="submit" class="btn-primary flex-1">
                    {{ isEditMode() ? langService.t().update : langService.t().create }}
                    {{ langService.t().employees }}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
        }

        <!-- Delete Confirmation Modal -->
        @if (showDeleteModal()) {
        <app-delete-confirmation-modal
          [entityType]="'employee'"
          [entityName]="employeeToDelete()?.name || ''"
          (confirmed)="confirmDelete()"
          (cancelled)="closeDeleteModal()"
        />
        }
      </div>
    </div>
  `,
})
export class EmployeesComponent {
  private toastService = inject(ToastService);
  langService = inject(LanguageService);

  employees = signal<Employee[]>([
    {
      id: 1,
      name: 'Ahmed Hassan',
      phone: '+20 123 456 7890',
      role: 'Senior Barber',
      branch: 'Downtown Elite',
      branchId: 1,
      status: 'Active',
      rating: 4.9,
    },
    {
      id: 2,
      name: 'Mohamed Ali',
      phone: '+20 123 456 7891',
      role: 'Barber',
      branch: 'Zamalek Classic',
      branchId: 2,
      status: 'Active',
      rating: 4.7,
    },
    {
      id: 3,
      name: 'Omar Khaled',
      phone: '+20 123 456 7892',
      role: 'Junior Barber',
      branch: 'New Cairo Hub',
      branchId: 3,
      status: 'Active',
      rating: 4.5,
    },
    {
      id: 4,
      name: 'Karim Youssef',
      phone: '+20 123 456 7893',
      role: 'Senior Barber',
      branch: 'Alexandria Bay',
      branchId: 4,
      status: 'On Leave',
      rating: 4.8,
    },
    {
      id: 5,
      name: 'Tarek Mahmoud',
      phone: '+20 123 456 7894',
      role: 'Barber',
      branch: 'Downtown Elite',
      branchId: 1,
      status: 'Active',
      rating: 4.6,
    },
  ]);

  availableBranches = [
    { id: 1, name: 'Downtown Elite' },
    { id: 2, name: 'Zamalek Classic' },
    { id: 3, name: 'New Cairo Hub' },
    { id: 4, name: 'Alexandria Bay' },
    { id: 5, name: 'Giza Plaza' },
  ];

  nameFilter = signal('');
  showModal = signal(false);
  showDeleteModal = signal(false);
  isEditMode = signal(false);
  employeeToDelete = signal<Employee | null>(null);
  formData = signal<Partial<Employee>>({});

  filteredEmployees = computed(() => {
    const filter = this.nameFilter().toLowerCase().trim();
    if (!filter) return this.employees();
    return this.employees().filter((emp) => emp.name.toLowerCase().includes(filter));
  });

  getActiveEmployees() {
    return this.employees().filter((e) => e.status === 'Active').length;
  }

  getOnLeaveEmployees() {
    return this.employees().filter((e) => e.status === 'On Leave').length;
  }

  getAvgRating() {
    const total = this.employees().reduce((sum, e) => sum + e.rating, 0);
    return (total / this.employees().length).toFixed(1);
  }

  openAddModal() {
    this.isEditMode.set(false);
    this.formData.set({ status: 'Active', role: 'Barber', rating: 4.5 });
    this.showModal.set(true);
  }

  openEditModal(employee: Employee) {
    this.isEditMode.set(true);
    this.formData.set({ ...employee });
    this.showModal.set(true);
  }

  closeModal() {
    this.showModal.set(false);
    this.formData.set({});
  }

  onFileSelected(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        this.formData.update((data) => ({ ...data, photo: e.target?.result as string }));
      };
      reader.readAsDataURL(file);
    }
  }

  saveEmployee() {
    const data = this.formData();
    if (!data.name || !data.phone || !data.branchId) {
      this.toastService.error('Validation Error', 'Please fill all required fields');
      return;
    }

    const branch = this.availableBranches.find((b) => b.id === data.branchId);
    if (!branch) {
      this.toastService.error('Error', 'Invalid branch selected');
      return;
    }

    if (this.isEditMode()) {
      // Update existing employee
      this.employees.update((employees) =>
        employees.map((e) =>
          e.id === data.id ? ({ ...e, ...data, branch: branch.name } as Employee) : e
        )
      );
      this.toastService.success('Success', 'Employee updated successfully');
    } else {
      // Add new employee
      const newEmployee: Employee = {
        id: Math.max(...this.employees().map((e) => e.id)) + 1,
        name: data.name!,
        phone: data.phone!,
        photo: data.photo,
        role: data.role || 'Barber',
        branch: branch.name,
        branchId: data.branchId!,
        status: 'Active',
        rating: 4.5,
      };
      this.employees.update((employees) => [...employees, newEmployee]);
      this.toastService.success('Success', 'Employee added successfully');
    }

    this.closeModal();
  }

  openDeleteModal(employee: Employee) {
    this.employeeToDelete.set(employee);
    this.showDeleteModal.set(true);
  }

  closeDeleteModal() {
    this.showDeleteModal.set(false);
    this.employeeToDelete.set(null);
  }

  confirmDelete() {
    const employee = this.employeeToDelete();
    if (employee) {
      this.employees.update((employees) => employees.filter((e) => e.id !== employee.id));
      this.toastService.success('Deleted', `Employee "${employee.name}" has been deleted`);
      this.closeDeleteModal();
    }
  }

  exportData() {
    this.toastService.success('Export', 'Employees data exported successfully');
  }
}
