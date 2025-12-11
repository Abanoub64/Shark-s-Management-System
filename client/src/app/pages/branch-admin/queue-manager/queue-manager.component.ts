import { Component, OnInit, OnDestroy, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { UiCardComponent } from '../../../components/shared/ui-card.component';
import { UiButtonComponent } from '../../../components/shared/ui-button.component';
import { UiInputComponent } from '../../../components/shared/ui-input.component';
import { QueueService } from '../../../core/services/queue.service';
import { AuthService } from '../../../core/services/auth.service';
import { Chair, QueueItem } from '../../../core/models/queue.models';
import { interval, Subscription, switchMap } from 'rxjs';
import { BarberService, Barber } from '../../../core/services/barber.service';
import { ToastService } from '../../../core/services/toast.service';
import { BookingService } from '../../../core/services/booking.service';
import { CreateBookingRequest } from '../../../core/models/models';

@Component({
  selector: 'app-queue-manager',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    UiCardComponent,
    UiButtonComponent,
    UiInputComponent,
  ],
  template: `
    <div class="h-[calc(100vh-8rem)] flex flex-col md:flex-row gap-6 overflow-hidden">
      <!-- 1. Chairs Section (Left) -->
      <div
        class="md:w-1/3 flex flex-col bg-gray-50 rounded-xl border border-gray-200 overflow-hidden"
      >
        <div class="p-4 bg-white border-b border-gray-200 flex justify-between items-center">
          <h2 class="text-lg font-bold text-gray-800">Chairs</h2>
          <span class="px-2 py-1 bg-gray-100 text-xs rounded-full"
            >{{ chairs().length }} Active</span
          >
        </div>

        <div class="flex-1 overflow-y-auto p-4 space-y-4">
          @for (chair of chairs(); track chair.id) {
          <div
            class="bg-white rounded-lg shadow-sm border border-gray-200 p-4 transition-all hover:shadow-md"
          >
            <div class="flex justify-between items-start mb-3">
              <div>
                <h3 class="font-bold text-gray-900">{{ chair.name }}</h3>
                <p class="text-xs text-gray-500">{{ chair.assignedBarberName || 'No Barber' }}</p>
              </div>
              <span
                class="px-2 py-1 rounded-full text-xs font-medium"
                [ngClass]="
                  chair.status === 'Occupied'
                    ? 'bg-green-100 text-green-800'
                    : 'bg-gray-100 text-gray-600'
                "
              >
                {{ chair.status }}
              </span>
            </div>

            @if (chair.status === 'Occupied' && chair.currentBooking) {
            <div class="mb-4 p-3 bg-blue-50 rounded-md border border-blue-100">
              <div class="flex items-center gap-2 mb-1">
                <span class="text-lg">👤</span>
                <span class="font-bold text-blue-900">{{ chair.currentBooking.customerName }}</span>
              </div>
              <div class="text-xs text-blue-700 flex justify-between">
                <span>{{ chair.currentBooking.serviceName }}</span>
                <span>{{ chair.currentBooking.bookingTime | date : 'shortTime' }}</span>
              </div>
            </div>
            } @else {
            <div
              class="mb-4 p-4 text-center text-gray-400 text-sm border-2 border-dashed border-gray-100 rounded-md"
            >
              No customer currently
            </div>
            }

            <div class="flex gap-2">
              @if (chair.status === 'Occupied') {
              <app-ui-button
                (click)="completeSession(chair.id)"
                variant="primary"
                size="sm"
                class="flex-1"
              >
                Example Complete
              </app-ui-button>
              } @else {
              <app-ui-button
                [disabled]="true"
                variant="secondary"
                size="sm"
                class="flex-1 opacity-50 cursor-not-allowed"
              >
                Free
              </app-ui-button>
              }

              <button
                (click)="removeChair(chair.id)"
                class="p-2 text-red-500 hover:bg-red-50 rounded-md transition-colors"
                title="Remove Chair"
              >
                🗑️
              </button>
            </div>
          </div>
          } @if (chairs().length === 0) {
          <div class="text-center py-10 text-gray-400">
            <p>No chairs configured</p>
          </div>
          }
        </div>
      </div>

      <!-- 2. Waiting Queue Section (Middle) -->
      <div
        class="md:w-1/3 flex flex-col bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm"
      >
        <div class="p-4 border-b border-gray-200 flex justify-between items-center bg-gray-50">
          <h2 class="text-lg font-bold text-gray-800">Waiting Queue</h2>
          <div class="flex gap-2">
            <span class="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full"
              >{{ queue().length }} Waiting</span
            >
          </div>
        </div>

        <div class="flex-1 overflow-y-auto p-0">
          @for (item of queue(); track item.id) {
          <div class="p-4 border-b border-gray-100 hover:bg-gray-50 transition-colors group">
            <div class="flex justify-between items-start mb-2">
              <div class="flex items-center gap-2">
                <span class="font-bold text-gray-900">{{ item.customerName }}</span>
                @if (item.priority > 3) {
                <span class="text-yellow-500 text-xs">⭐ {{ item.priority }}</span>
                }
              </div>
              <span class="text-xs text-gray-500">{{ item.bookingTime | date : 'shortTime' }}</span>
            </div>

            <div class="flex justify-between items-end">
              <div class="text-sm text-gray-600">
                <p>{{ item.serviceName }}</p>
                @if (item.preferredBarberName) {
                <p class="text-xs text-purple-600">Pref: {{ item.preferredBarberName }}</p>
                }
              </div>

              <button
                (click)="openAssignModal(item)"
                class="px-3 py-1 bg-white border border-primary-500 text-primary-600 text-xs font-medium rounded hover:bg-primary-50 transition-colors"
              >
                Assign →
              </button>
            </div>
          </div>
          } @if (queue().length === 0) {
          <div class="text-center py-12 text-gray-400">
            <span class="text-4xl block mb-2">☕</span>
            <p>Queue is empty</p>
          </div>
          }
        </div>
      </div>

      <!-- 3. Actions Panel (Right) -->
      <div class="md:w-1/3 flex flex-col gap-6 overflow-y-auto pr-1">
        <!-- Live Queue Display -->
        <app-ui-card>
          <div class="p-4">
            <h3 class="font-bold text-gray-800 mb-3">Live Queue Display</h3>
            <app-ui-button [fullWidth]="true" (click)="openLiveQueue()">
              📺 Open Live Queue
            </app-ui-button>
          </div>
        </app-ui-card>

        <!-- Actions -->
        <app-ui-card>
          <div class="p-4">
            <div class="flex justify-between items-center mb-4">
              <h3 class="font-bold text-gray-800">Actions</h3>
              <button (click)="loadData()" class="text-sm text-primary-600 hover:text-primary-700">
                ↻ Refresh
              </button>
            </div>

            <div class="space-y-3">
              <app-ui-button [fullWidth]="true" (click)="showAddChair = !showAddChair">
                {{ showAddChair ? 'Cancel' : '+ Add New Chair' }}
              </app-ui-button>

              @if (showAddChair) {
              <div class="p-3 bg-gray-50 rounded-lg border border-gray-200 animate-fade-in">
                <form [formGroup]="chairForm" (ngSubmit)="onAddChair()">
                  <app-ui-input
                    label="Chair Name"
                    formControlName="name"
                    placeholder="e.g. Chair 5"
                    class="mb-2"
                  ></app-ui-input>
                  <div class="relative mb-2">
                    <label class="block text-sm font-medium text-gray-700 mb-1"
                      >Assigned Barber</label
                    >
                    <div class="relative">
                      <input
                        type="text"
                        [value]="
                          selectedBarberName().length > 0 && !isDropdownOpen()
                            ? selectedBarberName()
                            : searchTerm()
                        "
                        (input)="onSearchInput($event)"
                        (focus)="isDropdownOpen.set(true)"
                        placeholder="Search Barber Name..."
                        class="w-full p-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                      />
                      @if (isDropdownOpen()) {
                      <div
                        class="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-40 overflow-y-auto"
                      >
                        @for (barber of filteredBarbers(); track barber.id) {
                        <div
                          (click)="selectBarber(barber)"
                          class="p-2 hover:bg-gray-100 cursor-pointer text-sm text-gray-700"
                        >
                          {{ barber.firstName }} {{ barber.lastName }}
                        </div>
                        } @if (filteredBarbers().length === 0) {
                        <div class="p-2 text-gray-500 text-sm text-center">No barbers found</div>
                        }
                      </div>
                      }
                    </div>
                  </div>
                  <app-ui-button
                    type="submit"
                    size="sm"
                    [fullWidth]="true"
                    [disabled]="chairForm.invalid"
                    >Create</app-ui-button
                  >
                </form>
              </div>
              }
            </div>
          </div>
        </app-ui-card>

        <!-- Walk-in Booking -->
        <app-ui-card>
          <div class="p-4">
            <h3 class="font-bold text-gray-800 mb-4">Walk-in Booking</h3>
            <form [formGroup]="walkInForm" (ngSubmit)="onCreateWalkIn()">
              <div class="grid grid-cols-2 gap-2 mb-3">
                <app-ui-input
                  label="First Name"
                  formControlName="firstName"
                  placeholder="John"
                ></app-ui-input>
                <app-ui-input
                  label="Last Name"
                  formControlName="lastName"
                  placeholder="Doe"
                ></app-ui-input>
              </div>
              <div class="mb-4">
                <label class="block text-sm font-medium text-gray-700 mb-1">Service</label>
                <select
                  formControlName="serviceId"
                  class="w-full p-2 bg-white border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                >
                  <option value="">Select Service</option>
                  @for (serviceItem of services(); track serviceItem.id) {
                  <option [ngValue]="serviceItem.id">
                    {{ serviceItem.name }} - {{ serviceItem.price }} EGP
                  </option>
                  }
                </select>
              </div>
              <app-ui-button type="submit" [fullWidth]="true" [disabled]="walkInForm.invalid">
                Create Walk-in Booking
              </app-ui-button>
            </form>
          </div>
        </app-ui-card>

        <!-- Manual Enqueue -->
        <app-ui-card>
          <div class="p-4">
            <h3 class="font-bold text-gray-800 mb-4">Manual Enqueue</h3>
            <form [formGroup]="enqueueForm" (ngSubmit)="onEnqueue()">
              <app-ui-input
                label="Booking ID"
                formControlName="bookingId"
                type="number"
                placeholder="Booking #"
                class="mb-3"
              ></app-ui-input>
              <div class="mb-4">
                <label class="block text-sm font-medium text-gray-700 mb-1">Priority</label>
                <select
                  formControlName="priority"
                  class="w-full p-2 bg-white border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                >
                  <option [ngValue]="0">0 - Normal</option>
                  <option [ngValue]="3">3 - Medium</option>
                  <option [ngValue]="5">5 - High</option>
                  <option [ngValue]="8">8 - VIP</option>
                  <option [ngValue]="10">10 - Urgent</option>
                </select>
              </div>
              <app-ui-button type="submit" [fullWidth]="true" [disabled]="enqueueForm.invalid"
                >Add to Queue</app-ui-button
              >
            </form>
          </div>
        </app-ui-card>

        <!-- Stats Mockup -->
        <app-ui-card>
          <div class="p-4">
            <h3 class="font-bold text-gray-800 mb-2">Today's Overview</h3>
            <div class="space-y-2 text-sm">
              <div class="flex justify-between">
                <span>Total Served</span><span class="font-bold">12</span>
              </div>
              <div class="flex justify-between">
                <span>Cancellations</span><span class="font-bold text-red-500">2</span>
              </div>
              <div class="flex justify-between">
                <span>Avg Wait</span><span class="font-bold text-green-600">14m</span>
              </div>
            </div>
          </div>
        </app-ui-card>
      </div>
    </div>

    <!-- Assign Modal -->
    @if (selectedBooking) {
    <div class="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div class="bg-white rounded-xl shadow-xl max-w-md w-full p-6">
        <h3 class="text-xl font-bold mb-4">Assign {{ selectedBooking.customerName }}</h3>
        <p class="text-gray-600 mb-4">Select a chair to assign this booking to:</p>

        <div class="space-y-2 mb-6 max-h-60 overflow-y-auto">
          @for (chair of chairs(); track chair.id) {
          <button
            (click)="confirmAssign(chair.id)"
            class="w-full p-3 text-left rounded-lg border transition-all flex justify-between items-center group"
            [ngClass]="
              chair.status === 'Empty'
                ? 'border-gray-200 hover:border-primary-500 hover:bg-primary-50'
                : 'border-red-100 bg-red-50 opacity-70'
            "
          >
            <div>
              <span class="font-bold block">{{ chair.name }}</span>
              <span class="text-xs text-gray-500">{{
                chair.assignedBarberName || 'No Barber'
              }}</span>
            </div>
            @if (chair.status === 'Empty') {
            <span class="text-green-600 text-sm font-medium group-hover:block hidden">Select</span>
            } @else {
            <span class="text-red-500 text-xs">Occupied</span>
            }
          </button>
          }
        </div>

        <div class="flex justify-end">
          <app-ui-button variant="secondary" (click)="selectedBooking = null">Cancel</app-ui-button>
        </div>
      </div>
    </div>
    }
  `,
})
export class QueueManagerComponent implements OnInit, OnDestroy {
  private queueService = inject(QueueService);
  private authService = inject(AuthService);
  private toastService = inject(ToastService);
  private fb = inject(FormBuilder);

