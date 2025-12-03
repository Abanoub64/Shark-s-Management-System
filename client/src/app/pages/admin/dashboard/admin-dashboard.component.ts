import { ModalComponent } from '../../../components/shared/modal/modal.component';
import { BranchFormComponent } from '../../../components/forms/branch-form/branch-form.component';
import { BarberFormComponent } from '../../../components/forms/barber-form/barber-form.component';
import { ServiceFormComponent } from '../../../components/forms/service-form/service-form.component';
import { BranchService, Branch } from '../../../core/services/branch.service';
import { BarberService, Barber } from '../../../core/services/barber.service';
import { ShopServiceService, ShopService } from '../../../core/services/shop-service.service';
import { CommonModule } from '@angular/common';
import { UiCardComponent } from '../../../components/shared/ui-card.component';
import { Component } from '@angular/core';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    UiCardComponent,
    ModalComponent,
    BranchFormComponent,
    BarberFormComponent,
    ServiceFormComponent,
  ],
  template: `
    <div class="space-y-6">
      <!-- Management Actions -->
      <div class="flex gap-4">
        <button
          (click)="openBranchModal()"
          class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Add Branch
        </button>
        <button
          (click)="openBarberModal()"
          class="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
        >
          Add Barber
        </button>
        <button
          (click)="openServiceModal()"
          class="bg-purple-500 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded"
        >
          Add Service
        </button>
      </div>

      <!-- Modals -->
      <app-modal *ngIf="showBranchModal" title="Manage Branch" (closeEvent)="closeBranchModal()">
        <app-branch-form (save)="onSaveBranch($event)"></app-branch-form>
      </app-modal>

      <app-modal *ngIf="showBarberModal" title="Manage Barber" (closeEvent)="closeBarberModal()">
        <app-barber-form (save)="onSaveBarber($event)"></app-barber-form>
      </app-modal>

      <app-modal *ngIf="showServiceModal" title="Manage Service" (closeEvent)="closeServiceModal()">
        <app-service-form (save)="onSaveService($event)"></app-service-form>
      </app-modal>
      <!-- Stats Overview -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <app-ui-card class="bg-gradient-to-br from-blue-500 to-blue-600 text-white border-none">
          <div class="p-6">
            <p class="text-blue-100 text-sm font-medium">Total Revenue</p>
            <h3 class="text-3xl font-bold mt-2">\${{ stats.revenue | number }}</h3>
            <p class="text-blue-100 text-xs mt-2">↑ 12% from last month</p>
          </div>
        </app-ui-card>

        <app-ui-card class="bg-gradient-to-br from-purple-500 to-purple-600 text-white border-none">
          <div class="p-6">
            <p class="text-purple-100 text-sm font-medium">Total Bookings</p>
            <h3 class="text-3xl font-bold mt-2">{{ stats.bookings | number }}</h3>
            <p class="text-purple-100 text-xs mt-2">↑ 8% from last month</p>
          </div>
        </app-ui-card>

        <app-ui-card class="bg-gradient-to-br from-green-500 to-green-600 text-white border-none">
          <div class="p-6">
            <p class="text-green-100 text-sm font-medium">Active Branches</p>
            <h3 class="text-3xl font-bold mt-2">{{ stats.branches }}</h3>
            <p class="text-green-100 text-xs mt-2">All systems operational</p>
          </div>
        </app-ui-card>

        <app-ui-card class="bg-gradient-to-br from-orange-500 to-orange-600 text-white border-none">
          <div class="p-6">
            <p class="text-orange-100 text-sm font-medium">Avg. Wait Time</p>
            <h3 class="text-3xl font-bold mt-2">12 min</h3>
            <p class="text-orange-100 text-xs mt-2">↓ 2 min from last week</p>
          </div>
        </app-ui-card>
      </div>

      <!-- Charts Section (Mocked with CSS/HTML) -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- Revenue Chart -->
        <div class="lg:col-span-2">
          <app-ui-card>
            <div class="p-6">
              <h3 class="text-lg font-bold mb-6">Monthly Revenue</h3>
              <div class="h-64 flex items-end justify-between gap-2">
                @for (item of revenueData; track item.month) {
                <div class="flex flex-col items-center gap-2 flex-1 group">
                  <div
                    class="w-full bg-blue-100 rounded-t-sm relative h-full flex items-end overflow-hidden group-hover:bg-blue-200 transition-colors"
                  >
                    <div
                      class="w-full bg-blue-500 transition-all duration-500"
                      [style.height.%]="(item.amount / maxRevenue) * 100"
                    ></div>
                    <!-- Tooltip -->
                    <div
                      class="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10"
                    >
                      \${{ item.amount | number }}
                    </div>
                  </div>
                  <span class="text-xs text-gray-500">{{ item.month }}</span>
                </div>
                }
              </div>
            </div>
          </app-ui-card>
        </div>

        <!-- Top Branches -->
        <div>
          <app-ui-card class="h-full">
            <div class="p-6">
              <h3 class="text-lg font-bold mb-6">Top Performing Branches</h3>
              <div class="space-y-6">
                @for (branch of topBranches; track branch.name) {
                <div>
                  <div class="flex justify-between text-sm mb-1">
                    <span class="font-medium">{{ branch.name }}</span>
                    <span class="text-gray-500">\${{ branch.revenue | number }}</span>
                  </div>
                  <div class="w-full bg-gray-100 rounded-full h-2">
                    <div
                      class="bg-primary h-2 rounded-full"
                      [style.width.%]="branch.percentage"
                    ></div>
                  </div>
                </div>
                }
              </div>
              <div class="mt-8 pt-6 border-t border-gray-100">
                <h4 class="text-sm font-bold mb-4">Service Popularity</h4>
                <div class="flex flex-wrap gap-2">
                  <span class="px-3 py-1 bg-gray-100 rounded-full text-xs text-gray-600"
                    >Haircut (45%)</span
                  >
                  <span class="px-3 py-1 bg-gray-100 rounded-full text-xs text-gray-600"
                    >Beard Trim (30%)</span
                  >
                  <span class="px-3 py-1 bg-gray-100 rounded-full text-xs text-gray-600"
                    >Shave (15%)</span
                  >
                  <span class="px-3 py-1 bg-gray-100 rounded-full text-xs text-gray-600"
                    >Facial (10%)</span
                  >
                </div>
              </div>
            </div>
          </app-ui-card>
        </div>
      </div>

      <!-- Recent Activity Table -->
      <app-ui-card>
        <div class="p-6">
          <h3 class="text-lg font-bold mb-4">Recent Bookings</h3>
          <div class="overflow-x-auto">
            <table class="w-full text-left text-sm">
              <thead class="bg-gray-50 text-gray-500">
                <tr>
                  <th class="px-4 py-3 font-medium">ID</th>
                  <th class="px-4 py-3 font-medium">Customer</th>
                  <th class="px-4 py-3 font-medium">Branch</th>
                  <th class="px-4 py-3 font-medium">Service</th>
                  <th class="px-4 py-3 font-medium">Amount</th>
                  <th class="px-4 py-3 font-medium">Status</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-100">
                @for (booking of recentBookings; track booking.id) {
                <tr class="hover:bg-gray-50">
                  <td class="px-4 py-3 text-gray-500">{{ booking.id }}</td>
                  <td class="px-4 py-3 font-medium">{{ booking.customer }}</td>
                  <td class="px-4 py-3 text-gray-500">{{ booking.branch }}</td>
                  <td class="px-4 py-3 text-gray-500">{{ booking.service }}</td>
                  <td class="px-4 py-3">\${{ booking.amount }}</td>
                  <td class="px-4 py-3">
                    <span
                      class="px-2 py-1 rounded-full text-xs font-medium"
                      [class.bg-green-100]="booking.status === 'Completed'"
                      [class.text-green-800]="booking.status === 'Completed'"
                      [class.bg-blue-100]="booking.status === 'Confirmed'"
                      [class.text-blue-800]="booking.status === 'Confirmed'"
                      [class.bg-gray-100]="booking.status === 'Pending'"
                      [class.text-gray-800]="booking.status === 'Pending'"
                    >
                      {{ booking.status }}
                    </span>
                  </td>
                </tr>
                }
              </tbody>
            </table>
          </div>
        </div>
      </app-ui-card>
    </div>
  `,
})
export class AdminDashboardComponent {
  stats = {
    revenue: 125000,
    bookings: 3450,
    branches: 12,
    wait_time: 12,
  };

