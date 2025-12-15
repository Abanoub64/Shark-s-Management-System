import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ChartComponent } from '../../../components/shared/chart/chart.component';
import { AnalyticsService } from '../../../core/services/analytics.service';
import { LanguageService } from '../../../core/services/language.service';
import { BranchService, Branch } from '../../../core/services/branch.service';
import {
  DashboardStats,
  RevenueBreakdown,
  TrendData,
  BranchAnalytics,
} from '../../../core/models/models';
import { UiSkeletonComponent } from '../../../components/shared/ui-skeleton.component';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, ChartComponent, UiSkeletonComponent],
  template: `
    <div class="space-y-4 md:space-y-6 fade-in">
      <!-- Header -->
      <!-- Header -->
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 class="text-2xl md:text-3xl font-bold" [style.color]="'var(--text-primary)'">
            {{ langService.t().superAdminDashboard }}
          </h1>
          <p class="text-sm md:text-base mt-1" [style.color]="'var(--text-secondary)'">
            {{ langService.t().welcomeMessage }}
          </p>
        </div>
      </div>

      <!-- Branch Analytics Section -->
      <div class="card p-4 md:p-6">
        <h2 class="text-lg md:text-xl font-semibold mb-4" [style.color]="'var(--text-primary)'">
          📊 {{ langService.t().branchAnalytics }}
        </h2>

        <!-- Branch Selector and Days Filter -->
        <div class="mb-6 space-y-4">
          <!-- Branch Selector -->
          <div>
            <label class="block text-sm font-medium mb-2" [style.color]="'var(--text-secondary)'">
              {{ langService.t().selectBranchToView }}
            </label>
            <div class="flex flex-wrap gap-2">
              @for (branch of branches; track branch.id) {
              <button
                (click)="selectBranch(branch)"
                class="px-4 py-2 rounded-lg transition-all duration-200 text-sm font-medium"
                [class]="
                  selectedBranch?.id === branch.id
                    ? 'bg-primary text-white shadow-md scale-105'
                    : 'bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600'
                "
                [style.color]="selectedBranch?.id === branch.id ? 'white' : 'var(--text-primary)'"
              >
                🏪 {{ branch.name }}
              </button>
              }
            </div>
            @if (branches.length === 0) {
            <p class="text-sm" [style.color]="'var(--text-secondary)'">
              {{ langService.t().loadingBranches }}
            </p>
            }
          </div>

          <!-- Days Selector -->
          @if (selectedBranch) {
          <div>
            <label class="block text-sm font-medium mb-2" [style.color]="'var(--text-secondary)'">
              📅 {{ langService.t().analyticsPeriod }}
            </label>
            <div class="flex flex-wrap gap-2 items-center">
              <button
                (click)="changeDays(7)"
                class="px-4 py-2 rounded-lg transition-all duration-200 text-sm font-medium"
                [class]="
                  analyticsDays === 7
                    ? 'bg-primary text-white shadow-md'
                    : 'bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600'
                "
                [style.color]="analyticsDays === 7 ? 'white' : 'var(--text-primary)'"
              >
                {{ langService.t().sevenDays }}
              </button>
              <button
                (click)="changeDays(30)"
                class="px-4 py-2 rounded-lg transition-all duration-200 text-sm font-medium"
                [class]="
                  analyticsDays === 30
                    ? 'bg-primary text-white shadow-md'
                    : 'bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600'
                "
                [style.color]="analyticsDays === 30 ? 'white' : 'var(--text-primary)'"
              >
                {{ langService.t().thirtyDays }}
              </button>
              <div class="flex items-center gap-2">
                <span class="text-sm" [style.color]="'var(--text-secondary)'"
                  >{{ langService.t().custom }}:</span
                >
                <input
                  type="number"
                  [(ngModel)]="customDays"
                  (change)="changeDays(customDays)"
                  min="1"
                  max="365"
                  [placeholder]="langService.t().days"
                  class="w-16 px-2 py-2 rounded-lg border text-sm"
                  [style.borderColor]="'var(--border-color)'"
                  [style.color]="'var(--text-primary)'"
                />
              </div>
            </div>
          </div>
          }
        </div>

        <!-- Branch Analytics Display -->
        @if (selectedBranch && branchAnalytics) {
        <!-- KPI Cards for Selected Branch -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4 mb-6">
          <div
            class="card p-4 text-center"
            style="background: linear-gradient(135deg, rgba(13, 153, 153, 0.1), rgba(13, 153, 153, 0.05));"
          >
            <p class="text-xs font-medium mb-1" [style.color]="'var(--text-secondary)'">
              {{ langService.t().totalBookings }}
            </p>
            <h3 class="text-2xl font-bold" [style.color]="'var(--primary-color)'">
              {{ branchAnalytics.totalBookings }}
            </h3>
            <p class="text-xs mt-1" [style.color]="'var(--text-secondary)'">
              {{ langService.t().last }} {{ analyticsDays }} {{ langService.t().days }}:
              {{ branchAnalytics.totalBookingsLastDays }}
            </p>
          </div>
          <div
            class="card p-4 text-center"
            style="background: linear-gradient(135deg, rgba(16, 185, 129, 0.1), rgba(16, 185, 129, 0.05));"
          >
            <p class="text-xs font-medium mb-1" [style.color]="'var(--text-secondary)'">
              {{ langService.t().totalRevenue }}
            </p>
            <h3 class="text-2xl font-bold" style="color: #10b981;">
              {{ branchAnalytics.totalOrdersValue | number }} LE
            </h3>
            <p class="text-xs mt-1" [style.color]="'var(--text-secondary)'">
              {{ branchAnalytics.ordersCount }} {{ langService.t().orders }}
            </p>
          </div>
          <div
            class="card p-4 text-center"
            style="background: linear-gradient(135deg, rgba(245, 158, 11, 0.1), rgba(245, 158, 11, 0.05));"
          >
            <p class="text-xs font-medium mb-1" [style.color]="'var(--text-secondary)'">
              {{ langService.t().avgRating }}
            </p>
            <h3 class="text-2xl font-bold" style="color: #f59e0b;">
              ⭐ {{ branchAnalytics.averageRating | number : '1.1-1' }}
            </h3>
            <p class="text-xs mt-1" [style.color]="'var(--text-secondary)'">
              {{ langService.t().customerSatisfaction }}
            </p>
          </div>
        </div>

        <!-- Charts Row -->
        <div class="grid grid-cols-1 gap-4 md:gap-6 mb-6">
          <!-- Bookings Per Day Chart -->
          <div class="card p-4">
            <h4 class="text-sm font-semibold mb-3" [style.color]="'var(--text-primary)'">
              📅 {{ langService.t().bookingsPerDay }}
            </h4>
            @if (bookingsPerDayData && branchAnalytics.bookingsPerDay.length > 0) {
            <app-chart
              type="line"
              [data]="bookingsPerDayData"
              [options]="bookingsChartOptions"
              [height]="'200px'"
            />
            } @else {
            <div class="flex items-center justify-center h-48 text-gray-400">
              <p>{{ langService.t().noBookingData }}</p>
            </div>
            }
          </div>
        </div>

        <!-- Bookings Status + Queue/Chairs KPIs + Orders KPI -->
        <div class="grid grid-cols-1 lg:grid-cols-4 gap-4 md:gap-6 mb-6">
          <div class="card p-4">
            <h4 class="text-sm font-semibold mb-3" [style.color]="'var(--text-primary)'">
              ✅ {{ langService.t().bookingsByStatus }}
            </h4>
            @if (bookingsStatusData) {
            <app-chart
              type="doughnut"
              [data]="bookingsStatusData"
              [options]="pieChartOptions"
              [height]="'220px'"
            />
            } @else {
            <div class="flex items-center justify-center h-48 text-gray-400">
              <p>{{ langService.t().noStatusData }}</p>
            </div>
            }
          </div>
          <div class="card p-4 text-center">
            <p class="text-xs font-medium mb-1" [style.color]="'var(--text-secondary)'">
              {{ langService.t().pendingQueue }}
            </p>
            <h3 class="text-2xl font-bold" [style.color]="'var(--text-primary)'">
              {{ branchAnalytics.pendingQueueCount }}
            </h3>
            <p class="text-xs mt-1" [style.color]="'var(--text-secondary)'">
              {{ langService.t().waitingCustomers }}
            </p>
          </div>
          <div class="card p-4 text-center">
            <p class="text-xs font-medium mb-1" [style.color]="'var(--text-secondary)'">
              {{ langService.t().occupiedChairs }}
            </p>
            <h3 class="text-2xl font-bold" [style.color]="'var(--text-primary)'">
              {{ branchAnalytics.occupiedChairs }}
            </h3>
            <p class="text-xs mt-1" [style.color]="'var(--text-secondary)'">
              {{ langService.t().currentlyBusy }}
            </p>
          </div>
          <div class="card p-4 text-center">
            <p class="text-xs font-medium mb-1" [style.color]="'var(--text-secondary)'">
              {{ langService.t().orders }}
            </p>
            <h3 class="text-2xl font-bold" style="color:#0d9999">
              {{ branchAnalytics.ordersCount }}
            </h3>
            <p class="text-xs mt-1" [style.color]="'var(--text-secondary)'">
              {{ langService.t().inLast }} {{ analyticsDays }} {{ langService.t().days }}
            </p>
          </div>
        </div>

        <!-- Rating Gauge -->
        <div class="card p-4">
          <h4 class="text-sm font-semibold mb-3" [style.color]="'var(--text-primary)'">
            ⭐ {{ langService.t().averageRatingTitle }}
          </h4>
          @if (ratingGaugeData) {
          <app-chart
            type="doughnut"
            [data]="ratingGaugeData"
            [options]="doughnutChartOptions"
            [height]="'180px'"
          />
          <p class="text-xs mt-3 text-center" [style.color]="'var(--text-secondary)'">
            {{ langService.t().basedOn }} {{ branchAnalytics.ratingsCount }}
            {{ langService.t().ratings }}
          </p>
          } @else {
          <div class="flex items-center justify-center h-32 text-gray-400">
            <p>{{ langService.t().noRatingsData }}</p>
          </div>
          }
        </div>
        } @else if (selectedBranch && loadingAnalytics) {
        <div class="space-y-6">
          <!-- KPI Cards Skeletons -->
          <div class="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4">
            <div class="card p-4">
              <app-ui-skeleton width="120px" height="16px" className="mb-2"></app-ui-skeleton>
              <app-ui-skeleton width="80px" height="32px" className="mb-2"></app-ui-skeleton>
              <app-ui-skeleton width="150px" height="14px"></app-ui-skeleton>
            </div>
            <div class="card p-4">
              <app-ui-skeleton width="120px" height="16px" className="mb-2"></app-ui-skeleton>
              <app-ui-skeleton width="100px" height="32px" className="mb-2"></app-ui-skeleton>
              <app-ui-skeleton width="80px" height="14px"></app-ui-skeleton>
            </div>
            <div class="card p-4">
              <app-ui-skeleton width="100px" height="16px" className="mb-2"></app-ui-skeleton>
              <app-ui-skeleton width="90px" height="32px" className="mb-2"></app-ui-skeleton>
              <app-ui-skeleton width="140px" height="14px"></app-ui-skeleton>
            </div>
          </div>

          <!-- Bookings Per Day Chart Skeleton -->
          <div class="card p-4">
            <app-ui-skeleton width="150px" height="20px" className="mb-3"></app-ui-skeleton>
            <app-ui-skeleton width="100%" height="200px" className="rounded-lg"></app-ui-skeleton>
          </div>

          <!-- Status Chart + 3 KPI Cards Grid Skeleton -->
          <div class="grid grid-cols-1 lg:grid-cols-4 gap-4 md:gap-6">
            <!-- Status Chart Skeleton -->
            <div class="card p-4">
              <app-ui-skeleton width="140px" height="20px" className="mb-3"></app-ui-skeleton>
              <app-ui-skeleton width="100%" height="220px" className="rounded-lg"></app-ui-skeleton>
            </div>
            <!-- Pending Queue KPI -->
            <div class="card p-4">
              <app-ui-skeleton
                width="100px"
                height="16px"
                className="mb-2 mx-auto"
              ></app-ui-skeleton>
              <app-ui-skeleton
                width="60px"
                height="32px"
                className="mb-2 mx-auto"
              ></app-ui-skeleton>
              <app-ui-skeleton width="120px" height="14px" className="mx-auto"></app-ui-skeleton>
            </div>
            <!-- Occupied Chairs KPI -->
            <div class="card p-4">
              <app-ui-skeleton
                width="100px"
                height="16px"
                className="mb-2 mx-auto"
              ></app-ui-skeleton>
              <app-ui-skeleton
                width="60px"
                height="32px"
                className="mb-2 mx-auto"
              ></app-ui-skeleton>
              <app-ui-skeleton width="100px" height="14px" className="mx-auto"></app-ui-skeleton>
            </div>
            <!-- Orders KPI -->
            <div class="card p-4">
              <app-ui-skeleton
                width="80px"
                height="16px"
                className="mb-2 mx-auto"
              ></app-ui-skeleton>
              <app-ui-skeleton
                width="60px"
                height="32px"
                className="mb-2 mx-auto"
              ></app-ui-skeleton>
              <app-ui-skeleton width="120px" height="14px" className="mx-auto"></app-ui-skeleton>
            </div>
          </div>

          <!-- Rating Gauge Skeleton -->
          <div class="card p-4">
            <app-ui-skeleton width="160px" height="20px" className="mb-3"></app-ui-skeleton>
            <app-ui-skeleton
              width="100%"
              height="180px"
              className="rounded-lg mb-3"
            ></app-ui-skeleton>
            <app-ui-skeleton width="150px" height="14px" className="mx-auto"></app-ui-skeleton>
          </div>
        </div>
        } @else if (!selectedBranch) {
        <div class="flex flex-col items-center justify-center py-12 text-center">
          <div class="text-5xl mb-4">👆</div>
          <p class="text-lg font-medium" [style.color]="'var(--text-primary)'">
            {{ langService.t().selectABranch }}
          </p>
          <p class="text-sm" [style.color]="'var(--text-secondary)'">
            {{ langService.t().clickBranchAbove }}
          </p>
        </div>
        }
      </div>
    </div>
  `,
  styles: [],
})
export class AdminDashboardComponent implements OnInit {
  private analyticsService = inject(AnalyticsService);
  private branchService = inject(BranchService);
  langService = inject(LanguageService);

