import { Component, signal, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ToastService } from '../../../core/services/toast.service';
import { DeleteConfirmationModalComponent } from '../../../components/shared/delete-confirmation-modal/delete-confirmation-modal.component';
import { ShopServiceService, Service } from '../../../core/services/shop-service.service';

interface ServiceUI extends Service {
  description?: string;
  category?: string;
  duration?: number;
  bookings?: number;
  icon?: string;
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
export class ServicesComponent implements OnInit {
  private toastService = inject(ToastService);
  private shopService = inject(ShopServiceService);

  services = signal<ServiceUI[]>([]);

  ngOnInit() {
    this.loadServices();
  }

  loadServices() {
    this.shopService.getServices().subscribe({
      next: (services) => {
        // Merge API data with default UI values
        const enhancedServices: ServiceUI[] = services.map((s) => ({
          ...s,
          id: s.id || 0,
          description: 'No description available',
          category: 'Haircuts',
          duration: 30,
          bookings: 0,
          icon: this.getDefaultIcon(s.name),
        }));
        this.services.set(enhancedServices);
      },
      error: (error) => {
        console.error('Error loading services:', error);
        this.toastService.error('Error', 'Failed to load services');
      },
    });
  }

  getDefaultIcon(name: string): string {
    const nameLower = name.toLowerCase();
    if (nameLower.includes('hair') || nameLower.includes('cut')) return '✂️';
    if (nameLower.includes('beard')) return '🧔';
    if (nameLower.includes('shave')) return '🪒';
    if (nameLower.includes('color')) return '🎨';
    if (nameLower.includes('facial') || nameLower.includes('spa')) return '💆';
    if (nameLower.includes('kid')) return '👦';
    return '💈';
  }

  availableIcons = ['✂️', '🧔', '🪒', '💇', '💆', '👦', '🎨', '💈', '🧴', '🪮', '👨', '👩'];

  showModal = signal(false);
  showDeleteModal = signal(false);
  isEditMode = signal(false);
  serviceToDelete = signal<ServiceUI | null>(null);
  formData = signal<Partial<ServiceUI>>({});

  getMostPopular() {
    const sorted = [...this.services()].sort((a, b) => (b.bookings || 0) - (a.bookings || 0));
    return sorted[0]?.name || 'N/A';
  }

  getAvgPrice() {
    const total = this.services().reduce((sum, s) => sum + s.price, 0);
    return Math.round(total / this.services().length);
  }

  getTotalBookings() {
    return this.services().reduce((sum, s) => sum + (s.bookings || 0), 0);
  }

  openAddModal() {
    this.isEditMode.set(false);
    this.formData.set({ category: 'Haircuts', duration: 30, bookings: 0, icon: '✂️' });
    this.showModal.set(true);
  }

  openEditModal(service: ServiceUI) {
    this.isEditMode.set(true);
    // Explicitly set the id and other fields to ensure form data is correct
    this.formData.set({
      id: service.id,
      name: service.name,
      price: service.price,
      description: service.description,
      category: service.category,
      duration: service.duration,
      bookings: service.bookings,
      icon: service.icon,
    });
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
    if (!data.name || !data.price) {
      this.toastService.error('Validation Error', 'Please fill all required fields');
      return;
    }

    const serviceData: Service = {
      id: data.id,
      name: data.name,
      price: data.price,
    };

    if (this.isEditMode() && data.id) {
      // Update existing service
      this.shopService.updateService(data.id, serviceData).subscribe({
        next: (updated) => {
          // Update local state with API response merged with UI data since API doesn't return UI fields
          this.services.update((services) =>
            services.map((s) => {
              if (s.id === data.id) {
                return {
                  ...s, // Keep existing UI state like desc, bookings etc
                  ...updated, // Apply API updates (name, price)
                  // Apply form updates for UI fields even if not persisted to backend
                  description: data.description || s.description,
                  category: data.category || s.category,
                  duration: data.duration || s.duration,
                  icon: data.icon || s.icon,
                };
              }
              return s;
            })
          );
          this.toastService.success('Success', 'Service updated successfully');
          this.closeModal();
        },
        error: (error) => {
          console.error('Error updating service:', error);
          this.toastService.error('Error', 'Failed to update service');
        },
      });
    } else {
      // Create new service
      this.shopService.createService(serviceData).subscribe({
        next: (created) => {
          // Add to local state with API response merged with UI data
          const newService: ServiceUI = {
            ...created,
            id: created.id || 0,
            description: data.description || 'No description available',
            category: data.category || 'Haircuts',
            duration: data.duration || 30,
            bookings: 0,
            icon: data.icon || '✂️',
          };
          this.services.update((services) => [...services, newService]);
          this.toastService.success('Success', 'Service created successfully');
          this.closeModal();
        },
        error: (error) => {
          console.error('Error creating service:', error);
          this.toastService.error('Error', 'Failed to create service');
        },
      });
    }
  }

  openDeleteModal(service: ServiceUI) {
    this.serviceToDelete.set(service);
    this.showDeleteModal.set(true);
  }

  closeDeleteModal() {
    this.showDeleteModal.set(false);
    this.serviceToDelete.set(null);
  }

  confirmDelete() {
    const service = this.serviceToDelete();
    if (service && service.id) {
      this.shopService.deleteService(service.id).subscribe({
        next: () => {
          this.services.update((services) => services.filter((s) => s.id !== service.id));
          this.toastService.success('Deleted', `Service "${service.name}" has been deleted`);
          this.closeDeleteModal();
        },
        error: (error) => {
          console.error('Error deleting service:', error);
          this.toastService.error('Error', 'Failed to delete service');
        },
      });
    }
  }
}
