import { Component, inject, ChangeDetectionStrategy } from '@angular/core';
import { AuthService } from '@core/auth/auth.service';
import { StatCardComponent } from '@dashboard/components/stat-card/stat-card.component';
import { TranslationService } from '@core/services/translation.service';
@Component({
  selector: 'app-workshop-dashboard',
  imports: [StatCardComponent],
  templateUrl: './workshop-dashboard.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WorkshopDashboardComponent {
  readonly auth = inject(AuthService);
  readonly i18n = inject(TranslationService);
}
