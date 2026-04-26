import { Component, input, output, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Workshop } from '../../../../models/workshop.model';
import { TranslationService } from '@core/services/translation.service';
import { BadgeComponent } from '@ui/badge/badge.component';
import { TableRowActionsComponent } from '@ui/table-row-actions/table-row-actions.component';

@Component({
  selector: 'app-workshops-table',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './workshops-table.component.html'
})
export class WorkshopsTableComponent {
  workshops = input.required<Workshop[]>();
  view = output<Workshop>();
  verify = output<Workshop>();
  clearCooldown = output<Workshop>();

  readonly i18n = inject(TranslationService);

  /** True si el taller tiene un rechazo reciente (últimas 6 h = max cooldown posible). */
  isInCooldown(workshop: Workshop): boolean {
    if (!workshop.last_rejection_at) return false;
    const sixHoursAgo = Date.now() - 6 * 60 * 60 * 1000;
    return new Date(workshop.last_rejection_at).getTime() > sixHoursAgo;
  }

  onView(workshop: Workshop): void {
    this.view.emit(workshop);
  }

  onVerify(workshop: Workshop): void {
    this.verify.emit(workshop);
  }

  onClearCooldown(workshop: Workshop): void {
    this.clearCooldown.emit(workshop);
  }
}
