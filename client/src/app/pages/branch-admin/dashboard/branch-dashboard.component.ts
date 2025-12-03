import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UiCardComponent } from '../../../components/shared/ui-card.component';
import { UiButtonComponent } from '../../../components/shared/ui-button.component';

@Component({
  selector: 'app-branch-dashboard',
  standalone: true,
  imports: [CommonModule, UiCardComponent, UiButtonComponent],
  template: `
    <div class="space-y-6">
      <!-- Live Status -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <app-ui-card class="bg-blue-600 text-white border-none">
          <div class="p-6">
            <div class="flex justify-between items-start">
              <div>
                <p class="text-blue-100 text-sm font-medium">Current Queue</p>
                <h3 class="text-4xl font-bold mt-2">5</h3>
                <p class="text-blue-100 text-xs mt-2">Est. Wait: 25 mins</p>
              </div>
              <span class="text-2xl">🚶</span>
            </div>
          </div>
        </app-ui-card>

        <app-ui-card class="bg-green-600 text-white border-none">
          <div class="p-6">
            <div class="flex justify-between items-start">
              <div>
                <p class="text-green-100 text-sm font-medium">Active Barbers</p>
                <h3 class="text-4xl font-bold mt-2">
                  4<span class="text-lg text-green-200 font-normal">/6</span>
                </h3>
                <p class="text-green-100 text-xs mt-2">2 on break</p>
              </div>
              <span class="text-2xl">✂️</span>
            </div>
          </div>
        </app-ui-card>

        <app-ui-card class="bg-purple-600 text-white border-none">
          <div class="p-6">
            <div class="flex justify-between items-start">
              <div>
                <p class="text-purple-100 text-sm font-medium">Today's Revenue</p>
                <h3 class="text-4xl font-bold mt-2">\${{ 1250 | number }}</h3>
                <p class="text-purple-100 text-xs mt-2">32 bookings completed</p>
              </div>
              <span class="text-2xl">💰</span>
            </div>
          </div>
        </app-ui-card>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- Queue List -->
        <div class="lg:col-span-2">
          <app-ui-card>
            <div class="p-6">
              <div class="flex justify-between items-center mb-6">
                <h3 class="text-lg font-bold">Active Queue</h3>
                <app-ui-button size="sm">Add Walk-in</app-ui-button>
              </div>

              <div class="space-y-4">
                @for (customer of queue; track customer.id) {
                <div
                  class="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-100"
                >
                  <div class="flex items-center gap-4">
                    <div
                      class="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold"
                    >
                      {{ customer.ticket }}
                    </div>
                    <div>
                      <h4 class="font-bold">{{ customer.name }}</h4>
                      <p class="text-xs text-gray-500">
                        {{ customer.service }} • {{ customer.barber || 'Any Barber' }}
                      </p>
                    </div>
                  </div>
                  <div class="flex items-center gap-4">
                    <div class="text-right">
                      <p class="text-sm font-bold text-gray-700">{{ customer.waitTime }} min</p>
                      <p class="text-xs text-gray-500">Wait Time</p>
                    </div>
                    <div class="flex gap-2">
                      <button
                        class="p-2 text-green-600 hover:bg-green-50 rounded-full"
                        title="Call Customer"
                      >
                        📢
                      </button>
                      <button class="p-2 text-red-600 hover:bg-red-50 rounded-full" title="Remove">
                        ✕
                      </button>
                    </div>
                  </div>
                </div>
                }
              </div>
            </div>
          </app-ui-card>
        </div>

        <!-- Staff Status -->
        <div>
          <app-ui-card>
            <div class="p-6">
              <h3 class="text-lg font-bold mb-6">Staff Status</h3>
              <div class="space-y-4">
                @for (staff of staffMembers; track staff.id) {
                <div class="flex items-center justify-between">
                  <div class="flex items-center gap-3">
                    <img [src]="staff.image" class="w-10 h-10 rounded-full object-cover" />
                    <div>
                      <h4 class="font-medium text-sm">{{ staff.name }}</h4>
                      <span
                        class="text-xs px-2 py-0.5 rounded-full"
                        [class.bg-green-100]="staff.status === 'Available'"
                        [class.text-green-800]="staff.status === 'Available'"
                        [class.bg-yellow-100]="staff.status === 'Busy'"
                        [class.text-yellow-800]="staff.status === 'Busy'"
                        [class.bg-gray-100]="staff.status === 'Break'"
                        [class.text-gray-800]="staff.status === 'Break'"
                      >
                        {{ staff.status }}
                      </span>
                    </div>
                  </div>
                  <div class="text-xs text-gray-500">{{ staff.completed }} cuts</div>
                </div>
                }
              </div>
            </div>
          </app-ui-card>
        </div>
      </div>
    </div>
  `,
})
export class BranchDashboardComponent {
  queue = [
    {
      id: 1,
      ticket: 'A12',
      name: 'Walk-in Customer',
      service: 'Haircut',
      barber: null,
      waitTime: 5,
    },
    {
      id: 2,
      ticket: 'A13',
      name: 'John Doe',
      service: 'Beard Trim',
      barber: 'Ahmed Ali',
      waitTime: 15,
    },
    {
      id: 3,
      ticket: 'A14',
      name: 'Mike Ross',
      service: 'Full Package',
      barber: null,
      waitTime: 25,
    },
    {
      id: 4,
      ticket: 'A15',
      name: 'Harvey Specter',
      service: 'Shave',
      barber: 'Karim Hassan',
      waitTime: 40,
    },
  ];

  staffMembers = [
    {
      id: 'b1',
      name: 'Ahmed Ali',
      image:
        'https://images.unsplash.com/photo-1534308143481-c55f00be8bd7?q=80&w=1930&auto=format&fit=crop',
      status: 'Busy',
      completed: 8,
    },
    {
      id: 'b2',
      name: 'Mohamed Samy',
      image:
        'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1887&auto=format&fit=crop',
      status: 'Available',
      completed: 6,
    },
    {
      id: 'b3',
      name: 'Karim Hassan',
      image:
        'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=1887&auto=format&fit=crop',
      status: 'Break',
      completed: 5,
    },
    {
      id: 'b4',
      name: 'Omar Khaled',
      image:
        'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=2070&auto=format&fit=crop',
      status: 'Busy',
      completed: 7,
    },
  ];
}
