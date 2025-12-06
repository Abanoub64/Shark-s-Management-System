import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { StatCardComponent } from '../../../components/shared/stat-card/stat-card.component';
import { ChartComponent } from '../../../components/shared/chart/chart.component';
import { AnalyticsService } from '../../../core/services/analytics.service';
import { LanguageService } from '../../../core/services/language.service';
import { DashboardStats, RevenueBreakdown, TrendData } from '../../../core/models/models';

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
  langService = inject(LanguageService);

  stats: DashboardStats | null = null;
  revenueBreakdown: RevenueBreakdown | null = null;
  revenuePeriod: 'daily' | 'weekly' | 'monthly' = 'monthly';

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

  ngOnInit(): void {
    this.loadDashboardData();
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
