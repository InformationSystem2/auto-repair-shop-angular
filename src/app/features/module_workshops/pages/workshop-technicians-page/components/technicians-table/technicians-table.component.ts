import { Component, input, output, inject, ChangeDetectionStrategy } from '@angular/core';
import { Technician } from '../../../../models/technician.model';
import { BadgeComponent } from '@ui/badge/badge.component';
import { TableRowActionsComponent } from '@ui/table-row-actions/table-row-actions.component';
import { TranslationService } from '@core/services/translation.service';

@Component({
  selector: 'app-technicians-table',
  standalone: true,
  imports: [BadgeComponent, TableRowActionsComponent],
  templateUrl: './technicians-table.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TechniciansTableComponent {
  readonly i18n = inject(TranslationService);

  technicians = input<Technician[]>([]);
  view = output<Technician>();
  edit = output<Technician>();
  delete = output<Technician>();

  onView(tech: Technician): void {
    this.view.emit(tech);
  }

  onEdit(tech: Technician): void {
    this.edit.emit(tech);
  }

  onDelete(tech: Technician): void {
    this.delete.emit(tech);
  }
}
