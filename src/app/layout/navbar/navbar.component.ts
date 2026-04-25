import { Component, inject, ChangeDetectionStrategy, computed } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '@core/auth/auth.service';
import { UIService } from '@core/services/ui.service';
import { TranslationService } from '@core/services/translation.service';
import { NotificationService } from '@core/services/notification.service';
import { RoleRef } from '@security/models/auth.model';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './navbar.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NavbarComponent {
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);
  readonly uiService = inject(UIService);
  readonly i18n = inject(TranslationService);
  readonly notificationService = inject(NotificationService);

  readonly canViewRequests = computed(() => {
    const userRoles = this.auth.roles().map((r: RoleRef) => r.name);
    return userRoles.includes('workshop_owner');
  });

  logout(): void {
    this.auth.logout();
  }

  toggleLang(): void {
    const next = this.i18n.currentLang() === 'es' ? 'en' : 'es';
    this.i18n.setLang(next);
  }
}
