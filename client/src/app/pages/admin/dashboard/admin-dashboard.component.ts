import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { StatCardComponent } from '../../../components/shared/stat-card/stat-card.component';
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

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, StatCardComponent, ChartComponent],
  template: `
    <div class="space-y-4 md:space-y-6 fade-in">
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
        <div class="flex gap-2 md:gap-3">
          <button class="btn-outline text-sm md:text-base hidden sm:flex">
            <svg
              class="w-4 h-4 md:w-5 md:h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 0 01.707.293l5.414 5.414a1 0 01.293.707V19a2 0 01-2 2z"
              />
            </svg>
            <span class="hidden md:inline">{{ langService.t().exportReport }}</span>
          </button>
          <button class="btn-primary text-sm md:text-base">
            <svg
              class="w-4 h-4 md:w-5 md:h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 4v16m8-8H4"
              />
            </svg>
            <span class="hidden sm:inline">{{ langService.t().quickActions }}</span>
          </button>
        </div>
      </div>

      <!-- Branch Analytics Section -->
      <div class="card p-4 md:p-6">
        <h2 class="text-lg md:text-xl font-semibold mb-4" [style.color]="'var(--text-primary)'">
          📊 Branch Analytics
        </h2>

        <!-- Branch Selector -->
        <div class="mb-6">
          <label class="block text-sm font-medium mb-2" [style.color]="'var(--text-secondary)'">
            Select Branch to View Analytics
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
          <p class="text-sm" [style.color]="'var(--text-secondary)'">Loading branches...</p>
          }
        </div>

        <!-- Branch Analytics Display -->
        @if (selectedBranch && branchAnalytics) {
        <!-- KPI Cards for Selected Branch -->
        <div class="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 mb-6">
          <div
            class="card p-4 text-center"
            style="background: linear-gradient(135deg, rgba(13, 153, 153, 0.1), rgba(13, 153, 153, 0.05));"
          >
            <p class="text-xs font-medium mb-1" [style.color]="'var(--text-secondary)'">
              Total Bookings
            </p>
            <h3 class="text-2xl font-bold" [style.color]="'var(--primary-color)'">
              {{ branchAnalytics.totalBookings }}
            </h3>
            <p class="text-xs mt-1" [style.color]="'var(--text-secondary)'">
              Last {{ analyticsDays }} days: {{ branchAnalytics.totalBookingsLastDays }}
            </p>
          </div>
          <div
            class="card p-4 text-center"
            style="background: linear-gradient(135deg, rgba(16, 185, 129, 0.1), rgba(16, 185, 129, 0.05));"
          >
            <p class="text-xs font-medium mb-1" [style.color]="'var(--text-secondary)'">
              Total Revenue
            </p>
            <h3 class="text-2xl font-bold" style="color: #10b981;">
              \${{ branchAnalytics.totalRevenue | number }}
            </h3>
            <p class="text-xs mt-1" [style.color]="'var(--text-secondary)'">
              Last {{ analyticsDays }} days: \${{ branchAnalytics.totalRevenueLastDays | number }}
            </p>
          </div>
          <div
            class="card p-4 text-center"
            style="background: linear-gradient(135deg, rgba(245, 158, 11, 0.1), rgba(245, 158, 11, 0.05));"
          >
            <p class="text-xs font-medium mb-1" [style.color]="'var(--text-secondary)'">
              Avg Rating
            </p>
            <h3 class="text-2xl font-bold" style="color: #f59e0b;">
              ⭐ {{ branchAnalytics.avgRating | number : '1.1-1' }}
            </h3>
            <p class="text-xs mt-1" [style.color]="'var(--text-secondary)'">
              Customer satisfaction
            </p>
          </div>
          <div
            class="card p-4 text-center"
            style="background: linear-gradient(135deg, rgba(139, 92, 246, 0.1), rgba(139, 92, 246, 0.05));"
          >
            <p class="text-xs font-medium mb-1" [style.color]="'var(--text-secondary)'">
              Peak Hour
            </p>
            <h3 class="text-2xl font-bold" style="color: #8b5cf6;">
              {{ formatHour(branchAnalytics.peakHour) }}
            </h3>
            <p class="text-xs mt-1" [style.color]="'var(--text-secondary)'">
              {{ branchAnalytics.peakHourCount }} bookings
            </p>
          </div>
        </div>

        <!-- Charts Row -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6 mb-6">
          <!-- Bookings Per Day Chart -->
          <div class="card p-4">
            <h4 class="text-sm font-semibold mb-3" [style.color]="'var(--text-primary)'">
              📅 Bookings Per Day
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
              <p>No booking data available</p>
            </div>
            }
          </div>

          <!-- Revenue Per Day Chart -->
          <div class="card p-4">
            <h4 class="text-sm font-semibold mb-3" [style.color]="'var(--text-primary)'">
              💰 Revenue Per Day
            </h4>
            @if (revenuePerDayData && branchAnalytics.revenuePerDay.length > 0) {
            <app-chart
              type="line"
              [data]="revenuePerDayData"
              [options]="revenueChartOptions"
              [height]="'200px'"
            />
            } @else {
            <div class="flex items-center justify-center h-48 text-gray-400">
              <p>No revenue data available</p>
            </div>
            }
          </div>
        </div>

        <!-- Top Services Chart -->
        <div class="card p-4">
          <h4 class="text-sm font-semibold mb-3" [style.color]="'var(--text-primary)'">
            🏆 Top Services
          </h4>
          @if (topServicesData && branchAnalytics.topServices.length > 0) {
          <app-chart
            type="bar"
            [data]="topServicesData"
            [options]="servicesChartOptions"
            [height]="'250px'"
          />
          } @else {
          <div class="flex items-center justify-center h-48 text-gray-400">
            <p>No services data available</p>
          </div>
          }
        </div>
        } @else if (selectedBranch && loadingAnalytics) {
        <div class="flex items-center justify-center py-12">
          <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          <span class="ml-3" [style.color]="'var(--text-secondary)'">Loading analytics...</span>
        </div>
        } @else if (!selectedBranch) {
        <div class="flex flex-col items-center justify-center py-12 text-center">
          <div class="text-5xl mb-4">👆</div>
          <p class="text-lg font-medium" [style.color]="'var(--text-primary)'">Select a Branch</p>
          <p class="text-sm" [style.color]="'var(--text-secondary)'">
            Click on a branch above to view its analytics
          </p>
        </div>
        }
      </div>

      <!-- KPI Cards -->
      @if (stats) {
      <div class="dashboard-grid">
        <app-stat-card
          [title]="langService.t().totalRevenueYTD"
          [value]="stats.ytdRevenue"
          [subtitle]="langService.t().yearToDateEarnings"
          [trend]="12.5"
          icon="💰"
          variant="primary"
        />
        <app-stat-card
          [title]="langService.t().totalBookings"
          [value]="stats.totalBookings"
          [subtitle]="langService.t().allTimeBookings"
          [trend]="8.2"
          icon="📅"
          variant="success"
        />
        <app-stat-card
          [title]="langService.t().activeBranches"
          [value]="stats.totalBranches"
          [subtitle]="langService.t().operationalLocations"
          icon="🏪"
          variant="default"
        />
        <app-stat-card
          [title]="langService.t().avgWaitTime"
          [value]="stats.averageWaitTime"
          [subtitle]="langService.t().minutesPerCustomer"
          [trend]="-15.3"
          icon="⏱️"
          variant="warning"
        />
      </div>
      }

      <!-- Revenue Metrics -->
      <div class="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6">
        <div class="card p-4 md:p-6">
          <div class="text-center">
            <p class="text-xs md:text-sm" [style.color]="'var(--text-secondary)'">
              {{ langService.t().dailyRevenue }}
            </p>
            <h3 class="text-xl md:text-2xl font-bold mt-1" [style.color]="'var(--text-primary)'">
              \${{ stats?.dailyRevenue | number }}
            </h3>
          </div>
        </div>
        <div class="card p-4 md:p-6">
          <div class="text-center">
            <p class="text-xs md:text-sm" [style.color]="'var(--text-secondary)'">
              {{ langService.t().weeklyRevenue }}
            </p>
            <h3 class="text-xl md:text-2xl font-bold mt-1" [style.color]="'var(--text-primary)'">
              \${{ stats?.weeklyRevenue | number }}
            </h3>
          </div>
        </div>
        <div class="card p-4 md:p-6">
          <div class="text-center">
            <p class="text-xs md:text-sm" [style.color]="'var(--text-secondary)'">
              {{ langService.t().monthlyRevenue }}
            </p>
            <h3 class="text-xl md:text-2xl font-bold mt-1" [style.color]="'var(--text-primary)'">
              \${{ stats?.monthlyRevenue | number }}
            </h3>
          </div>
        </div>
        <div class="card p-4 md:p-6">
          <div class="text-center">
            <p class="text-xs md:text-sm" [style.color]="'var(--text-secondary)'">
              {{ langService.t().completedBookings }}
            </p>
            <h3 class="text-xl md:text-2xl font-bold mt-1" [style.color]="'var(--text-primary)'">
              {{ stats?.completedBookings | number }}
            </h3>
          </div>
        </div>
      </div>

      <!-- Charts Row 1 -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
        <!-- Revenue Trends -->
        <div class="card p-4 md:p-6">
          <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
            <h3 class="text-base md:text-lg font-semibold" [style.color]="'var(--text-primary)'">
              {{ langService.t().revenueTrends }}
            </h3>
            <select
              class="input text-xs md:text-sm py-1 px-2 w-full sm:w-auto"
              [(ngModel)]="revenuePeriod"
              (change)="loadRevenueTrends()"
            >
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
            </select>
          </div>
          @if (revenueTrendData) {
          <app-chart
            type="line"
            [data]="revenueTrendData"
            [options]="lineChartOptions"
            [height]="'250px'"
          />
          }
        </div>

        <!-- Revenue by Branch -->
        <div class="card p-4 md:p-6">
          <h3 class="text-base md:text-lg font-semibold mb-4" [style.color]="'var(--text-primary)'">
            {{ langService.t().revenueByBranch }}
          </h3>
          @if (revenueByBranchData) {
          <app-chart
            type="bar"
            [data]="revenueByBranchData"
            [options]="barChartOptions"
            [height]="'250px'"
          />
          }
        </div>
      </div>

      <!-- Charts Row 2 -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        <!-- Revenue by Service -->
        <div class="card p-4 md:p-6">
          <h3 class="text-base md:text-lg font-semibold mb-4" [style.color]="'var(--text-primary)'">
            {{ langService.t().revenueByService }}
          </h3>
          @if (revenueByServiceData) {
          <app-chart
            type="doughnut"
            [data]="revenueByServiceData"
            [options]="doughnutChartOptions"
            [height]="'250px'"
          />
          }
        </div>

        <!-- Top Barbers -->
        <div class="card p-4 md:p-6">
          <h3 class="text-base md:text-lg font-semibold mb-4" [style.color]="'var(--text-primary)'">
            {{ langService.t().topPerformingBarbers }}
          </h3>
          @if (revenueByBarberData) {
          <app-chart
            type="bar"
            [data]="revenueByBarberData"
            [options]="horizontalBarOptions"
            [height]="'250px'"
          />
          }
        </div>

        <!-- Customer Stats -->
        <div class="card p-4 md:p-6">
          <h3 class="text-base md:text-lg font-semibold mb-4" [style.color]="'var(--text-primary)'">
            {{ langService.t().customerBreakdown }}
          </h3>
          @if (customerData) {
          <app-chart
            type="pie"
            [data]="customerData"
            [options]="pieChartOptions"
            [height]="'250px'"
          />
          }
        </div>
      </div>

      <!-- Peak Hours Chart -->
      <div class="card p-4 md:p-6">
        <h3 class="text-base md:text-lg font-semibold mb-4" [style.color]="'var(--text-primary)'">
          {{ langService.t().revenueByTimeOfDay }}
        </h3>
        @if (revenueByTimeData) {
        <app-chart
          type="line"
          [data]="revenueByTimeData"
          [options]="areaChartOptions"
          [height]="'200px'"
        />
        }
      </div>

      <!-- Quick Stats Grid -->
      <div class="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-6">
        <div class="card p-4 md:p-6 text-center">
          <div class="text-2xl md:text-3xl mb-2">👥</div>
          <h4 class="text-xl md:text-2xl font-bold" [style.color]="'var(--text-primary)'">
            {{ stats?.newCustomers | number }}
          </h4>
          <p class="text-xs md:text-sm mt-1" [style.color]="'var(--text-secondary)'">
            {{ langService.t().newCustomers }}
          </p>
        </div>
        <div class="card p-4 md:p-6 text-center">
          <div class="text-2xl md:text-3xl mb-2">🔄</div>
          <h4 class="text-xl md:text-2xl font-bold" [style.color]="'var(--text-primary)'">
            {{ stats?.returningCustomers | number }}
          </h4>
          <p class="text-xs md:text-sm mt-1" [style.color]="'var(--text-secondary)'">
            {{ langService.t().returningCustomers }}
          </p>
        </div>
        <div class="card p-4 md:p-6 text-center">
          <div class="text-2xl md:text-3xl mb-2">❌</div>
          <h4 class="text-xl md:text-2xl font-bold" [style.color]="'var(--text-primary)'">
            {{ stats?.cancelledBookings | number }}
          </h4>
          <p class="text-xs md:text-sm mt-1" [style.color]="'var(--text-secondary)'">
            {{ langService.t().cancelledBookings }}
          </p>
        </div>
        <div class="card p-4 md:p-6 text-center">
          <div class="text-2xl md:text-3xl mb-2">⭐</div>
          <h4 class="text-xl md:text-2xl font-bold" [style.color]="'var(--text-primary)'">4.8</h4>
          <p class="text-xs md:text-sm mt-1" [style.color]="'var(--text-secondary)'">
            {{ langService.t().averageRating }}
          </p>
        </div>
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

  // Branch Analytics Chart Data
  bookingsPerDayData: any = null;
  revenuePerDayData: any = null;
  topServicesData: any = null;

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
          callback: (value: any) => '$' + value.toLocaleString(),
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
          callback: (value: any) => '$' + value.toLocaleString(),
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
          callback: (value: any) => '$' + value.toLocaleString(),
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
          callback: (value: any) => '$' + value.toLocaleString(),
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
          callback: (value: any) => '$' + value.toLocaleString(),
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
    this.loadBranchAnalytics(branch.id);
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

    // Revenue Per Day Chart
    if (analytics.revenuePerDay && analytics.revenuePerDay.length > 0) {
      this.revenuePerDayData = {
        labels: analytics.revenuePerDay.map((d) => this.formatDate(d.date)),
        datasets: [
          {
            label: 'Revenue',
            data: analytics.revenuePerDay.map((d) => d.amount),
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
