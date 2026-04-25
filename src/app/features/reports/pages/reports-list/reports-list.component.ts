import {
  Component,
  inject,
  signal,
  ChangeDetectionStrategy,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { catchError, of, switchMap, Subject } from 'rxjs';
import { ReportsService } from '../../services/reports.service';
import { ToastService } from '@core/services/toast.service';
import { TranslationService } from '@core/services/translation.service';
import { ReportTemplate } from '../../models/report.models';

@Component({
  selector: 'app-reports-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './reports-list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ReportsListComponent {
  private readonly reportsService = inject(ReportsService);
  private readonly router = inject(Router);
  private readonly toast = inject(ToastService);
  readonly i18n = inject(TranslationService);

  private readonly refresh$ = new Subject<void>();

  readonly templates = toSignal(
    this.reportsService.getTemplates().pipe(
      catchError(() => {
        this.toast.error(this.i18n.translate('reports.toast.load_error'));
        return of([]);
      })
    ),
    { initialValue: [] as ReportTemplate[] }
  );

  readonly deleting = signal<string | null>(null);


  navigateToNew(): void {
    this.router.navigate(['/app/reports/builder']);
  }

  navigateToEdit(id: string): void {
    this.router.navigate(['/app/reports/builder', id]);
  }

  navigateToRun(template: ReportTemplate): void {
    this.router.navigate(['/app/reports/builder', template.id]);
  }

  duplicateTemplate(template: ReportTemplate): void {
    const copy = {
      name: `${template.name} ${this.i18n.translate('reports.toast.copy_suffix')}`,
      description: template.description,
      report_type: template.report_type,
      selected_fields: [...template.selected_fields],
      filters: [...template.filters],
      sort_field: template.sort_field,
      sort_order: template.sort_order,
      date_from: template.date_from,
      date_to: template.date_to,
      is_shared: false,
    };
    this.reportsService.saveTemplate(copy).subscribe({
      next: () => {
        this.toast.success(this.i18n.translate('reports.toast.duplicate_success'));
        this.router.navigateByUrl('/', { skipLocationChange: true }).then(() =>
          this.router.navigate(['/app/reports'])
        );
      },
      error: () => this.toast.error(this.i18n.translate('reports.toast.duplicate_error')),
    });
  }

  deleteTemplate(id: string): void {
    if (!confirm(this.i18n.translate('reports.toast.delete_confirm'))) return;
    this.deleting.set(id);
    this.reportsService.deleteTemplate(id).subscribe({
      next: () => {
        this.toast.success(this.i18n.translate('reports.toast.delete_success'));
        this.deleting.set(null);
        this.router.navigateByUrl('/', { skipLocationChange: true }).then(() =>
          this.router.navigate(['/app/reports'])
        );
      },
      error: () => {
        this.toast.error(this.i18n.translate('reports.toast.delete_error'));
        this.deleting.set(null);
      },
    });
  }

  formatDate(iso: string): string {
    try {
      return new Date(iso).toLocaleDateString('es-BO', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      });
    } catch {
      return iso;
    }
  }

  typeLabel(type: string): string {
    return this.i18n.translate(`reports.types.${type}`);
  }
}
