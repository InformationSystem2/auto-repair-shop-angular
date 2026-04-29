import {
  Component, inject, signal, computed, OnInit, OnDestroy, ChangeDetectionStrategy, ChangeDetectorRef
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { StatCardComponent } from '@dashboard/components/stat-card/stat-card.component';
import { TranslationService } from '@core/services/translation.service';
import { DashboardService, TechnicianDashboardData } from '@dashboard/services/dashboard.service';
import { LocationTrackingService } from '@core/services/location-tracking.service';

@Component({
  selector: 'app-technician-dashboard',
  imports: [CommonModule, StatCardComponent],
  templateUrl: './technician-dashboard.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TechnicianDashboardComponent implements OnInit, OnDestroy {
  readonly i18n = inject(TranslationService);
  private readonly dashboardService = inject(DashboardService);
  private readonly locationTracking = inject(LocationTrackingService);
  private readonly cdr = inject(ChangeDetectorRef);

  stats = signal<TechnicianDashboardData | null>(null);
  loading = signal(true);
  error = signal<string | null>(null);

  isSharingLocation = signal(false);
  sharingIncidentId = signal<string | null>(null);

  private statusSub: Subscription | null = null;

  ngOnInit(): void {
    this.dashboardService.getTechnicianStats().subscribe({
      next: (data) => {
        this.stats.set(data);
        this.loading.set(false);
      },
      error: () => {
        this.error.set(this.i18n.translate('dashboard.technician.error_loading'));
        this.loading.set(false);
      },
    });

    this.statusSub = this.locationTracking.connectionStatus$.subscribe(status => {
      this.isSharingLocation.set(status === 'connected');
      this.cdr.markForCheck();
    });
  }

  ngOnDestroy(): void {
    this.statusSub?.unsubscribe();
    if (this.isSharingLocation()) {
      this.locationTracking.disconnect();
    }
  }

  toggleSharing(incidentId: string): void {
    if (this.isSharingLocation() && this.sharingIncidentId() === incidentId) {
      this.locationTracking.disconnect();
      this.isSharingLocation.set(false);
      this.sharingIncidentId.set(null);
    } else {
      this.sharingIncidentId.set(incidentId);
      this.locationTracking.connectAsTechnician(incidentId);
    }
  }

  isSharingFor(incidentId: string): boolean {
    return this.isSharingLocation() && this.sharingIncidentId() === incidentId;
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
    if (!cat) return this.i18n.translate('dashboard.technician.no_category');
    return this.i18n.translate('requests.categories.' + cat.toLowerCase()) || cat;
  }

  initials(name: string): string {
    return name.split(' ').slice(0, 2).map(p => p[0]).join('').toUpperCase();
  }
}
