import { inject } from '@angular/core';
import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { ToastService } from '../services/toast.service';
import { TranslationService } from '../services/translation.service';
import { AuthService } from '../auth/auth.service';

/** URLs de polling/background que no deben mostrar toast al fallar. */
const SILENT_URL_PATTERNS = [
  '/incidents/pending',
  '/auth/fcm-token',
];

/**
 * Centrally handles HTTP errors returned by the API.
 * Shows a toast message and handles specific codes like 401.
 */
export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const toastSvc = inject(ToastService);
  const translationSvc = inject(TranslationService);
  const authSvc = inject(AuthService);
  const router = inject(Router);

  const isSilent = SILENT_URL_PATTERNS.some(p => req.url.includes(p));

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      // Peticiones de background: solo redirigir en 401, sin toast
      if (isSilent) {
        if (error.status === 401) {
          authSvc.logout();
          router.navigateByUrl('/login');
        }
        return throwError(() => error);
      }

      let errorMessage = '';

      if (error.status === 401) {
        // Unauthenticated - Redirect to login
        errorMessage = translationSvc.translate('errors.401');
        authSvc.logout();
        router.navigateByUrl('/login');
      } 
      else if (error.status === 403) {
        errorMessage = translationSvc.translate('errors.403');
      } 
      else if (error.status === 404) {
        errorMessage = translationSvc.translate('errors.404');
      } 
      else if (error.status === 409) {
        // Conflict (often business logic errors like "email already exists")
        errorMessage = error.error?.detail || translationSvc.translate('errors.409');
      } 
      else if (error.status === 500) {
        errorMessage = translationSvc.translate('errors.500');
      } 
      else {
        // Fallback for other errors
        errorMessage = error.error?.detail || translationSvc.translate('errors.generic');
      }

      // Show the error toast if it's not a handled case that doesn't need a toast
      // (though usually we want to notify the user of almost everything)
      toastSvc.error(translationSvc.translate('common.error'), errorMessage);

      return throwError(() => error);
    })
  );
};
