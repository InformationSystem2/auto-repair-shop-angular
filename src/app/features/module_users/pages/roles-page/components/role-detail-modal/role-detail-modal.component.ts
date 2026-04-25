import { Component, computed, inject, input, output, signal, effect, ChangeDetectionStrategy } from '@angular/core';
import { DatePipe } from '@angular/common';
import { RoleService } from '@users/services/role.service';
import { RoleDetail } from '@users/models/role.model';
import { groupPermissions } from '../../../../utils/permission-groups';
import { TranslationService } from '@core/services/translation.service';
@Component({
  selector: 'app-role-detail-modal',
  standalone: true,
  imports: [DatePipe],
  templateUrl: './role-detail-modal.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RoleDetailModalComponent {
  private readonly roleService = inject(RoleService);
  readonly i18n = inject(TranslationService);

  roleId = input<number | null>(null);
  close = output<void>();

  role = signal<RoleDetail | null>(null);
  loading = signal(false);
  readonly permissionGroups = computed(() => groupPermissions(this.role()?.permissions ?? []));

  constructor() {
    effect(() => {
      const id = this.roleId();
      if (id !== null) {
        this.fetchDetails(id);
      } else {
        this.role.set(null);
      }
    });
  }

  private fetchDetails(id: number): void {
    this.loading.set(true);
    this.roleService.getById(id).subscribe({
      next: (val) => {
        this.role.set(val);
        this.loading.set(false);
      },
      error: () => this.loading.set(false)
    });
  }
}