  chairs = signal<Chair[]>([]);
  queue = signal<QueueItem[]>([]);

  // State
  selectedBooking: QueueItem | null = null;
  showAddChair = false;

  barbers = signal<Barber[]>([]);
  filteredBarbers = computed(() => {
    const term = this.searchTerm().toLowerCase();
    return this.barbers().filter((b) =>
      (b.firstName + ' ' + b.lastName).toLowerCase().includes(term)
    );
  });
  searchTerm = signal('');
  isDropdownOpen = signal(false);
  selectedBarberName = signal(''); // For display input

  // Forms
  chairForm = this.fb.group({
    name: ['', Validators.required],
    assignedBarberId: [null as number | null],
  });

  enqueueForm = this.fb.group({
    bookingId: [null as number | null, Validators.required],
    priority: [0, Validators.required],
  });

  private refreshSubscription?: Subscription;
  private branchId: number = 0;
  private barberService = inject(BarberService);
  private bookingService = inject(BookingService);

  services = signal<Array<{ id: number; name: string; price: number }>>([]);

  // Walk-in form
  walkInForm = this.fb.group({
    firstName: ['', Validators.required],
    lastName: ['', Validators.required],
    serviceId: [null as number | null, Validators.required],
  });

  ngOnInit() {
    this.branchId = this.authService.managedBranchId || 10;

    // Initial Load
    this.loadData();

    // Load Barbers for Dropdown
    if (this.branchId) {
      this.barberService.getBarbers().subscribe({
        next: (allBarbers) => {
          // Filter barbers for this branch
          const branchBarbers = allBarbers.filter((b) => b.branchId === this.branchId);
          this.barbers.set(branchBarbers);
        },
      });
    }

    // Load Services for Walk-in Form
    this.bookingService.getServices().subscribe({
      next: (services) => {
        this.services.set(services);
      },
      error: (err) => console.error('Error loading services', err),
    });

    // Auto Refresh every 5s
    this.refreshSubscription = interval(5000).subscribe(() => this.loadData());
  }

