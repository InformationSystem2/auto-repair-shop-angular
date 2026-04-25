import { Component, input, output, signal, inject, ChangeDetectionStrategy } from '@angular/core';
import { RoleDetail } from '@users/models/role.model';
import { TranslationService } from '@core/services/translation.service';

@Component({
  selector: 'app-users-toolbar',
  standalone: true,
  imports: [],
  templateUrl: './users-toolbar.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UsersToolbarComponent {
  readonly i18n = inject(TranslationService);
  roles = input<RoleDetail[]>([]);

  filterChange = output<{ search: string; roleId: number | null }>();

  readonly currentSearch = signal('');
  readonly currentRoleId = signal<number | null>(null);

  updateFilter(): void {
    this.filterChange.emit({
      search: this.currentSearch(),
      roleId: this.currentRoleId(),
    });
  }

  onSearch(value: string): void {
    this.currentSearch.set(value);
    this.updateFilter();
  }

  onRoleChange(id: string): void {
    const roleId = id === 'all' ? null : Number(id);
    this.currentRoleId.set(roleId);
    this.updateFilter();
  }
}
