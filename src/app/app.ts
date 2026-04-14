import { Component, inject, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { UIService } from '@core/services/ui.service';
import { ToasterComponent } from '@ui/toaster/toaster.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, ToasterComponent],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  private readonly _uiService = inject(UIService);
  protected readonly title = signal('auto-repair-shop-angular');
}
