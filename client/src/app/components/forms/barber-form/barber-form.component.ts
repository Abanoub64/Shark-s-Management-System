import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Barber } from '../../../core/services/barber.service';

@Component({
  selector: 'app-barber-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <form (ngSubmit)="onSubmit()">
      <div class="mb-4">
        <label class="block text-gray-700 text-sm font-bold mb-2" for="name">Name</label>
        <input
          [(ngModel)]="barber.name"
          name="name"
          class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          id="name"
          type="text"
          placeholder="Barber Name"
          required
        />
      </div>
      <div class="mb-4">
        <label class="block text-gray-700 text-sm font-bold mb-2" for="specialization"
          >Specialization</label
        >
        <input
          [(ngModel)]="barber.specialization"
          name="specialization"
          class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          id="specialization"
          type="text"
          placeholder="Specialization"
          required
        />
      </div>
      <div class="mb-4">
        <label class="block text-gray-700 text-sm font-bold mb-2" for="branchId">Branch ID</label>
        <input
          [(ngModel)]="barber.branchId"
          name="branchId"
          class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          id="branchId"
          type="number"
          placeholder="Branch ID"
          required
        />
      </div>
      <div class="flex items-center justify-end">
        <button
          class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          type="submit"
        >
          Save
        </button>
      </div>
    </form>
  `,
  styles: [],
})
export class BarberFormComponent {
  @Input() barber: Barber = { name: '', specialization: '', branchId: 0 };
  @Output() save = new EventEmitter<Barber>();

  onSubmit() {
    this.save.emit(this.barber);
  }
}
