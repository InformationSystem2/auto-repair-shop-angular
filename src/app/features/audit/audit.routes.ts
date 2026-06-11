import { Routes } from '@angular/router';
import { roleGuard } from '@core/auth/auth.guard';

export const AUDIT_ROUTES: Routes = [
  {
    path: 'app/audit',
    loadComponent: () =>
      import('./pages/audit-page/audit-page.component').then(m => m.AuditPageComponent),
    canActivate: [roleGuard('admin')],
  },
];
