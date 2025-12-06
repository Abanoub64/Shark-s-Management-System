import { Component, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ToastService } from '../../../core/services/toast.service';
import { DeleteConfirmationModalComponent } from '../../../components/shared/delete-confirmation-modal/delete-confirmation-modal.component';

interface Branch {
  id: number;
  name: string;
  location: string;
  managerName: string;
  photo?: string;
  staff: number;
  status: string;
  revenue: number;
}

@Component({
  selector: 'app-branches',
  standalone: true,
  imports: [CommonModule, FormsModule, DeleteConfirmationModalComponent],
  template: `
    <div class="space-y-6">
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 class="text-2xl md:text-3xl font-bold" [style.color]="'var(--text-primary)'">
            Branches Management
          </h1>
          <p class="text-sm md:text-base mt-1" [style.color]="'var(--text-secondary)'">
            Manage all your barber shop locations
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
          Add Branch
        </button>
      </div>

      <!-- Stats Cards -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div class="card p-4 md:p-6">
          <p class="text-xs md:text-sm" [style.color]="'var(--text-secondary)'">Total Branches</p>
          <h3 class="text-2xl md:text-3xl font-bold mt-1" [style.color]="'var(--text-primary)'">
            {{ branches().length }}
          </h3>
        </div>
        <div class="card p-4 md:p-6">
          <p class="text-xs md:text-sm" [style.color]="'var(--text-secondary)'">Active</p>
          <h3 class="text-2xl md:text-3xl font-bold mt-1 text-green-600">
            {{ getActiveBranches() }}
          </h3>
        </div>
        <div class="card p-4 md:p-6">
          <p class="text-xs md:text-sm" [style.color]="'var(--text-secondary)'">Inactive</p>
          <h3 class="text-2xl md:text-3xl font-bold mt-1 text-orange-600">
            {{ getInactiveBranches() }}
          </h3>
        </div>
        <div class="card p-4 md:p-6">
          <p class="text-xs md:text-sm" [style.color]="'var(--text-secondary)'">
            Avg Revenue/Branch
          </p>
          <h3 class="text-2xl md:text-3xl font-bold mt-1" [style.color]="'var(--text-primary)'">
            \${{ getAvgRevenue() | number }}
          </h3>
        </div>
      </div>

      <!-- Branches List -->
      <div class="card">
        <div class="p-4 md:p-6 border-b" [style.border-color]="'var(--border-light)'">
          <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <h2 class="text-lg font-semibold" [style.color]="'var(--text-primary)'">
              All Branches
            </h2>
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
                  Branch Name
                </th>
                <th
                  class="px-4 py-3 text-left text-xs font-medium uppercase"
                  [style.color]="'var(--text-tertiary)'"
                >
                  Location
                </th>
                <th
                  class="px-4 py-3 text-left text-xs font-medium uppercase"
                  [style.color]="'var(--text-tertiary)'"
                >
                  Manager
                </th>
                <th
                  class="px-4 py-3 text-left text-xs font-medium uppercase"
                  [style.color]="'var(--text-tertiary)'"
                >
                  Staff
                </th>
                <th
                  class="px-4 py-3 text-left text-xs font-medium uppercase"
                  [style.color]="'var(--text-tertiary)'"
                >
                  Status
                </th>
                <th
                  class="px-4 py-3 text-left text-xs font-medium uppercase"
                  [style.color]="'var(--text-tertiary)'"
                >
                  Revenue
                </th>
                <th
                  class="px-4 py-3 text-left text-xs font-medium uppercase"
                  [style.color]="'var(--text-tertiary)'"
                >
                  Actions
                </th>
              </tr>
            </thead>
            <tbody class="divide-y" [style.divide-color]="'var(--border-light)'">
              @for (branch of branches(); track branch.id) {
              <tr
                class="hover:bg-opacity-50 dark:hover:bg-opacity-50 transition-colors cursor-pointer"
                style="hover:background-color: var(--bg-tertiary)"
              >
                <td class="px-4 py-3">
                  <div class="flex items-center gap-3">
                    @if (branch.photo) {
                    <img
                      [src]="branch.photo"
                      class="w-10 h-10 rounded-lg object-cover"
                      [alt]="branch.name"
                    />
                    } @else {
                    <div
                      class="w-10 h-10 rounded-lg flex items-center justify-center text-white font-semibold"
                      style="background: var(--color-primary-500)"
                    >
                      {{ branch.name.charAt(0) }}
                    </div>
                    }
                    <span class="font-medium" [style.color]="'var(--text-primary)'">{{
                      branch.name
                    }}</span>
                  </div>
                </td>
                <td class="px-4 py-3 text-sm" [style.color]="'var(--text-secondary)'">
                  {{ branch.location }}
                </td>
                <td class="px-4 py-3 text-sm" [style.color]="'var(--text-secondary)'">
                  {{ branch.managerName }}
                </td>
                <td class="px-4 py-3 text-sm" [style.color]="'var(--text-secondary)'">
                  {{ branch.staff }}
                </td>
                <td class="px-4 py-3">
                  <span
                    class="badge"
                    [class.badge-success]="branch.status === 'Active'"
                    [class.badge-warning]="branch.status === 'Inactive'"
                  >
                    {{ branch.status }}
                  </span>
                </td>
                <td class="px-4 py-3 font-medium" [style.color]="'var(--text-primary)'">
                  \${{ branch.revenue | number }}
                </td>
                <td class="px-4 py-3">
                  <div class="flex gap-2">
                    <button
                      class="text-blue-600 hover:text-blue-800 text-sm font-medium"
                      (click)="openEditModal(branch)"
                    >
                      Edit
                    </button>
                    <button
                      class="text-red-600 hover:text-red-800 text-sm font-medium"
                      (click)="openDeleteModal(branch)"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
              }
            </tbody>
          </table>
        </div>

        <!-- Add/Edit Branch Modal -->
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
                {{ isEditMode() ? 'Edit' : 'Add New' }} Branch
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
              <form (ngSubmit)="saveBranch()" class="space-y-4">
                <!-- Photo Upload -->
                <div>
                  <label
                    class="block text-sm font-medium mb-2"
                    [style.color]="'var(--text-primary)'"
                    >Branch Photo</label
                  >
                  <div class="flex items-center gap-4">
                    @if (formData().photo) {
                    <img [src]="formData().photo" class="w-20 h-20 rounded-lg object-cover" />
                    } @else {
                    <div
                      class="w-20 h-20 rounded-lg flex items-center justify-center text-2xl text-white"
                      style="background: var(--color-primary-500)"
                    >
                      🏢
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
                        Choose Photo
                      </button>
                    </div>
                  </div>
                </div>

                <!-- Branch Name -->
                <div>
                  <label
                    class="block text-sm font-medium mb-2"
                    [style.color]="'var(--text-primary)'"
                    >Branch Name *</label
                  >
                  <input
                    type="text"
                    [(ngModel)]="formData().name"
                    name="name"
                    required
                    class="input w-full"
                    placeholder="Enter branch name"
                  />
                </div>

                <!-- Location -->
                <div>
                  <label
                    class="block text-sm font-medium mb-2"
                    [style.color]="'var(--text-primary)'"
                    >Location *</label
                  >
                  <input
                    type="text"
                    [(ngModel)]="formData().location"
                    name="location"
                    required
                    class="input w-full"
                    placeholder="Enter location"
                  />
                </div>

                <!-- Manager Name -->
                <div>
                  <label
                    class="block text-sm font-medium mb-2"
                    [style.color]="'var(--text-primary)'"
                    >Manager Name *</label
                  >
                  <input
                    type="text"
                    [(ngModel)]="formData().managerName"
                    name="managerName"
                    required
                    class="input w-full"
                    placeholder="Enter manager name"
                  />
                </div>

                <!-- Actions -->
                <div class="flex gap-3 pt-4">
                  <button type="button" (click)="closeModal()" class="btn-outline flex-1">
                    Cancel
                  </button>
                  <button type="submit" class="btn-primary flex-1">
                    {{ isEditMode() ? 'Update' : 'Create' }} Branch
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
          [entityType]="'branch'"
          [entityName]="branchToDelete()?.name || ''"
          (confirmed)="confirmDelete()"
          (cancelled)="closeDeleteModal()"
        />
        }
      </div>
    </div>
  `,
})
export class BranchesComponent {
  private toastService = inject(ToastService);

