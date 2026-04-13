import { Routes } from '@angular/router';
import { MainLayoutComponent } from '@layout/main-layout/main-layout.component';
import { SECURITY_ROUTES } from '@features/security/security.routes';
import { MODULE_USERS_ROUTES } from '@features/module_users/module-users.routes';
import { DASHBOARD_ROUTES } from '@features/dashboard/dashboard.routes';
import { authGuard } from '@core/auth/auth.guard';

export const routes: Routes = [
  // Redirection when visiting root URL
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  
  // Register feature routes
  ...SECURITY_ROUTES,
  ...MODULE_USERS_ROUTES,
  ...DASHBOARD_ROUTES,

  // Fallback map
  { path: '**', redirectTo: '/login' }
];
