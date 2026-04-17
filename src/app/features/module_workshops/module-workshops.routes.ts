import { Routes } from '@angular/router';
import { RegisterWorkshopPageComponent } from './pages/register-workshop-page/register-workshop-page.component';
import { WorkshopsPageComponent } from './pages/workshops-page/workshops-page.component';
import { WorkshopTechniciansPageComponent } from './pages/workshop-technicians-page/workshop-technicians-page.component';
import { roleGuard } from '@core/auth/auth.guard';
import { MainLayoutComponent } from '@layout/main-layout/main-layout.component';

export const MODULE_WORKSHOPS_ROUTES: Routes = [
  // Public Route
  { 
    path: 'register-workshop', 
    component: RegisterWorkshopPageComponent 
  },
  
  // Protected Routes
  {
    path: 'app',
    component: MainLayoutComponent,
    children: [
      {
        path: 'workshops',
        component: WorkshopsPageComponent,
        canActivate: [roleGuard('admin')]
      },
      {
        path: 'workshops/:id',
        loadComponent: () => import('./pages/workshop-management-page/workshop-management-page.component').then(m => m.WorkshopManagementPageComponent),
        canActivate: [roleGuard('admin')]
      },
      {
        path: 'specialties',
        loadComponent: () => import('./pages/specialties-page/specialties-page.component').then(m => m.SpecialtiesPageComponent),
        canActivate: [roleGuard('admin')]
      },
      {
        path: 'workshop-profile',
        loadComponent: () => import('./pages/workshop-management-page/workshop-management-page.component').then(m => m.WorkshopManagementPageComponent),
        canActivate: [roleGuard('workshop_owner')]
      },
      {
        path: 'technicians',
        component: WorkshopTechniciansPageComponent,
        canActivate: [roleGuard('workshop_owner')]
      }
    ]
  }
];
