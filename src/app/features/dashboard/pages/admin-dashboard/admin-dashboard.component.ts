import { Component, inject } from '@angular/core';
import { StatCardComponent } from '@dashboard/components/stat-card/stat-card.component';
import { TranslationService } from '@core/services/translation.service';
import { ChangeDetectionStrategy } from '@angular/core';
@Component({
  selector: 'app-admin-dashboard',
  imports: [StatCardComponent],
  templateUrl: './admin-dashboard.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminDashboardComponent {
  readonly i18n = inject(TranslationService);
}