  ngOnDestroy() {
    this.refreshSubscription?.unsubscribe();
  }

  // Dropdown Logic
  toggleDropdown() {
    this.isDropdownOpen.update((v) => !v);
  }

  selectBarber(barber: Barber) {
    this.chairForm.patchValue({ assignedBarberId: barber.id });
    this.selectedBarberName.set(`${barber.firstName} ${barber.lastName}`);
    this.isDropdownOpen.set(false);
    this.searchTerm.set('');
  }

  onSearchInput(event: Event) {
    const input = event.target as HTMLInputElement;
    this.searchTerm.set(input.value);
    this.isDropdownOpen.set(true);
    // If user clears input, clear selection specific logic could go here
    if (input.value === '') {
      this.chairForm.patchValue({ assignedBarberId: null });
    }
  }

  loadData() {
    console.log('Loading Data... Branch ID:', this.branchId);
    if (!this.branchId) {
      console.warn('No Branch ID found, skipping load.');
      return;
    }

    this.queueService.getChairs(this.branchId).subscribe({
      next: (data) => this.chairs.set(data),
      error: (err) => console.error('Error loading chairs', err),
    });

    this.queueService.getQueue(this.branchId).subscribe({
      next: (data) => this.queue.set(data),
      error: (err) => console.error('Error loading queue', err),
    });
  }

