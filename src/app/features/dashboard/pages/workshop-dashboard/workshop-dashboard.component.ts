import { Component, inject } from '@angular/core';
import { AuthService } from '@core/auth/auth.service';
import { StatCardComponent } from '@dashboard/components/stat-card/stat-card.component';

@Component({
  selector: 'app-workshop-dashboard',
  standalone: true,
  imports: [StatCardComponent],
  templateUrl: './workshop-dashboard.component.html',
})
export class WorkshopDashboardComponent {
  readonly auth = inject(AuthService);
}
