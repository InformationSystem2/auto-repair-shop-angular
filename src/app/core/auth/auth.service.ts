import { inject, Injectable, signal, computed } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { tap } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { environment } from '@env/environment';
import { AuthSession, LoginResponse, SendCodeResponse } from '@security/models/auth.model';
import { User } from '@users/models/user.model';
import { PushNotificationService } from '@core/services/push-notification.service';

const TOKEN_KEY = 'ars_token';
const SESSION_KEY = 'ars_session';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly router = inject(Router);
  private readonly push = inject(PushNotificationService);

  // ── Signals ──────────────────────────────────────────────────────────────
  private readonly _session = signal<AuthSession | null>(this._loadSession());

  readonly session = this._session.asReadonly();
  readonly isAuthenticated = computed(() => this._session() !== null);
  readonly currentUserName = computed(() => this._session()?.userName ?? null);
  readonly roles = computed(() => this._session()?.roles ?? []);
  readonly permissions = computed(() => this._session()?.permissions ?? []);
  readonly isAdmin = computed(() =>
    this.roles().some((r) => r.name === 'admin')
  );
  readonly isWorkshopOwner = computed(() =>
    this.roles().some((r) => r.name === 'workshop_owner')
  );

  // Helper helper to decode JWT payload locally
  private _decodeTokenPayload(token: string): any {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        window
          .atob(base64)
          .split('')
          .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      );
      return JSON.parse(jsonPayload);
    } catch {
      return {};
    }
  }

  // ── Login ─────────────────────────────────────────────────────────────────
  login(username: string, password: string): Observable<LoginResponse> {
    // FastAPI OAuth2PasswordRequestForm requires application/x-www-form-urlencoded
    const body = new URLSearchParams();
    body.set('username', username);
    body.set('password', password);

    return this.http
      .post<LoginResponse>(`${environment.apiUrl}/auth/login`, body.toString(), {
        headers: new HttpHeaders({
          'Content-Type': 'application/x-www-form-urlencoded',
        }),
      })
      .pipe(
        tap((res) => {
          const payload = this._decodeTokenPayload(res.access_token);
          const permissions = payload.permissions || [];

          const session: AuthSession = {
            token: res.access_token,
            userId: res.user_id,
            userName: res.user_name,
            roles: res.roles,
            permissions: permissions,
          };
          this._storeSession(session);
          this._session.set(session);
          // Registrar token FCM ahora que tenemos JWT válido
          this.push.requestPermissionAndRegisterToken();
        })
      );
  }

  registerPushToken(): void {
    this.push.requestPermissionAndRegisterToken();
  }

  // ── Me ────────────────────────────────────────────────────────────────────
  me(): Observable<User> {
    return this.http.get<User>(`${environment.apiUrl}/auth/me`);
  }

  // ── Logout ────────────────────────────────────────────────────────────────
  logout(): void {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(SESSION_KEY);
    this._session.set(null);
    this.router.navigate(['/login']);
  }

  getToken(): string | null {
    return this._session()?.token ?? null;
  }

  hasRole(...roleNames: string[]): boolean {
    return this.roles().some((r) => roleNames.includes(r.name));
  }

  hasPermission(...permissionActions: string[]): boolean {
    return this.permissions().some((p) => permissionActions.includes(p));
  }

  forgotPassword(email: string): Observable<SendCodeResponse> {
    return this.http.post<SendCodeResponse>(
      `${environment.apiUrl}/auth/public/forgot-password`,
      { email }
    );
  }

  resetPassword(email: string, code: string, newPassword: string): Observable<{ message: string }> {
    return this.http.post<{ message: string }>(
      `${environment.apiUrl}/auth/public/reset-password`,
      { email, code, new_password: newPassword }
    );
  }

  sendVerificationCode(email: string): Observable<SendCodeResponse> {
    return this.http.post<SendCodeResponse>(
      `${environment.apiUrl}/auth/public/send-verification-code`,
      { email }
    );
  }

  // ── Persistence ───────────────────────────────────────────────────────────
  private _storeSession(session: AuthSession): void {
    localStorage.setItem(TOKEN_KEY, session.token);
    localStorage.setItem(SESSION_KEY, JSON.stringify(session));
  }

  private _loadSession(): AuthSession | null {
    try {
      const raw = localStorage.getItem(SESSION_KEY);
      return raw ? (JSON.parse(raw) as AuthSession) : null;
    } catch {
      return null;
    }
  }
}
