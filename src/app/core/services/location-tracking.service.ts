import { Injectable, inject } from '@angular/core';
import { Subject } from 'rxjs';
import { environment } from '@env/environment';
import { AuthService } from '@core/auth/auth.service';

export interface LocationUpdate {
  lat: number;
  lng: number;
  technicianName: string;
  timestamp: string;
}

@Injectable({ providedIn: 'root' })
export class LocationTrackingService {
  private readonly auth = inject(AuthService);
  private ws: WebSocket | null = null;
  private watchId: number | null = null;

  readonly locationUpdates$ = new Subject<LocationUpdate>();
  readonly connectionStatus$ = new Subject<'connected' | 'disconnected' | 'error'>();

  private get wsBaseUrl(): string {
    return environment.apiUrl
      .replace('http://', 'ws://')
      .replace('https://', 'wss://')
      .replace('/api', '');
  }

  connectAsViewer(incidentId: string): void {
    const token = this.auth.getToken();
    if (!token) return;
    this._connect(`${this.wsBaseUrl}/ws/location/${incidentId}?token=${token}&role=viewer`);
  }

  connectAsTechnician(incidentId: string): void {
    const token = this.auth.getToken();
    if (!token) return;
    this._connect(`${this.wsBaseUrl}/ws/location/${incidentId}?token=${token}&role=technician`);
    this._startSendingLocation();
  }

  disconnect(): void {
    if (this.watchId !== null) {
      navigator.geolocation.clearWatch(this.watchId);
      this.watchId = null;
    }
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
    this.connectionStatus$.next('disconnected');
  }

  private _connect(url: string): void {
    this.disconnect();
    try {
      this.ws = new WebSocket(url);
    } catch {
      this.connectionStatus$.next('error');
      return;
    }

    this.ws.onmessage = (ev) => {
      try {
        const data = JSON.parse(ev.data as string);
        if (data.type === 'location') {
          this.locationUpdates$.next({
            lat: data.lat,
            lng: data.lng,
            technicianName: data.technician_name,
            timestamp: data.timestamp,
          });
        } else if (data.type === 'connected') {
          this.connectionStatus$.next('connected');
        }
      } catch { /* ignore malformed */ }
    };

    this.ws.onerror = () => this.connectionStatus$.next('error');
    this.ws.onclose = () => this.connectionStatus$.next('disconnected');
  }

  private _startSendingLocation(): void {
    if (!navigator.geolocation) return;
    this.watchId = navigator.geolocation.watchPosition(
      (pos) => {
        if (this.ws?.readyState === WebSocket.OPEN) {
          this.ws.send(JSON.stringify({
            type: 'update_location',
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
          }));
        }
      },
      null,
      { enableHighAccuracy: true, maximumAge: 5000, timeout: 15000 },
    );
  }
}
