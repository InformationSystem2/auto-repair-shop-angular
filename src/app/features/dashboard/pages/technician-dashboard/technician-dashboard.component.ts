import { Component } from '@angular/core';
import { StatCardComponent } from '@dashboard/components/stat-card/stat-card.component';

@Component({
  selector: 'app-technician-dashboard',
  standalone: true,
  imports: [StatCardComponent],
  templateUrl: './technician-dashboard.component.html',
})
export class TechnicianDashboardComponent {}
