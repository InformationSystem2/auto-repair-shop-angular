import { Component, inject, signal, computed, ChangeDetectionStrategy } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DatePipe } from '@angular/common';
import { NotificationCenterService } from '@core/services/notification-center.service';
import { AppNotification } from '@core/models/notification.model';

@Component({
  selector: 'app-notifications-bell',
  standalone: true,
  imports: [RouterLink, DatePipe],
  templateUrl: './notifications-bell.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NotificationsBellComponent {
  readonly center = inject(NotificationCenterService);
  readonly isOpen = signal(false);

  /** Solo las más recientes para el dropdown; el historial completo va en la página. */
  readonly recent = computed(() => this.center.notifications().slice(0, 6));

  toggle(): void {
    const next = !this.isOpen();
    this.isOpen.set(next);
    if (next) this.center.refresh();
  }

  close(): void {
    this.isOpen.set(false);
  }

  onItemClick(n: AppNotification): void {
    if (!n.is_read) this.center.markAsRead(n.id);
  }

  markAll(event: Event): void {
    event.stopPropagation();
    this.center.markAllAsRead();
  }

  /** Emoji según el tipo (los tipos del backend vienen en minúscula). */
  typeIcon(type: string): string {
    switch (type) {
      case 'service_completed':
      case 'payment':
        return '✅';
      case 'accepted':
        return '🔧';
      case 'rejected':
        return '🔄';
      case 'new_request':
        return '🆘';
      case 'system':
        return '⚠️';
      default:
        return '🔔';
    }
  }
}
