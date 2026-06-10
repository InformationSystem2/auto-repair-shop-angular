import { Injectable, inject, signal, effect } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '@env/environment';
import { AuthService } from '@core/auth/auth.service';
import { AppNotification } from '@core/models/notification.model';
import { Subscription, interval, forkJoin, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

/**
 * Centro de notificaciones in-app de la web.
 * Consume GET/PATCH /api/notifications y expone la lista + conteo de no leídas
 * como signals. Hace polling cada 30s mientras el usuario está autenticado y
 * puede refrescarse manualmente (p. ej. al recibir un push en primer plano).
 */
@Injectable({ providedIn: 'root' })
export class NotificationCenterService {
  private readonly http = inject(HttpClient);
  private readonly auth = inject(AuthService);
  private readonly apiUrl = `${environment.apiUrl}/notifications`;

  private readonly _notifications = signal<AppNotification[]>([]);
  private readonly _unreadCount = signal(0);

  readonly notifications = this._notifications.asReadonly();
  readonly unreadCount = this._unreadCount.asReadonly();

  private pollSub: Subscription | null = null;

  constructor() {
    // Arranca/detiene el polling según el estado de autenticación.
    effect(() => {
      if (this.auth.isAuthenticated()) {
        this.start();
      } else {
        this.stop();
      }
    });
  }

  private start(): void {
    this.refresh();
    if (!this.pollSub) {
      this.pollSub = interval(30000).subscribe(() => this.refresh());
    }
  }

  private stop(): void {
    this.pollSub?.unsubscribe();
    this.pollSub = null;
    this._notifications.set([]);
    this._unreadCount.set(0);
  }

  /** Recarga la lista desde el backend y recalcula el conteo de no leídas. */
  refresh(): void {
    this.http
      .get<AppNotification[]>(this.apiUrl, { params: { limit: 50 } })
      .pipe(catchError(() => of<AppNotification[]>([])))
      .subscribe((list) => {
        this._notifications.set(list);
        this._unreadCount.set(list.filter((n) => !n.is_read).length);
      });
  }

  /** Marca una notificación como leída y refresca. */
  markAsRead(id: string): void {
    this.http
      .patch(`${this.apiUrl}/${id}/read`, {})
      .pipe(catchError(() => of(null)))
      .subscribe(() => this.refresh());
  }

  /** Marca todas las no leídas como leídas (no hay endpoint masivo: una por una). */
  markAllAsRead(): void {
    const unread = this._notifications().filter((n) => !n.is_read);
    if (unread.length === 0) return;

    forkJoin(
      unread.map((n) =>
        this.http.patch(`${this.apiUrl}/${n.id}/read`, {}).pipe(catchError(() => of(null))),
      ),
    ).subscribe(() => this.refresh());
  }
}
