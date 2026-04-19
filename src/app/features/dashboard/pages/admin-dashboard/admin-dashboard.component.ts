import { Component, inject, ChangeDetectionStrategy, computed } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { catchError, of } from 'rxjs';
import { StatCardComponent } from '@dashboard/components/stat-card/stat-card.component';
import { TranslationService } from '@core/services/translation.service';
import { DashboardService } from '@dashboard/services/dashboard.service';

const CAT_COLORS: Record<string, string> = {
  battery:      'var(--ds-blue)',
  tire:         'var(--ds-green)',
  engine:       'var(--ds-yellow)',
  towing:       'var(--ds-peach)',
  ac:           'var(--ds-teal)',
  general:      'var(--ds-mauve)',
  transmission: 'var(--ds-red)',
  locksmith:    'var(--ds-sapphire)',
};
const CAT_LABELS: Record<string, string> = {
  battery: 'Batería', tire: 'Llantas', engine: 'Motor',
  towing: 'Remolque', ac: 'A/C', general: 'General',
  transmission: 'Transmisión', locksmith: 'Cerrajería',
};
const FALLBACK_COLORS = [
  'var(--ds-blue)', 'var(--ds-green)', 'var(--ds-yellow)', 'var(--ds-peach)',
  'var(--ds-teal)', 'var(--ds-mauve)', 'var(--ds-red)', 'var(--ds-sapphire)',
];

@Component({
  selector: 'app-admin-dashboard',
  imports: [StatCardComponent],
  templateUrl: './admin-dashboard.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminDashboardComponent {
  readonly i18n = inject(TranslationService);
  private readonly _svc = inject(DashboardService);

  readonly data = toSignal(
    this._svc.getAdminStats().pipe(catchError(() => of(null))),
    { initialValue: undefined }
  );

  readonly isLoading = computed(() => this.data() === undefined);
  readonly hasError  = computed(() => this.data() === null);

  readonly totalIncidents = computed(() =>
    Object.values(this.data()?.incident_distribution ?? {}).reduce((a, b) => a + b, 0)
  );

  readonly incidentSegments = computed(() => {
    const dist = this.data()?.incident_distribution ?? {};
    const total = Object.values(dist).reduce((a, b) => a + b, 0);
    if (total === 0) return [{ label: 'Sin datos', percent: 100, color: 'var(--ds-surface0)' }];
    return Object.entries(dist).map(([cat, count], idx) => ({
      label: CAT_LABELS[cat] ?? cat,
      percent: Math.round((count / total) * 100),
      color: CAT_COLORS[cat] ?? FALLBACK_COLORS[idx % FALLBACK_COLORS.length],
    }));
  });

  readonly donutGradient = computed(() => {
    const segs = this.incidentSegments();
    let angle = 0;
    return 'conic-gradient(' + segs.map(s => {
      const sweep = (s.percent / 100) * 360;
      const stop = `${s.color} ${angle}deg ${angle + sweep}deg`;
      angle += sweep;
      return stop;
    }).join(', ') + ')';
  });

  readonly growthMonths = computed(() =>
    (this.data()?.monthly_growth ?? []).map(m => {
      const [, mo] = m.month.split('-');
      const names = ['Ene','Feb','Mar','Abr','May','Jun','Jul','Ago','Sep','Oct','Nov','Dic'];
      return names[(parseInt(mo) - 1)] ?? mo;
    })
  );

  readonly workshopGrowthPts = computed(() =>
    this._toSvgPoints((this.data()?.monthly_growth ?? []).map(m => m.workshops))
  );
  readonly clientGrowthPts = computed(() =>
    this._toSvgPoints((this.data()?.monthly_growth ?? []).map(m => m.clients))
  );
  readonly workshopArea = computed(() => this._toArea(this.workshopGrowthPts()));
  readonly clientArea   = computed(() => this._toArea(this.clientGrowthPts()));

  readonly heatmapCells = this._buildHeatmap();

  readonly pendingWorkshops  = computed(() => this.data()?.pending_workshops ?? []);
  readonly cancelledServices = computed(() => this.data()?.cancelled_services ?? []);

  // ── SVG helpers ──────────────────────────────────────────────────────────
  private _toSvgPoints(values: number[]): string {
    if (!values.length) return '0,180 600,180';
    const max = Math.max(...values, 1);
    const n = values.length;
    const step = n > 1 ? 600 / (n - 1) : 0;
    return values.map((v, i) => `${Math.round(i * step)},${Math.round(180 - (v / max) * 155)}`).join(' ');
  }

  private _toArea(points: string): string {
    if (!points || points === '0,180 600,180') return '';
    const pts = points.split(' ');
    const x0 = pts[0].split(',')[0];
    const xN = pts[pts.length - 1].split(',')[0];
    return `M${points.replace(/ /g, ' L')} L${xN},180 L${x0},180 Z`;
  }

  // ── Heatmap ──────────────────────────────────────────────────────────────
  private _buildHeatmap(): { intensity: number }[] {
    const hotspots = [
      { cx: 3, cy: 2 }, { cx: 4, cy: 2 }, { cx: 5, cy: 3 },
      { cx: 7, cy: 5 }, { cx: 8, cy: 5 }, { cx: 7, cy: 6 },
      { cx: 2, cy: 6 }, { cx: 1, cy: 7 },
    ];
    return Array.from({ length: 80 }, (_, idx) => {
      const x = idx % 10;
      const y = Math.floor(idx / 10);
      let intensity = 0.08;
      for (const hs of hotspots) {
        const d = Math.sqrt((x - hs.cx) ** 2 + (y - hs.cy) ** 2);
        intensity = Math.max(intensity, Math.max(0, 1 - d / 2.8));
      }
      return { intensity: Math.min(1, intensity) };
    });
  }

  heatCellBg(intensity: number): string {
    const pct = Math.round(intensity * 100);
    if (intensity > 0.7) return `color-mix(in srgb, var(--ds-red) ${pct}%, transparent)`;
    if (intensity > 0.35) return `color-mix(in srgb, var(--ds-peach) ${pct}%, transparent)`;
    return `color-mix(in srgb, var(--ds-blue) ${Math.max(12, pct)}%, transparent)`;
  }

  // ── Formatters ──────────────────────────────────────────────────────────
  fmt(n: number): string {
    return n.toLocaleString('es-BO', { maximumFractionDigits: 0 });
  }

  fmtDate(iso: string): string {
    try { return new Date(iso).toLocaleDateString('es-BO', { day: '2-digit', month: '2-digit', year: 'numeric' }); }
    catch { return iso; }
  }
}