  stats: DashboardStats | null = null;
  revenueBreakdown: RevenueBreakdown | null = null;
  revenuePeriod: 'daily' | 'weekly' | 'monthly' = 'monthly';

  // Branch Analytics
  branches: Branch[] = [];
  selectedBranch: Branch | null = null;
  branchAnalytics: BranchAnalytics | null = null;
  loadingAnalytics = false;
  analyticsDays = 30;
  customDays = 30;

  // Branch Analytics Chart Data
  bookingsPerDayData: any = null;
  revenuePerDayData: any = null;
  topServicesData: any = null;
  bookingsStatusData: any = null;
  ratingGaugeData: any = null;

  // Chart data
  revenueTrendData: any = null;
  revenueByBranchData: any = null;
  revenueByServiceData: any = null;
  revenueByBarberData: any = null;
  revenueByTimeData: any = null;
  customerData: any = null;

  // Chart options
  lineChartOptions = {
    responsive: true,
    plugins: {
      legend: { display: false },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: (value: any) => value.toLocaleString() + ' LE',
        },
      },
    },
  };

  barChartOptions = {
    responsive: true,
    plugins: {
      legend: { display: false },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: (value: any) => value.toLocaleString() + ' LE',
        },
      },
    },
  };

  horizontalBarOptions = {
    indexAxis: 'y' as const,
    responsive: true,
    plugins: {
      legend: { display: false },
    },
    scales: {
      x: {
        beginAtZero: true,
        ticks: {
          callback: (value: any) => value.toLocaleString() + ' LE',
        },
      },
    },
  };

  doughnutChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'bottom' as const,
      },
    },
  };

  pieChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'bottom' as const,
      },
    },
  };

  areaChartOptions = {
    responsive: true,
    plugins: {
      legend: { display: false },
      filler: {
        propagate: true,
      },
    },
    elements: {
      line: {
        tension: 0.4,
        fill: true,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: (value: any) => value.toLocaleString() + ' LE',
        },
      },
    },
  };

  // Branch Analytics Chart Options
  bookingsChartOptions = {
    responsive: true,
    plugins: {
      legend: { display: false },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  revenueChartOptions = {
    responsive: true,
    plugins: {
      legend: { display: false },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: (value: any) => value.toLocaleString() + ' LE',
        },
      },
    },
  };

  servicesChartOptions = {
    responsive: true,
    plugins: {
      legend: { display: false },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  ngOnInit(): void {
    this.loadDashboardData();
    this.loadBranches();
  }

  private loadBranches(): void {
    this.branchService.getAllBranches().subscribe({
      next: (branches) => {
        this.branches = branches;
      },
      error: (err) => {
        console.error('Failed to load branches:', err);
      },
    });
  }

  selectBranch(branch: Branch): void {
    this.selectedBranch = branch;
    this.analyticsDays = 30; // Reset to default
    this.customDays = 30;
    this.loadBranchAnalytics(branch.id);
  }

  changeDays(days: number): void {
    if (days > 0 && days <= 365) {
      this.analyticsDays = days;
      this.customDays = days;
      if (this.selectedBranch) {
        this.loadBranchAnalytics(this.selectedBranch.id);
      }
    }
  }

  private loadBranchAnalytics(branchId: number): void {
    this.loadingAnalytics = true;
    this.branchAnalytics = null;

    this.analyticsService.getBranchAnalytics(branchId, this.analyticsDays).subscribe({
      next: (analytics) => {
        this.branchAnalytics = analytics;
        this.prepareBranchChartData(analytics);
        this.loadingAnalytics = false;
      },
      error: (err) => {
        console.error('Failed to load branch analytics:', err);
        this.loadingAnalytics = false;
      },
    });
  }

  private prepareBranchChartData(analytics: BranchAnalytics): void {
    // Bookings Per Day Chart
    if (analytics.bookingsPerDay && analytics.bookingsPerDay.length > 0) {
      this.bookingsPerDayData = {
        labels: analytics.bookingsPerDay.map((d) => this.formatDate(d.date)),
        datasets: [
          {
            label: 'Bookings',
            data: analytics.bookingsPerDay.map((d) => d.count),
            borderColor: '#0d9999',
            backgroundColor: 'rgba(13, 153, 153, 0.1)',
            fill: true,
            tension: 0.4,
          },
        ],
      };
    }

    // Revenue Per Day Chart (zero-fill missing days over last analyticsDays)
    if (analytics.revenuePerDay && analytics.revenuePerDay.length > 0) {
      const byDate: Record<string, number> = {};
      for (const d of analytics.revenuePerDay) {
        // Normalize to YYYY-MM-DD for stable keying
        const dateKey = new Date(d.date).toISOString().slice(0, 10);
        byDate[dateKey] = d.amount ?? 0;
      }

      const dates: string[] = [];
      const values: number[] = [];
      const today = new Date();
      // Generate last N days range (inclusive of today)
      for (let i = this.analyticsDays - 1; i >= 0; i--) {
        const dt = new Date(today);
        dt.setDate(today.getDate() - i);
        const key = dt.toISOString().slice(0, 10);
        dates.push(this.formatDate(key));
        values.push(byDate[key] ?? 0);
      }

      this.revenuePerDayData = {
        labels: dates,
        datasets: [
          {
            label: 'Revenue',
            data: values,
            borderColor: '#10b981',
            backgroundColor: 'rgba(16, 185, 129, 0.1)',
            fill: true,
            tension: 0.4,
          },
        ],
      };
    }

    // Top Services Chart
    if (analytics.topServices && analytics.topServices.length > 0) {
      this.topServicesData = {
        labels: analytics.topServices.map((s) => s.serviceName),
        datasets: [
          {
            label: 'Bookings',
            data: analytics.topServices.map((s) => s.count),
            backgroundColor: ['#0d9999', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'],
          },
        ],
      };
    }

    // Bookings by Status Chart (doughnut)
    if (analytics.bookingsByStatus) {
      const labels = Object.keys(analytics.bookingsByStatus);
      const data = Object.values(analytics.bookingsByStatus);
      this.bookingsStatusData = {
        labels,
        datasets: [
          {
            data,
            backgroundColor: ['#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#0ea5e9'],
          },
        ],
      };
    } else {
      this.bookingsStatusData = null;
    }

    // Rating gauge (averageRating out of 5)
    if (typeof analytics.averageRating === 'number') {
      const val = Math.max(0, Math.min(5, analytics.averageRating));
      this.ratingGaugeData = {
        labels: ['Rating', 'Remaining'],
        datasets: [
          {
            data: [val, 5 - val],
            backgroundColor: ['#f59e0b', '#e5e7eb'],
            borderWidth: 0,
          },
        ],
      };
    } else {
      this.ratingGaugeData = null;
    }
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  }

  formatHour(hour: number): string {
    if (hour === 0) return '12 AM';
    if (hour < 12) return `${hour} AM`;
    if (hour === 12) return '12 PM';
    return `${hour - 12} PM`;
  }

  private loadDashboardData(): void {
    // Load stats
    this.analyticsService.getDashboardStats().subscribe((stats) => {
      this.stats = stats;
    });

    // Load revenue breakdown
    this.analyticsService.getRevenueBreakdown().subscribe((breakdown) => {
      this.revenueBreakdown = breakdown;
      this.prepareChartData(breakdown);
    });

    // Load revenue trends
    this.loadRevenueTrends();
  }

  loadRevenueTrends(): void {
    this.analyticsService.getRevenueTrends(this.revenuePeriod).subscribe((trends) => {
      this.revenueTrendData = {
        labels: trends.map((t) => t.label),
        datasets: [
          {
            label: 'Revenue',
            data: trends.map((t) => t.value),
            borderColor: '#0d9999',
            backgroundColor: 'rgba(13, 153, 153, 0.1)',
            fill: true,
            tension: 0.4,
          },
        ],
      };
    });
  }

  private prepareChartData(breakdown: RevenueBreakdown): void {
    // Revenue by Branch
    this.revenueByBranchData = {
      labels: breakdown.byBranch.map((b) => b.branchName),
      datasets: [
        {
          label: 'Revenue',
          data: breakdown.byBranch.map((b) => b.revenue),
          backgroundColor: '#0d9999',
        },
      ],
    };

    // Revenue by Service
    this.revenueByServiceData = {
      labels: breakdown.byService.map((s) => s.serviceName),
      datasets: [
        {
          data: breakdown.byService.map((s) => s.revenue),
          backgroundColor: ['#0d9999', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'],
        },
      ],
    };

    // Revenue by Barber
    this.revenueByBarberData = {
      labels: breakdown.byBarber.map((b) => b.barberName),
      datasets: [
        {
          label: 'Revenue',
          data: breakdown.byBarber.map((b) => b.revenue),
          backgroundColor: '#10b981',
        },
      ],
    };

    // Revenue by Time of Day
    this.revenueByTimeData = {
      labels: breakdown.byTimeOfDay.map((t) => `${t.hour}:00`),
      datasets: [
        {
          label: 'Revenue',
          data: breakdown.byTimeOfDay.map((t) => t.revenue),
          borderColor: '#f59e0b',
          backgroundColor: 'rgba(245, 158, 11, 0.2)',
          fill: true,
          tension: 0.4,
        },
      ],
    };

    // Customer Data
    if (this.stats) {
      this.customerData = {
        labels: ['New Customers', 'Returning Customers'],
        datasets: [
          {
            data: [this.stats.newCustomers, this.stats.returningCustomers],
            backgroundColor: ['#0d9999', '#10b981'],
          },
        ],
      };
    }
  }
}
