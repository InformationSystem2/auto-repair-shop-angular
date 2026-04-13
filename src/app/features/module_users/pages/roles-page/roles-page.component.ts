import { Component, inject, OnInit, signal } from '@angular/core';
import { RoleService } from '@users/services/role.service';
import { PermissionService } from '@users/services/permission.service';
import { CommonModule } from '@angular/common';
import { RoleDetail, RoleCreate, RoleUpdate } from '@users/models/role.model';
import { Permission } from '@users/models/permission.model';
import { RolesTableComponent } from './components/roles-table/roles-table.component';
import { RoleFormComponent } from './components/role-form/role-form.component';
import { RoleDetailModalComponent } from './components/role-detail-modal/role-detail-modal.component';
import { ButtonComponent } from '@ui/button/button.component';
import { CardComponent } from '@ui/card/card.component';

@Component({
  selector: 'app-roles-page',
  standalone: true,
  imports: [
    CommonModule, 
    RolesTableComponent, 
    RoleFormComponent, 
    RoleDetailModalComponent,
    ButtonComponent,
    CardComponent
  ],
  templateUrl: './roles-page.component.html',
})
export class RolesPageComponent implements OnInit {
  private readonly roleSvc = inject(RoleService);
  private readonly permSvc = inject(PermissionService);

  readonly loading = signal(true);
  readonly saving = signal(false);
  readonly showModal = signal(false);
  readonly editingRole = signal<RoleDetail | null>(null);
  readonly selectedRoleForDetail = signal<RoleDetail | null>(null);
  readonly roles = signal<RoleDetail[]>([]);
  readonly allPermissions = signal<Permission[]>([]);

  ngOnInit(): void {
    this.loadRoles();
    this.permSvc.getAll().subscribe((perms) => this.allPermissions.set(perms));
  }

  loadRoles(): void {
    this.loading.set(true);
    this.roleSvc.getAll().subscribe({
      next: (roles) => { this.roles.set(roles); this.loading.set(false); },
      error: () => this.loading.set(false),
    });
  }

  openCreate(): void {
    this.editingRole.set(null);
    this.showModal.set(true);
  }

  openEdit(role: RoleDetail): void {
    this.editingRole.set(role);
    this.showModal.set(true);
  }

  onViewDetail(role: RoleDetail): void {
    this.selectedRoleForDetail.set(role);
  }

  closeModal(): void {
    this.showModal.set(false);
  }

  onSave(payload: RoleCreate | RoleUpdate): void {
    this.saving.set(true);
    const role = this.editingRole();

    if (role) {
      this.roleSvc.update(role.id, payload as RoleUpdate).subscribe({
        next: () => this.handleSuccess(),
        error: () => this.saving.set(false),
      });
    } else {
      this.roleSvc.create(payload as RoleCreate).subscribe({
        next: () => this.handleSuccess(),
        error: () => this.saving.set(false),
      });
    }
  }

  private handleSuccess(): void {
    this.saving.set(false);
    this.closeModal();
    this.loadRoles();
  }

  confirmDelete(role: RoleDetail): void {
    if (!confirm(`¿Eliminar el rol ${role.name}?`)) return;
    this.roleSvc.delete(role.id).subscribe(() => this.loadRoles());
  }
}
