import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { initializeApp, getApps } from 'firebase/app';
import { getMessaging, getToken, onMessage, Messaging } from 'firebase/messaging';
import { environment } from '@env/environment';

@Injectable({ providedIn: 'root' })
export class PushNotificationService {
  private readonly http = inject(HttpClient);
  private messaging: Messaging | null = null;

  async initialize(): Promise<void> {
    if (!('Notification' in window) || !('serviceWorker' in navigator)) return;
    if (!environment.firebase?.appId || environment.firebase.appId === 'FILL_FROM_FIREBASE_CONSOLE') {
      console.warn('[Push] Firebase appId no configurado — push notifications deshabilitadas');
      return;
    }

    try {
      if (!getApps().length) initializeApp(environment.firebase);
      this.messaging = getMessaging();
      this._listenForeground();
    } catch (e) {
      console.warn('[Push] Firebase init failed:', e);
    }
  }

  async requestPermissionAndRegisterToken(): Promise<void> {
    if (!this.messaging) return;
    try {
      const permission = await Notification.requestPermission();
      if (permission !== 'granted') {
        console.warn('[Push] Permiso de notificaciones denegado');
        return;
      }

      const sw = await navigator.serviceWorker.register('/firebase-messaging-sw.js');
      const tokenOptions: { serviceWorkerRegistration: ServiceWorkerRegistration; vapidKey?: string } = {
        serviceWorkerRegistration: sw,
      };
      if (environment.firebase.vapidKey) {
        tokenOptions.vapidKey = environment.firebase.vapidKey;
      }
      const token = await getToken(this.messaging, tokenOptions);

      if (token) {
        await this.http
          .post(`${environment.apiUrl}/auth/fcm-token`, { token })
          .toPromise();
        console.log('[Push] Token FCM registrado en backend ✅');
      }
    } catch (e) {
      console.warn('[Push] Error registrando token push:', e);
    }
  }

  private _listenForeground(): void {
    if (!this.messaging) return;
    onMessage(this.messaging, (payload) => {
      const title = payload.notification?.title ?? 'Auxilio Mecánico';
      const body = payload.notification?.body ?? '';
      if (Notification.permission === 'granted') {
        new Notification(title, { body, icon: '/favicon.ico' });
      }
      console.log('[Push] Mensaje en primer plano:', title, body);
    });
  }
}
