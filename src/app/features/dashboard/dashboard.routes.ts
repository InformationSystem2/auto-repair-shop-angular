import { Routes } from '@angular/router';
import { AdminDashboardComponent } from './pages/admin-dashboard/admin-dashboard.component';
import { WorkshopDashboardComponent } from './pages/workshop-dashboard/workshop-dashboard.component';
import { TechnicianDashboardComponent } from './pages/technician-dashboard/technician-dashboard.component';
import { roleGuard } from '../../core/auth/auth.guard';
import { MainLayoutComponent } from '@layout/main-layout/main-layout.component';

export const DASHBOARD_ROUTES: Routes = [
  {
    path: 'app',
    component: MainLayoutComponent,
    children: [
      {
        path: 'admin/dashboard',
        component: AdminDashboardComponent,
        canActivate: [roleGuard('admin')]
      },
      {
        path: 'workshop/dashboard',
        component: WorkshopDashboardComponent,
        canActivate: [roleGuard('workshop_owner')]
      },
      {
        path: 'technician/dashboard',
        component: TechnicianDashboardComponent,
        canActivate: [roleGuard('technician')]
      }
    ]
  }
];
