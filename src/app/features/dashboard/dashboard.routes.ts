import { Routes } from '@angular/router';
import { AdminDashboardComponent } from './pages/admin-dashboard/admin-dashboard.component';
import { WorkshopDashboardComponent } from './pages/workshop-dashboard/workshop-dashboard.component';
import { permissionGuard } from '../../core/auth/auth.guard';
import { MainLayoutComponent } from '@layout/main-layout/main-layout.component';

export const DASHBOARD_ROUTES: Routes = [
  {
    path: 'app',
    component: MainLayoutComponent,
    children: [
      {
        path: 'admin/dashboard',
        component: AdminDashboardComponent,
        canActivate: [permissionGuard('roles:read')]
      },
      {
        path: 'workshop/dashboard',
        component: WorkshopDashboardComponent,
        canActivate: [permissionGuard('workshops:update')]
      }
    ]
  }
];
