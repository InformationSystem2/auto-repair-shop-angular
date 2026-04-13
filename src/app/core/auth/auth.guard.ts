import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from './auth.service';

/**
 * Base guard: user must be authenticated.
 */
export const authGuard: CanActivateFn = () => {
  const auth = inject(AuthService);
  const router = inject(Router);

  if (auth.isAuthenticated()) return true;

  return router.createUrlTree(['/login']);
};

/**
 * Factory guard: user must have at least one of the specified roles.
 * Usage: canActivate: [roleGuard('admin', 'workshop_owner')]
 */
export const roleGuard =
  (...requiredRoles: string[]): CanActivateFn =>
  () => {
    const auth = inject(AuthService);
    const router = inject(Router);

    if (!auth.isAuthenticated()) return router.createUrlTree(['/login']);

    if (auth.hasRole(...requiredRoles)) return true;

    // Redirect to their own dashboard if authenticated but unauthorized
    const firstRole = auth.roles()[0]?.name;
    if (firstRole === 'admin') return router.createUrlTree(['/app/admin/dashboard']);
    if (firstRole === 'workshop_owner') return router.createUrlTree(['/app/workshop/dashboard']);
    if (firstRole === 'technician') return router.createUrlTree(['/app/technician/dashboard']);
    return router.createUrlTree(['/login']);
  };