  branches = signal<Branch[]>([
    {
      id: 1,
      name: 'Downtown Elite',
      location: 'Cairo Downtown',
      managerName: 'Ahmed Hassan',
      staff: 8,
      status: 'Active',
      revenue: 45000,
    },
    {
      id: 2,
      name: 'Zamalek Classic',
      location: 'Zamalek',
      managerName: 'Mohamed Ali',
      staff: 6,
      status: 'Active',
      revenue: 38000,
    },
    {
      id: 3,
      name: 'New Cairo Hub',
      location: 'New Cairo',
      managerName: 'Omar Khaled',
      staff: 10,
      status: 'Active',
      revenue: 52000,
    },
    {
      id: 4,
      name: 'Alexandria Bay',
      location: 'Alexandria',
      managerName: 'Karim Youssef',
      staff: 7,
      status: 'Active',
      revenue: 41000,
    },
    {
      id: 5,
      name: 'Giza Plaza',
      location: 'Giza',
      managerName: 'Tarek Mahmoud',
      staff: 5,
      status: 'Inactive',
      revenue: 28000,
    },
  ]);

  showModal = signal(false);
  showDeleteModal = signal(false);
  isEditMode = signal(false);
  branchToDelete = signal<Branch | null>(null);
  formData = signal<Partial<Branch>>({});

