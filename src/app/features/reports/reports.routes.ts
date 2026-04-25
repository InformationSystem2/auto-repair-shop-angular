import { Routes } from '@angular/router';
import { MainLayoutComponent } from '@layout/main-layout/main-layout.component';
import { roleGuard } from '@core/auth/auth.guard';
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
        canActivate: [roleGuard('admin', 'workshop_owner')],
      },
      {
        path: 'reports/builder',
        component: ReportBuilderComponent,
        canActivate: [roleGuard('admin', 'workshop_owner')],
      },
      {
        path: 'reports/builder/:templateId',
        component: ReportBuilderComponent,
        canActivate: [roleGuard('admin', 'workshop_owner')],
      },
    ],
  },
];