  // --- Actions ---

  openAssignModal(booking: QueueItem) {
    this.selectedBooking = booking;
  }

  confirmAssign(chairId: number) {
    if (!this.selectedBooking) return;

    const req = {
      chairId,
      bookingId: this.selectedBooking.bookingId,
    };

    this.queueService.assignToChair(req).subscribe({
      next: () => {
        this.toastService.success('Success', `Assigned to Chair #${chairId}`);
        this.selectedBooking = null;
        this.loadData(); // Immediate refresh
      },
      error: (err) => {
        this.toastService.error('Error', 'Failed to assign booking');
        console.error(err);
      },
    });
  }

  completeSession(chairId: number) {
    this.queueService.completeChair(chairId).subscribe({
      next: (res) => {
        this.toastService.success('Completed', 'Session completed');
        if (res.newAssignedBookingId) {
          this.toastService.info(
            'Queue Update',
            `Auto-assigned booking #${res.newAssignedBookingId}`
          );
        }
        this.loadData();
      },
      error: (err) => {
        this.toastService.error('Error', 'Failed to complete session');
        console.error(err);
      },
    });
  }

  removeChair(chairId: number) {
    if (confirm('Are you sure you want to remove this chair?')) {
      this.queueService.deleteChair(chairId).subscribe({
        next: (deleted) => {
          if (deleted) {
            this.toastService.success('Deleted', 'Chair removed');
            this.loadData();
          } else {
            this.toastService.error('Error', 'Chair is occupied or in use');
          }
        },
        error: (err) => this.toastService.error('Error', 'Failed to remove chair'),
      });
    }
  }

