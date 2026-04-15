import { Component, inject, ChangeDetectionStrategy } from '@angular/core';
import { StatCardComponent } from '@dashboard/components/stat-card/stat-card.component';
import { TranslationService } from '@core/services/translation.service';
@Component({
  selector: 'app-technician-dashboard',
  imports: [StatCardComponent],
  templateUrl: './technician-dashboard.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TechnicianDashboardComponent {
  readonly i18n = inject(TranslationService);
}
