import { Routes } from '@angular/router';
import { MainLayoutComponent } from '@layout/main-layout/main-layout.component';
import { permissionGuard } from '@core/auth/auth.guard';
import { ReportsListComponent } from './pages/reports-list/reports-list.component';
import { ReportBuilderComponent } from './pages/report-builder/report-builder.component';

export const REPORTS_ROUTES: Routes = [
  {
    path: 'app',
    component: MainLayoutComponent,
    children: [
      {
        path: 'reports',
        component: ReportsListComponent,
        canActivate: [permissionGuard('reports:read', 'reports:write', 'reports:update', 'reports:delete', 'reports:create')],
      },
      {
        path: 'reports/builder',
        component: ReportBuilderComponent,
        canActivate: [permissionGuard('reports:create', 'reports:write', 'reports:update')],
      },
      {
        path: 'reports/builder/:templateId',
        component: ReportBuilderComponent,
        canActivate: [permissionGuard('reports:create', 'reports:write', 'reports:update')],
      },
    ],
  },
];
