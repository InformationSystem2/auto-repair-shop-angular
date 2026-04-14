import { Injectable, signal } from '@angular/core';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface Toast {
  id: string;
  title: string;
  message?: string;
  type: ToastType;
  duration: number;
}

@Injectable({ providedIn: 'root' })
export class ToastService {
  readonly toasts = signal<Toast[]>([]);

  show(title: string, type: ToastType = 'success', message?: string, duration = 5000) {
    const id = Math.random().toString(36).substring(2, 9);
    this.toasts.update((t) => [...t, { id, title, message, type, duration }]);
  }

  success(title: string, message?: string) {
    this.show(title, 'success', message);
  }

  error(title: string, message?: string) {
    this.show(title, 'error', message, 6000);
  }

  warning(title: string, message?: string) {
    this.show(title, 'warning', message);
  }

  info(title: string, message?: string) {
    this.show(title, 'info', message);
  }

  remove(id: string) {
    this.toasts.update((t) => t.filter((toast) => toast.id !== id));
  }
}