  onAddChair() {
    if (this.chairForm.invalid || !this.branchId) return;

    const req = {
      branchId: this.branchId,
      name: this.chairForm.value.name!,
      assignedBarberId: this.chairForm.value.assignedBarberId || undefined,
    };

    this.queueService.createChair(req).subscribe({
      next: () => {
        this.toastService.success('Success', 'Chair added');
        this.showAddChair = false;
        this.chairForm.reset();
        this.selectedBarberName.set(''); // Reset dropdown display
        this.loadData();
      },
      error: (err) => this.toastService.error('Error', 'Failed to add chair'),
    });
  }

  onEnqueue() {
    if (this.enqueueForm.invalid) return;

    const req = {
      branchId: this.branchId,
      bookingId: this.enqueueForm.value.bookingId!,
      priority: this.enqueueForm.value.priority!,
    };

    this.queueService.enqueueBooking(req).subscribe({
      next: () => {
        this.toastService.success('Success', 'Booking added to queue');
        this.enqueueForm.reset({ priority: 0 });
        this.loadData();
      },
      error: (err) => {
        const errorMsg = err.error?.message || 'Failed to enqueue';
        this.toastService.error('Error', errorMsg);
      },
    });
  }

  openLiveQueue() {
    const url = `/live-queue/${this.branchId}`;
    window.open(url, '_blank');
  }

  onCreateWalkIn() {
    if (this.walkInForm.invalid || !this.branchId) return;

    const firstName = this.walkInForm.value.firstName!;
    const lastName = this.walkInForm.value.lastName!;
    const serviceId = this.walkInForm.value.serviceId!;

    const payload: CreateBookingRequest = {
      customerId: 'walk-in',
      customerName: `${firstName} ${lastName}`,
      barberId: 0,
      serviceId: serviceId,
      branchId: this.branchId,
      startAt: new Date().toISOString(),
    };

    this.bookingService.createBooking(payload).subscribe({
      next: (booking) => {
        this.toastService.success('Success', `Walk-in booking created for ${payload.customerName}`);
        this.walkInForm.reset();
        // Optionally auto-enqueue the new booking
        if (booking.id) {
          this.queueService
            .enqueueBooking({
              branchId: this.branchId,
              bookingId: booking.id,
              priority: 0,
            })
            .subscribe({
              next: () => {
                this.toastService.success('Queued', 'Walk-in customer added to queue');
                this.loadData();
              },
              error: (err) => console.error('Error enqueueing', err),
            });
        }
      },
      error: (err) => {
        console.error('Error creating walk-in booking', err);
        this.toastService.error('Error', 'Failed to create walk-in booking');
      },
    });
  }
}
