import { Component, computed, inject, input, output, signal, effect } from '@angular/core';
import { DatePipe } from '@angular/common';
import { RoleService } from '@users/services/role.service';
import { RoleDetail } from '@users/models/role.model';
import { BadgeComponent } from '@ui/badge/badge.component';
import { ButtonComponent } from '@ui/button/button.component';
import { groupPermissions } from '../../../../utils/permission-groups';

@Component({
  selector: 'app-role-detail-modal',
  standalone: true,
  imports: [DatePipe, BadgeComponent, ButtonComponent],
  templateUrl: './role-detail-modal.component.html',
})
export class RoleDetailModalComponent {
  private readonly roleService = inject(RoleService);
  
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
