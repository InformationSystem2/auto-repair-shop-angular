import { Component, input, output } from '@angular/core';
import { DatePipe } from '@angular/common';
import { User } from '@users/models/user.model';
import { BadgeComponent } from '@ui/badge/badge.component';
import { AvatarComponent, AvatarFallbackComponent } from '@ui/avatar/avatar.component';
import { TableRowActionsComponent } from '@ui/table-row-actions/table-row-actions.component';

@Component({
  selector: 'app-users-table',
  standalone: true,
  imports: [
    DatePipe,
    BadgeComponent,
    AvatarComponent,
    AvatarFallbackComponent,
    TableRowActionsComponent
  ],
  templateUrl: './users-table.component.html',
})
export class UsersTableComponent {
  users = input<User[]>([]);
  edit = output<User>();
  delete = output<User>();
  view = output<User>();

  onEdit(user: User): void {
    this.edit.emit(user);
  }

  onDelete(user: User): void {
    this.delete.emit(user);
  }

  onView(user: User): void {
    this.view.emit(user);
  }
}
