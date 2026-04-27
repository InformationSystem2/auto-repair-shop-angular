import { Component, inject, ChangeDetectionStrategy, computed } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { catchError, of } from 'rxjs';
import { DecimalPipe } from '@angular/common';
import { AuthService } from '@core/auth/auth.service';
import { StatCardComponent } from '@dashboard/components/stat-card/stat-card.component';
import { TranslationService } from '@core/services/translation.service';
import { DashboardService } from '@dashboard/services/dashboard.service';
import { WorkshopReviewsComponent } from './components/workshop-reviews.component';

@Component({
  selector: 'app-workshop-dashboard',
  standalone: true,
  imports: [StatCardComponent, DecimalPipe, WorkshopReviewsComponent],
  templateUrl: './workshop-dashboard.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WorkshopDashboardComponent {
  readonly auth = inject(AuthService);
  readonly i18n = inject(TranslationService);
  private readonly _svc = inject(DashboardService);

  readonly data = toSignal(
    this._svc.getWorkshopStats().pipe(catchError(() => of(null))),
    { initialValue: undefined }
  );

  readonly isLoading = computed(() => this.data() === undefined);
  readonly hasError  = computed(() => this.data() === null);

  // ── Technician bars ──────────────────────────────────────────────────────
  readonly techWithBars = computed(() => {
    const list = this.data()?.technician_performance ?? [];
    const max = Math.max(...list.map(t => t.incidents_completed), 1);
    return list.map(t => ({
      ...t,
      barPct: Math.round((t.incidents_completed / max) * 100) + '%',
    }));
  });

  // ── Availability donut ───────────────────────────────────────────────────
  readonly availabilityGradient = computed(() => {
    const locs = this.data()?.technician_locations ?? [];
    if (!locs.length) return 'conic-gradient(var(--ds-surface0) 0deg 360deg)';
    const busy = locs.filter(t => !t.is_available).length;
    const total = locs.length;
    const busyDeg = Math.round((busy / total) * 360);
    return `conic-gradient(var(--ds-peach) 0deg ${busyDeg}deg, var(--ds-teal) ${busyDeg}deg 360deg)`;
  });

  readonly busyCount = computed(() =>
    (this.data()?.technician_locations ?? []).filter(t => !t.is_available).length
  );
  readonly freeCount = computed(() =>
    (this.data()?.technician_locations ?? []).filter(t => t.is_available).length
  );
  readonly totalTechs = computed(() => (this.data()?.technician_locations ?? []).length);

  // ── Revenue SVG ──────────────────────────────────────────────────────────
  readonly weekDays = computed(() =>
    (this.data()?.daily_revenue ?? []).map(d => d.day)
  );
  readonly revenuePoints = computed(() =>
    this._toSvgPoints((this.data()?.daily_revenue ?? []).map(d => d.revenue))
  );
  readonly revenueArea = computed(() => this._toArea(this.revenuePoints()));
  readonly revenueDataPts = computed((): [number, number][] => {
    const vals = (this.data()?.daily_revenue ?? []).map(d => d.revenue);
    if (!vals.length) return [];
    const max = Math.max(...vals, 1);
    const step = vals.length > 1 ? 600 / (vals.length - 1) : 0;
    return vals.map((v, i): [number, number] => [
      Math.round(i * step),
      Math.round(155 - (v / max) * 130),
    ]);
  });

  // ── Emergency inbox ──────────────────────────────────────────────────────
  readonly inbox = computed(() => this.data()?.emergency_inbox ?? []);

  // ── Live technician blips ────────────────────────────────────────────────
  readonly techLocations = computed(() => this.data()?.technician_locations ?? []);

  // ── Blip positions (random grid placement for demo) ──────────────────────
  readonly techBlips = computed(() =>
    this.techLocations().map((t, i) => ({
      ...t,
      initials: t.name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase(),
      top:  [28, 52, 18, 68, 42, 35, 60][i % 7],
      left: [22, 58, 72, 15, 44, 80, 33][i % 7],
    }))
  );

  // ── Formatters ──────────────────────────────────────────────────────────
  fmt(n: number): string {
    return n.toLocaleString('es-BO', { maximumFractionDigits: 0 });
  }

  fmtTime(iso: string): string {
    try { return new Date(iso).toLocaleTimeString('es-BO', { hour: '2-digit', minute: '2-digit' }); }
    catch { return iso; }
  }

  priorityClass(priority: string | null): string {
    if (!priority) return 'ds-badge ds-badge-neutral';
    const map: Record<string, string> = {
      HIGH: 'ds-badge ds-badge-red',
      CRITICAL: 'ds-badge ds-badge-red',
      MEDIUM: 'ds-badge ds-badge-yellow',
      LOW: 'ds-badge ds-badge-teal',
    };
    return 'ds-badge ' + (map[priority.toUpperCase()] ?? 'ds-badge ds-badge-neutral').replace('ds-badge ', '');
  }

  catLabel(cat: string | null): string {
    if (!cat) return this.i18n.translate('requests.categories.general');
    return this.i18n.translate('requests.categories.' + cat.toLowerCase()) || cat;
  }

  // ── Private SVG helpers ──────────────────────────────────────────────────
  private _toSvgPoints(values: number[]): string {
    if (!values.length) return '0,155 600,155';
    const max = Math.max(...values, 1);
    const n = values.length;
    const step = n > 1 ? 600 / (n - 1) : 0;
    return values.map((v, i) => `${Math.round(i * step)},${Math.round(155 - (v / max) * 130)}`).join(' ');
  }

  private _toArea(points: string): string {
    if (!points || points === '0,155 600,155') return '';
    const pts = points.split(' ');
    const x0 = pts[0].split(',')[0];
    const xN = pts[pts.length - 1].split(',')[0];
    return `M${points.replace(/ /g, ' L')} L${xN},160 L${x0},160 Z`;
  }
}
