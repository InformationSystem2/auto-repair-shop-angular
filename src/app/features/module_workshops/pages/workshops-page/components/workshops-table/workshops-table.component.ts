import { Component, input, output, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Workshop } from '../../../../models/workshop.model';
import { TranslationService } from '@core/services/translation.service';
import { BadgeComponent } from '@ui/badge/badge.component';
import { TableRowActionsComponent } from '@ui/table-row-actions/table-row-actions.component';

@Component({
  selector: 'app-workshops-table',
  standalone: true,
  imports: [CommonModule, BadgeComponent, TableRowActionsComponent],
  templateUrl: './workshops-table.component.html'
})
export class WorkshopsTableComponent {
  workshops = input.required<Workshop[]>();
  view = output<Workshop>();
  verify = output<Workshop>();

  readonly i18n = inject(TranslationService);

  onView(workshop: Workshop): void {
    this.view.emit(workshop);
  }

  onVerify(workshop: Workshop): void {
    this.verify.emit(workshop);
  }
}