  getActiveBranches() {
    return this.branches().filter((b) => b.status === 'Active').length;
  }

  getInactiveBranches() {
    return this.branches().filter((b) => b.status === 'Inactive').length;
  }

  getAvgRevenue() {
    const total = this.branches().reduce((sum, b) => sum + b.revenue, 0);
    return Math.round(total / this.branches().length);
  }

  openAddModal() {
    this.isEditMode.set(false);
    this.formData.set({ status: 'Active', staff: 0, revenue: 0 });
    this.showModal.set(true);
  }

  openEditModal(branch: Branch) {
    this.isEditMode.set(true);
    this.formData.set({ ...branch });
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

  saveBranch() {
    const data = this.formData();
    if (!data.name || !data.location || !data.managerName) {
      this.toastService.error('Validation Error', 'Please fill all required fields');
      return;
    }

    if (this.isEditMode()) {
      // Update existing branch
      this.branches.update((branches) =>
        branches.map((b) => (b.id === data.id ? ({ ...b, ...data } as Branch) : b))
      );
      this.toastService.success('Success', 'Branch updated successfully');
    } else {
      // Add new branch
      const newBranch: Branch = {
        id: Math.max(...this.branches().map((b) => b.id)) + 1,
        name: data.name!,
        location: data.location!,
        managerName: data.managerName!,
        photo: data.photo,
        staff: 0,
        status: 'Active',
        revenue: 0,
      };
      this.branches.update((branches) => [...branches, newBranch]);
      this.toastService.success('Success', 'Branch created successfully');
    }

    this.closeModal();
  }

  openDeleteModal(branch: Branch) {
    this.branchToDelete.set(branch);
    this.showDeleteModal.set(true);
  }

  closeDeleteModal() {
    this.showDeleteModal.set(false);
    this.branchToDelete.set(null);
  }

  confirmDelete() {
    const branch = this.branchToDelete();
    if (branch) {
      this.branches.update((branches) => branches.filter((b) => b.id !== branch.id));
      this.toastService.success('Deleted', `Branch "${branch.name}" has been deleted`);
      this.closeDeleteModal();
    }
  }

  exportData() {
    this.toastService.success('Export', 'Branches data exported successfully');
  }
}
