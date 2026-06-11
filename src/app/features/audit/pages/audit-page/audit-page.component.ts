import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { AuditState } from '../../services/audit-state.service';
import { AuditFiltersComponent } from './components/audit-filters/audit-filters.component';
import { AuditTableComponent } from './components/audit-table/audit-table.component';
import { AuditDetailModalComponent } from './audit-detail-modal/audit-detail-modal.component';
import { TranslationService } from '@core/services/translation.service';

@Component({
  selector: 'app-audit-page',
  imports: [
    AuditFiltersComponent,
    AuditTableComponent,
    AuditDetailModalComponent,
  ],
  templateUrl: './audit-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AuditPageComponent implements OnInit {

  readonly auditState = inject(AuditState);
  readonly i18n = inject(TranslationService);

  ngOnInit() {
    this.auditState.refresh();
  }
}
