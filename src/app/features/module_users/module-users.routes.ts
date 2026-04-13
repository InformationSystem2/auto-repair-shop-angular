import { Routes } from '@angular/router';
import { UsersPageComponent } from './pages/users-page/users-page.component';
import { RolesPageComponent } from './pages/roles-page/roles-page.component';
import { roleGuard } from '@core/auth/auth.guard';
import { MainLayoutComponent } from '@layout/main-layout/main-layout.component';

export const MODULE_USERS_ROUTES: Routes = [
  {
    path: 'app',
    component: MainLayoutComponent,
    children: [
      { 
        path: 'users',
        component: UsersPageComponent,
        canActivate: [roleGuard('admin', 'workshop_owner')]
      },
      {
        path: 'roles',
        component: RolesPageComponent,
        canActivate: [roleGuard('admin')]
      }
    ]
  }
];