  revenueData = [
    { month: 'Jan', amount: 65000 },
    { month: 'Feb', amount: 72000 },
    { month: 'Mar', amount: 85000 },
    { month: 'Apr', amount: 92000 },
    { month: 'May', amount: 88000 },
    { month: 'Jun', amount: 98000 },
    { month: 'Jul', amount: 115000 },
    { month: 'Aug', amount: 125000 },
  ];

  maxRevenue = Math.max(...this.revenueData.map((d) => d.amount)) * 1.1;

  topBranches = [
    { name: 'Downtown Elite', revenue: 45000, percentage: 85 },
    { name: 'Zamalek Classic', revenue: 38000, percentage: 70 },
    { name: 'New Cairo Hub', revenue: 32000, percentage: 60 },
    { name: 'Alexandria Bay', revenue: 28000, percentage: 50 },
  ];

  recentBookings = [
    {
      id: '#BK-9921',
      customer: 'Ahmed Ali',
      branch: 'Downtown Elite',
      service: 'Haircut + Beard',
      amount: 45,
      status: 'Completed',
    },
    {
      id: '#BK-9922',
      customer: 'Sarah Smith',
      branch: 'Zamalek Classic',
      service: 'Hair Dye',
      amount: 80,
      status: 'Confirmed',
    },
    {
      id: '#BK-9923',
      customer: 'Mike Johnson',
      branch: 'New Cairo Hub',
      service: 'Full Package',
      amount: 120,
      status: 'Pending',
    },
    {
      id: '#BK-9924',
      customer: 'Omar Khaled',
      branch: 'Downtown Elite',
      service: 'Haircut',
      amount: 25,
      status: 'Completed',
    },
    {
      id: '#BK-9925',
      customer: 'Karim Hassan',
      branch: 'Alexandria Bay',
      service: 'Beard Trim',
      amount: 15,
      status: 'Confirmed',
    },
  ];
  showBranchModal = false;
  showBarberModal = false;
  showServiceModal = false;

  constructor(
    private branchService: BranchService,
    private barberService: BarberService,
    private shopService: ShopServiceService
  ) {}

  openBranchModal() {
    this.showBranchModal = true;
  }
  closeBranchModal() {
    this.showBranchModal = false;
  }
  onSaveBranch(branch: Branch) {
    this.branchService.createBranch(branch).subscribe(() => {
      this.closeBranchModal();
      // Refresh data if needed
    });
  }

  openBarberModal() {
    this.showBarberModal = true;
  }
  closeBarberModal() {
    this.showBarberModal = false;
  }
  onSaveBarber(barber: Barber) {
    this.barberService.createBarber(barber).subscribe(() => {
      this.closeBarberModal();
    });
  }

  openServiceModal() {
    this.showServiceModal = true;
  }
  closeServiceModal() {
    this.showServiceModal = false;
  }
  onSaveService(service: ShopService) {
    this.shopService.createService(service).subscribe(() => {
      this.closeServiceModal();
    });
  }
}
