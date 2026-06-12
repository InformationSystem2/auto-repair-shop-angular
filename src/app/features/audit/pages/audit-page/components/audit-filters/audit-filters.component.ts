import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuditState } from '../../../../services/audit-state.service';
import { AuditFilters } from '../../../../models/audit.models';
import { AuditService } from '../../../../services/audit.service';
import { TranslationService } from '@core/services/translation.service';
import { ToastService } from '@core/services/toast.service';

@Component({
  selector: 'app-audit-filters',
  imports: [FormsModule],
  templateUrl: './audit-filters.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AuditFiltersComponent {

  readonly auditState = inject(AuditState);
  readonly i18n = inject(TranslationService);
  private auditService = inject(AuditService);
  private toast = inject(ToastService);

  readonly actionTypes = ['CREATE', 'READ', 'UPDATE', 'DELETE', 'LOGIN', 'LOGOUT'];
  exporting = signal(false);

  onFilterChange(changes: Partial<AuditFilters>) {
    this.auditState.updateFilters({ ...changes, page: 0 });
  }

  onClear() {
    this.auditState.resetFilters();
  }

  onExportCsv() {
    this.exporting.set(true);
    this.auditService.exportCsv(this.auditState.filters()).subscribe({
      next: (blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `audit-logs-${new Date().toISOString().slice(0, 10)}.csv`;
        a.click();
        window.URL.revokeObjectURL(url);
        this.exporting.set(false);
        this.toast.success('CSV exportado correctamente');
      },
      error: (err) => {
        this.exporting.set(false);
        this.toast.error(err?.error?.detail || 'Error al exportar CSV');
      }
    });
  }
}
