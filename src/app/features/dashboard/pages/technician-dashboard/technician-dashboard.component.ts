import { Component, inject, signal, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StatCardComponent } from '@dashboard/components/stat-card/stat-card.component';
import { TranslationService } from '@core/services/translation.service';
import { DashboardService, TechnicianDashboardData } from '@dashboard/services/dashboard.service';

@Component({
  selector: 'app-technician-dashboard',
  imports: [CommonModule, StatCardComponent],
  templateUrl: './technician-dashboard.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TechnicianDashboardComponent implements OnInit {
  readonly i18n = inject(TranslationService);
  private readonly dashboardService = inject(DashboardService);

  stats = signal<TechnicianDashboardData | null>(null);
  loading = signal(true);
  error = signal<string | null>(null);

  ngOnInit(): void {
    this.dashboardService.getTechnicianStats().subscribe({
      next: (data) => {
        this.stats.set(data);
        this.loading.set(false);
      },
      error: () => {
        this.error.set('Error al cargar el dashboard');
        this.loading.set(false);
      },
    });
  }

  priorityBadgeClass(priority: string | null): string {
    switch (priority) {
      case 'CRITICAL': return 'ds-badge ds-badge-red';
      case 'HIGH':     return 'ds-badge ds-badge-orange';
      case 'MEDIUM':   return 'ds-badge ds-badge-yellow';
      default:         return 'ds-badge ds-badge-blue';
    }
  }

  statusBadgeClass(status: string): string {
    return status === 'in_progress' ? 'ds-badge ds-badge-blue' : 'ds-badge ds-badge-yellow';
  }

  categoryLabel(cat: string | null): string {
    if (!cat) return 'Sin categoría';
    return cat.charAt(0).toUpperCase() + cat.slice(1);
  }

  initials(name: string): string {
    return name.split(' ').slice(0, 2).map(p => p[0]).join('').toUpperCase();
  }
}
