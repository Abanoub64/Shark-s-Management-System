import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UiCardComponent } from '../../../components/shared/ui-card.component';
import { UiButtonComponent } from '../../../components/shared/ui-button.component';
import { UiInputComponent } from '../../../components/shared/ui-input.component';
import { ReactiveFormsModule, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-queue-manager',
  standalone: true,
  imports: [
    CommonModule,
    UiCardComponent,
    UiButtonComponent,
    UiInputComponent,
    ReactiveFormsModule,
  ],
  template: `
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- Add Walk-in Form -->
      <div class="lg:col-span-1">
        <app-ui-card>
          <div class="p-6">
            <h3 class="text-lg font-bold mb-6">Add Walk-in Customer</h3>
            <div class="space-y-4">
              <app-ui-input label="Customer Name" placeholder="Guest Name"></app-ui-input>
              <app-ui-input label="Phone (Optional)" placeholder="+20..."></app-ui-input>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Service</label>
                <select class="w-full p-2 border border-gray-300 rounded-md">
                  <option>Haircut (30m)</option>
                  <option>Beard Trim (20m)</option>
                  <option>Shave (45m)</option>
                </select>
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Preferred Barber</label>
                <select class="w-full p-2 border border-gray-300 rounded-md">
                  <option value="">Any Professional</option>
                  <option>Ahmed Ali</option>
                  <option>Mohamed Samy</option>
                </select>
              </div>

              <app-ui-button [fullWidth]="true" class="mt-4">Add to Queue</app-ui-button>
            </div>
          </div>
        </app-ui-card>
      </div>

      <!-- Queue List -->
      <div class="lg:col-span-2">
        <app-ui-card>
          <div class="p-6">
            <div class="flex justify-between items-center mb-6">
              <h3 class="text-lg font-bold">Current Queue</h3>
              <div class="flex gap-2">
                <span class="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-bold"
                  >5 Waiting</span
                >
                <span class="px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-bold"
                  >25m Avg Wait</span
                >
              </div>
            </div>

            <div class="space-y-3">
              <!-- Draggable List Item (Mock) -->
              @for (item of queueItems; track item.id) {
              <div
                class="flex items-center p-4 bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow"
              >
                <div class="mr-4 cursor-move text-gray-400">⋮⋮</div>
                <div
                  class="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center font-bold text-lg text-gray-700 mr-4"
                >
                  {{ item.ticket }}
                </div>
                <div class="flex-1">
                  <h4 class="font-bold text-gray-900">{{ item.name }}</h4>
                  <p class="text-sm text-gray-500">
                    {{ item.service }} • {{ item.barber || 'Any' }}
                  </p>
                </div>
                <div class="text-right mr-6">
                  <div class="text-lg font-bold text-gray-900">{{ item.eta }}m</div>
                  <div class="text-xs text-gray-500">ETA</div>
                </div>
                <div class="flex gap-2">
                  <app-ui-button size="sm" variant="secondary">Start</app-ui-button>
                  <app-ui-button size="sm" variant="outline" class="text-red-600 border-red-200"
                    >Cancel</app-ui-button
                  >
                </div>
              </div>
              }
            </div>
          </div>
        </app-ui-card>
      </div>
    </div>
  `,
})
export class QueueManagerComponent {
  queueItems = [
    { id: 1, ticket: 'A12', name: 'Walk-in Guest', service: 'Haircut', barber: null, eta: 5 },
    { id: 2, ticket: 'A13', name: 'John Doe', service: 'Beard Trim', barber: 'Ahmed Ali', eta: 15 },
    { id: 3, ticket: 'A14', name: 'Mike Ross', service: 'Full Package', barber: null, eta: 35 },
    {
      id: 4,
      ticket: 'A15',
      name: 'Harvey Specter',
      service: 'Shave',
      barber: 'Karim Hassan',
      eta: 50,
    },
    { id: 5, ticket: 'A16', name: 'Louis Litt', service: 'Haircut', barber: null, eta: 65 },
  ];
}
