import { Component, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ToastService } from '../../../core/services/toast.service';
import { DeleteConfirmationModalComponent } from '../../../components/shared/delete-confirmation-modal/delete-confirmation-modal.component';

interface Service {
  id: number;
  name: string;
  price: number;
  description: string;
  category: string;
  duration: number;
  bookings: number;
  icon: string;
}

@Component({
  selector: 'app-services',
  standalone: true,
  imports: [CommonModule, FormsModule, DeleteConfirmationModalComponent],
  template: `
    <div class="space-y-6">
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 class="text-2xl md:text-3xl font-bold" [style.color]="'var(--text-primary)'">
            Services Management
          </h1>
          <p class="text-sm md:text-base mt-1" [style.color]="'var(--text-secondary)'">
            Manage service catalog and pricing
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
          Add Service
        </button>
      </div>

      <!-- Stats Cards -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div class="card p-4 md:p-6">
          <p class="text-xs md:text-sm" [style.color]="'var(--text-secondary)'">Total Services</p>
          <h3 class="text-2xl md:text-3xl font-bold mt-1" [style.color]="'var(--text-primary)'">
            {{ services().length }}
          </h3>
        </div>
        <div class="card p-4 md:p-6">
          <p class="text-xs md:text-sm" [style.color]="'var(--text-secondary)'">Most Popular</p>
          <h3 class="text-lg md:text-xl font-bold mt-1" [style.color]="'var(--text-primary)'">
            {{ getMostPopular() }}
          </h3>
        </div>
        <div class="card p-4 md:p-6">
          <p class="text-xs md:text-sm" [style.color]="'var(--text-secondary)'">Avg Price</p>
          <h3 class="text-2xl md:text-3xl font-bold mt-1" [style.color]="'var(--text-primary)'">
            EGP {{ getAvgPrice() }}
          </h3>
        </div>
        <div class="card p-4 md:p-6">
          <p class="text-xs md:text-sm" [style.color]="'var(--text-secondary)'">Total Bookings</p>
          <h3 class="text-2xl md:text-3xl font-bold mt-1 text-green-600">
            {{ getTotalBookings() }}
          </h3>
        </div>
      </div>

      <!-- Services Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        @for (service of services(); track service.id) {
        <div class="card p-4 md:p-6 hover:shadow-lg transition-shadow">
          <div class="flex items-start justify-between mb-3">
            <div class="flex items-center gap-3">
              <div class="text-3xl">{{ service.icon }}</div>
              <div>
                <h3 class="font-semibold" [style.color]="'var(--text-primary)'">
                  {{ service.name }}
                </h3>
                <p class="text-xs" [style.color]="'var(--text-tertiary)'">{{ service.category }}</p>
              </div>
            </div>
            <span class="badge badge-primary">EGP {{ service.price }}</span>
          </div>

          <p class="text-sm mb-4" [style.color]="'var(--text-secondary)'">
            {{ service.description }}
          </p>

          <div
            class="flex items-center justify-between text-xs"
            [style.color]="'var(--text-tertiary)'"
          >
            <span>⏱️ {{ service.duration }} min</span>
            <span>📊 {{ service.bookings }} bookings</span>
          </div>

          <div class="flex gap-2 mt-4 pt-4 border-t" [style.border-color]="'var(--border-light)'">
            <button class="flex-1 btn-outline text-sm py-1" (click)="openEditModal(service)">
              Edit
            </button>
            <button
              class="flex-1 btn-outline text-sm py-1 text-red-600 border-red-600 hover:bg-red-50 dark:hover:bg-red-950"
              (click)="openDeleteModal(service)"
            >
              Delete
            </button>
          </div>
        </div>
        }
      </div>
    </div>

    <!-- Add/Edit Service Modal -->
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
            {{ isEditMode() ? 'Edit' : 'Add New' }} Service
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

        <form (ngSubmit)="saveService()" class="space-y-4">
          <div>
            <label class="block text-sm font-medium mb-2" [style.color]="'var(--text-primary)'"
              >Service Name *</label
            >
            <input
              type="text"
              [(ngModel)]="formData().name"
              name="name"
              required
              class="input w-full"
              placeholder="e.g., Classic Haircut"
            />
          </div>

          <div>
            <label class="block text-sm font-medium mb-2" [style.color]="'var(--text-primary)'"
              >Price (EGP) *</label
            >
            <input
              type="number"
              [(ngModel)]="formData().price"
              name="price"
              required
              min="0"
              step="0.01"
              class="input w-full"
              placeholder="250.00"
            />
          </div>

          <div>
            <label class="block text-sm font-medium mb-2" [style.color]="'var(--text-primary)'"
              >Description *</label
            >
            <textarea
              [(ngModel)]="formData().description"
              name="description"
              required
              rows="3"
              class="input w-full resize-none"
              placeholder="Describe the service..."
            ></textarea>
          </div>

          <div>
            <label class="block text-sm font-medium mb-2" [style.color]="'var(--text-primary)'"
              >Category</label
            >
            <select [(ngModel)]="formData().category" name="category" class="input w-full">
              <option value="Haircuts">Haircuts</option>
              <option value="Grooming">Grooming</option>
              <option value="Shaving">Shaving</option>
              <option value="Styling">Styling</option>
              <option value="Spa">Spa</option>
            </select>
          </div>

          <div>
            <label class="block text-sm font-medium mb-2" [style.color]="'var(--text-primary)'"
              >Duration (minutes)</label
            >
            <input
              type="number"
              [(ngModel)]="formData().duration"
              name="duration"
              min="5"
              step="5"
              class="input w-full"
              placeholder="30"
            />
          </div>

          <div>
            <label class="block text-sm font-medium mb-2" [style.color]="'var(--text-primary)'"
              >Icon (Emoji)</label
            >
            <div class="grid grid-cols-6 gap-2">
              @for (icon of availableIcons; track icon) {
              <button
                type="button"
                (click)="selectIcon(icon)"
                class="text-2xl p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                [class.ring-2]="formData().icon === icon"
                [class.ring-primary]="formData().icon === icon"
              >
                {{ icon }}
              </button>
              }
            </div>
          </div>

          <div class="flex gap-3 pt-4">
            <button type="button" (click)="closeModal()" class="btn-outline flex-1">Cancel</button>
            <button type="submit" class="btn-primary flex-1">
              {{ isEditMode() ? 'Update' : 'Create' }} Service
            </button>
          </div>
        </form>
      </div>
    </div>
    }

    <!-- Delete Confirmation Modal -->
    @if (showDeleteModal()) {
    <app-delete-confirmation-modal
      [entityType]="'service'"
      [entityName]="serviceToDelete()?.name || ''"
      (confirmed)="confirmDelete()"
      (cancelled)="closeDeleteModal()"
    />
    }
  `,
})
export class ServicesComponent {
  private toastService = inject(ToastService);

