import { Routes } from '@angular/router';
import { MainLayoutComponent } from '@layout/main-layout/main-layout.component';
import { roleGuard } from '@core/auth/auth.guard';

export const AUDIT_ROUTES: Routes = [
  {
    path: 'app',
    component: MainLayoutComponent,
    children: [
      {
        path: 'audit',
        loadComponent: () =>
          import('./pages/audit-page/audit-page.component').then(m => m.AuditPageComponent),
        canActivate: [roleGuard('admin')],
      },
    ],
  },
];
