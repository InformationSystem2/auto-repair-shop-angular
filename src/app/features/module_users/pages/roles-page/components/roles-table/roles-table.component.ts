import { Component, input, output, inject, ChangeDetectionStrategy } from '@angular/core';
//import { DatePipe } from '@angular/common';
import { RoleDetail } from '@users/models/role.model';
import { BadgeComponent } from '@ui/badge/badge.component';
import { TableRowActionsComponent } from '@ui/table-row-actions/table-row-actions.component';
import { TranslationService } from '@core/services/translation.service';
@Component({
  selector: 'app-roles-table',
  imports: [
    //DatePipe,
    BadgeComponent,
    TableRowActionsComponent
  ],
  templateUrl: './roles-table.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RolesTableComponent {
  readonly i18n = inject(TranslationService);
  roles = input<RoleDetail[]>([]);
  edit = output<RoleDetail>();
  delete = output<RoleDetail>();
  view = output<RoleDetail>();

  onEdit(role: RoleDetail): void {
    this.edit.emit(role);
  }

  onDelete(role: RoleDetail): void {
    this.delete.emit(role);
  }

  onView(role: RoleDetail): void {
    this.view.emit(role);
  }
}