  services = signal<Service[]>([
    {
      id: 1,
      name: 'Classic Haircut',
      category: 'Haircuts',
      price: 250,
      duration: 30,
      bookings: 1250,
      icon: '✂️',
      description: 'Traditional haircut with styling',
    },
    {
      id: 2,
      name: 'Beard Trim',
      category: 'Grooming',
      price: 150,
      duration: 20,
      bookings: 890,
      icon: '🧔',
      description: 'Professional beard shaping and trim',
    },
    {
      id: 3,
      name: 'Hot Towel Shave',
      category: 'Shaving',
      price: 300,
      duration: 45,
      bookings: 560,
      icon: '🪒',
      description: 'Luxury hot towel shave experience',
    },
    {
      id: 4,
      name: 'Hair Coloring',
      category: 'Styling',
      price: 500,
      duration: 90,
      bookings: 340,
      icon: '🎨',
      description: 'Professional hair coloring service',
    },
    {
      id: 5,
      name: 'Facial Treatment',
      category: 'Spa',
      price: 400,
      duration: 60,
      bookings: 420,
      icon: '💆',
      description: 'Relaxing facial treatment',
    },
    {
      id: 6,
      name: 'Kids Haircut',
      category: 'Haircuts',
      price: 200,
      duration: 25,
      bookings: 680,
      icon: '👦',
      description: 'Special haircut for children',
    },
  ]);

  availableIcons = ['✂️', '🧔', '🪒', '💇', '💆', '👦', '🎨', '💈', '🧴', '🪮', '👨', '👩'];

  showModal = signal(false);
  showDeleteModal = signal(false);
  isEditMode = signal(false);
  serviceToDelete = signal<Service | null>(null);
  formData = signal<Partial<Service>>({});

  getMostPopular() {
    const sorted = [...this.services()].sort((a, b) => b.bookings - a.bookings);
    return sorted[0]?.name || 'N/A';
  }

  getAvgPrice() {
    const total = this.services().reduce((sum, s) => sum + s.price, 0);
    return Math.round(total / this.services().length);
  }

  getTotalBookings() {
    return this.services().reduce((sum, s) => sum + s.bookings, 0);
  }

  openAddModal() {
    this.isEditMode.set(false);
    this.formData.set({ category: 'Haircuts', duration: 30, bookings: 0, icon: '✂️' });
    this.showModal.set(true);
  }

  openEditModal(service: Service) {
    this.isEditMode.set(true);
    this.formData.set({ ...service });
    this.showModal.set(true);
  }

  selectIcon(icon: string) {
    this.formData.update((data) => ({ ...data, icon }));
  }

  closeModal() {
    this.showModal.set(false);
    this.formData.set({});
  }

  saveService() {
    const data = this.formData();
    if (!data.name || !data.price || !data.description) {
      this.toastService.error('Validation Error', 'Please fill all required fields');
      return;
    }

    if (this.isEditMode()) {
      this.services.update((services) =>
        services.map((s) => (s.id === data.id ? ({ ...s, ...data } as Service) : s))
      );
      this.toastService.success('Success', 'Service updated successfully');
    } else {
      const newService: Service = {
        id: Math.max(...this.services().map((s) => s.id)) + 1,
        name: data.name!,
        price: data.price!,
        description: data.description!,
        category: data.category || 'Haircuts',
        duration: data.duration || 30,
        bookings: 0,
        icon: data.icon || '✂️',
      };
      this.services.update((services) => [...services, newService]);
      this.toastService.success('Success', 'Service created successfully');
    }

    this.closeModal();
  }

  openDeleteModal(service: Service) {
    this.serviceToDelete.set(service);
    this.showDeleteModal.set(true);
  }

  closeDeleteModal() {
    this.showDeleteModal.set(false);
    this.serviceToDelete.set(null);
  }

  confirmDelete() {
    const service = this.serviceToDelete();
    if (service) {
      this.services.update((services) => services.filter((s) => s.id !== service.id));
      this.toastService.success('Deleted', `Service "${service.name}" has been deleted`);
      this.closeDeleteModal();
    }
  }
}
