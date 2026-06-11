import { ChangeDetectionStrategy, Component, inject, input, output } from '@angular/core';
import { AuditLog } from '../../../models/audit.models';
import { TranslationService } from '@core/services/translation.service';

@Component({
  selector: 'app-audit-detail-modal',
  imports: [],
  templateUrl: './audit-detail-modal.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AuditDetailModalComponent {

  readonly i18n = inject(TranslationService);
  readonly log = input.required<AuditLog>();
  readonly close = output<void>();

  formatDate(dateStr: string, type: 'date' | 'time'): string {
    const d = new Date(dateStr);
    if (type === 'date') return d.toLocaleDateString('es-BO');
    return d.toLocaleTimeString('es-BO');
  }

  formatJson(obj: Record<string, unknown> | undefined | string): string {
    if (!obj) return 'null';
    if (typeof obj === 'string') {
      try {
        const parsed = JSON.parse(obj);
        return JSON.stringify(parsed, null, 2);
      } catch {
        return obj;
      }
    }
    return JSON.stringify(obj, null, 2);
  }

  onClose() {
    this.close.emit();
  }

  onBackdropClick(event: MouseEvent) {
    if ((event.target as HTMLElement).classList.contains('modal-backdrop')) {
      this.onClose();
    }
  }
}
