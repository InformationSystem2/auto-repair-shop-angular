import { Component } from '@angular/core';
import { StatCardComponent } from '@dashboard/components/stat-card/stat-card.component';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [StatCardComponent],
  templateUrl: './admin-dashboard.component.html',
})
export class AdminDashboardComponent {}
