import { Routes } from '@angular/router';
import { MainLayoutComponent } from '@layout/main-layout/main-layout.component';
import { authGuard } from '@core/auth/auth.guard';

export const NOTIFICATIONS_ROUTES: Routes = [
  {
    path: 'app',
    component: MainLayoutComponent,
    children: [
      {
        path: 'notifications',
        loadComponent: () =>
          import('./pages/notifications-page/notifications-page.component').then(
            (m) => m.NotificationsPageComponent,
          ),
        // Disponible para cualquier usuario autenticado
        canActivate: [authGuard],
      },
    ],
  },
];
