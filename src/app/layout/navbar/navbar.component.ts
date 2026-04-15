import { Component, inject, ChangeDetectionStrategy } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '@core/auth/auth.service';
import { UIService } from '@core/services/ui.service';
import { TranslationService } from '@core/services/translation.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [],
  templateUrl: './navbar.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NavbarComponent {
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);
  readonly uiService = inject(UIService);
  readonly i18n = inject(TranslationService);

  logout(): void {
    this.auth.logout();
  }

  toggleLang(): void {
    const next = this.i18n.currentLang() === 'es' ? 'en' : 'es';
    this.i18n.setLang(next);
  }
}
