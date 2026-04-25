import { Injectable, signal, inject, effect } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '@env/environment';
import { AuthService } from '@core/auth/auth.service';
import { interval, switchMap, catchError } from 'rxjs';
import { of } from 'rxjs';

interface IncidentResponse {
  id: string;
  status: string;
  created_at: string;
}

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private readonly http = inject(HttpClient);
  private readonly auth = inject(AuthService);
  private readonly _hasNewNotifications = signal(false);
  private pollingSubscription: any;
  private lastCheckTime: number = 0;
  private apiUrl = `${environment.apiUrl}/incidents`;

  readonly hasNewNotifications = this._hasNewNotifications.asReadonly();

  constructor() {
    // Inicia polling cuando el usuario se autentica
    effect(() => {
      if (this.auth.isAuthenticated() && this.auth.isWorkshopOwner()) {
        this.startPolling();
      } else {
        this.stopPolling();
      }
    });
  }

  private startPolling(): void {
    if (this.pollingSubscription) {
      return; // Ya está activo
    }

    this.lastCheckTime = Date.now();
    this.pollingSubscription = interval(30000) // polling cada 30 segundos
      .pipe(
        switchMap(() => this.checkForNewRequests()),
        catchError(() => of([]))
      )
      .subscribe();
  }

  private stopPolling(): void {
    if (this.pollingSubscription) {
      this.pollingSubscription.unsubscribe();
      this._hasNewNotifications.set(false);
    }
  }

  private checkForNewRequests() {
    return this.http.get<IncidentResponse[]>(`${this.apiUrl}/pending`)
      .pipe(
        switchMap((incidents: IncidentResponse[]) => {
          // Verifica si hay incidentes creados después del último check
          const now = Date.now();
          const hasNew = incidents.some(incident => {
            const createdTime = new Date(incident.created_at).getTime();
            return createdTime > this.lastCheckTime;
          });

          this._hasNewNotifications.set(hasNew);
          this.lastCheckTime = now;
          return of(incidents);
        }),
        catchError(() => {
          return of([]);
        })
      );
  }

  setHasNewNotifications(hasNew: boolean): void {
    this._hasNewNotifications.set(hasNew);
  }

  clearNotifications(): void {
    this._hasNewNotifications.set(false);
  }

  markAsRead(): void {
    this._hasNewNotifications.set(false);
  }
}
