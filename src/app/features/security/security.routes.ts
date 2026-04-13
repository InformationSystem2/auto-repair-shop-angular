import { Routes } from '@angular/router';
import { LoginPageComponent } from './pages/login-page/login-page.component';
import { ProfilePageComponent } from './pages/profile-page/profile-page.component';
import { authGuard } from '@core/auth/auth.guard';
import { MainLayoutComponent } from '@layout/main-layout/main-layout.component';

export const SECURITY_ROUTES: Routes = [
  { path: 'login', component: LoginPageComponent },
  {
    path: 'app',
    component: MainLayoutComponent,
    canActivate: [authGuard],
    children: [
      { path: 'profile', component: ProfilePageComponent }
    ]
  }
];
