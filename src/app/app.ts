import { Component, inject, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { UIService } from '@core/services/ui.service';
import { AuthService } from '@core/auth/auth.service';
import { ToasterComponent } from '@ui/toaster/toaster.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, ToasterComponent],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  private readonly _uiService = inject(UIService);
  private readonly _authService = inject(AuthService);
  protected readonly title = signal('auto-repair-shop-angular');

  constructor() {
    // Si el usuario ya está autenticado al cargar, registrar token push
    if (this._authService.isAuthenticated()) {
      this._authService.registerPushToken();
    }
  }
}
