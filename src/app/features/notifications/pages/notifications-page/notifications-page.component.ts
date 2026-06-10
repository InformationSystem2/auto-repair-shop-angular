import { Component, inject, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { DatePipe } from '@angular/common';
import { NotificationCenterService } from '@core/services/notification-center.service';
import { AppNotification } from '@core/models/notification.model';

@Component({
  selector: 'app-notifications-page',
  standalone: true,
  imports: [DatePipe],
  templateUrl: './notifications-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NotificationsPageComponent implements OnInit {
  readonly center = inject(NotificationCenterService);

  ngOnInit(): void {
    this.center.refresh();
  }

  onItemClick(n: AppNotification): void {
    if (!n.is_read) this.center.markAsRead(n.id);
  }

  markAll(): void {
    this.center.markAllAsRead();
  }

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
