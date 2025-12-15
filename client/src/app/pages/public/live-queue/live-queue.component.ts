import { Component, OnInit, OnDestroy, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { QueueService } from '../../../core/services/queue.service';
import { BranchService } from '../../../core/services/branch.service';
import { interval, Subscription } from 'rxjs';

interface LiveChairStatus {
  id: number;
  name: string;
  assignedBarberId: number;
  assignedBarberName: string;
  occupied: boolean;
  currentBookingId: number | null;
  currentCustomerName: string | null;
}

@Component({
  selector: 'app-live-queue',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="min-h-screen bg-gradient-to-b from-slate-50 via-white to-white">
      <div class="max-w-6xl mx-auto px-4 py-8 sm:py-12">
        <div class="flex flex-col gap-3 sm:gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p class="text-xs sm:text-sm uppercase tracking-[0.2em] text-slate-400">Live Queue</p>
            <h1 class="text-2xl sm:text-3xl font-semibold text-slate-900">
              {{ branchName() || 'Branch' }}
            </h1>
          </div>
          <div class="flex items-center gap-3 text-xs sm:text-sm text-slate-500">
            <div class="flex items-center gap-2">
              <span class="h-2.5 w-2.5 rounded-full bg-emerald-400"></span>
              <span>Free</span>
            </div>
            <div class="flex items-center gap-2">
              <span class="h-2.5 w-2.5 rounded-full bg-amber-400"></span>
              <span>Busy</span>
            </div>
          </div>
        </div>

        <div
          class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 mt-8"
        >
          @for (chair of chairs(); track chair.id) {
          <div
            class="relative overflow-hidden rounded-2xl bg-white/80 backdrop-blur border border-slate-200 shadow-sm hover:shadow-lg transition-shadow"
          >
            <div
              class="absolute inset-x-0 top-0 h-1.5"
              [class.bg-amber-400]="chair.occupied"
              [class.bg-emerald-400]="!chair.occupied"
            ></div>

            <div class="p-6 flex flex-col gap-4">
              <div class="flex items-center justify-between">
                <div class="flex items-center gap-3">
                  <div
                    class="h-12 w-12 rounded-xl flex items-center justify-center text-xl font-semibold text-slate-900 bg-slate-100"
                  >
                    {{ chair.name }}
                  </div>
                  <!-- <div>
                    <p class="text-xs uppercase tracking-wide text-slate-400">Chair</p>
                    <p class="text-lg font-semibold text-slate-900">{{ chair.name }}</p>
                  </div> -->
                </div>
                <div
                  class="px-3 py-1.5 rounded-full text-xs font-semibold flex items-center gap-2"
                  [class.bg-amber-100]="chair.occupied"
                  [class.text-amber-700]="chair.occupied"
                  [class.bg-emerald-100]="!chair.occupied"
                  [class.text-emerald-700]="!chair.occupied"
                >
                  <span
                    class="h-2.5 w-2.5 rounded-full"
                    [class.bg-amber-500]="chair.occupied"
                    [class.bg-emerald-500]="!chair.occupied"
                  ></span>
                  {{ chair.occupied ? 'Busy' : 'Free' }}
                </div>
              </div>

              <div class="rounded-xl border border-slate-100 bg-slate-50 px-4 py-3">
                <p class="text-[11px] uppercase tracking-[0.2em] text-slate-400">Barber</p>
                <p class="text-lg sm:text-xl font-semibold text-slate-900 leading-tight">
                  {{ chair.assignedBarberName }}
                </p>
              </div>

              @if (chair.occupied && chair.currentCustomerName) {
              <div class="rounded-xl border border-amber-100 bg-amber-50 px-4 py-3">
                <p class="text-[11px] uppercase tracking-[0.2em] text-amber-600">
                  Current Customer
                </p>
                <p class="text-lg sm:text-xl font-bold text-amber-900 leading-tight">
                  {{ chair.currentCustomerName }}
                </p>
              </div>
              } @else {
              <div
                class="rounded-xl border border-slate-100 bg-white px-4 py-3 text-slate-400 text-sm"
              >
                Waiting for next customer
              </div>
              }
            </div>
          </div>
          }
        </div>
      </div>
    </div>
  `,
  styles: [
    `
      :host {
        display: block;
      }
    `,
  ],
})
export class LiveQueueComponent implements OnInit, OnDestroy {
  private queueService = inject(QueueService);
  private route = inject(ActivatedRoute);
  private branchService = inject(BranchService);

  chairs = signal<LiveChairStatus[]>([]);
  private refreshSubscription?: Subscription;
  branchId: number = 0;
  branchName = signal<string>('');

  ngOnInit() {
    // Get branchId from route params
    this.route.params.subscribe((params) => {
      this.branchId = +params['branchId'];
      if (this.branchId) {
        this.loadBranchName();
        this.loadLiveQueue();

        // Auto-refresh every 5 seconds
        this.refreshSubscription = interval(5000).subscribe(() => {
          this.loadLiveQueue();
        });
      }
    });
  }

  ngOnDestroy() {
    this.refreshSubscription?.unsubscribe();
  }

  loadLiveQueue() {
    this.queueService.getLiveQueue(this.branchId).subscribe({
      next: (data) => {
        this.chairs.set(data);
      },
      error: (err) => {
        console.error('Error loading live queue:', err);
      },
    });
  }

  private loadBranchName() {
    this.branchService.getBranch(this.branchId).subscribe({
      next: (branch) => this.branchName.set(branch.name),
      error: (err) => {
        console.error('Error loading branch:', err);
        this.branchName.set('Branch');
      },
    });
  }
}
