import { Component, inject, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserService } from '@users/services/user.service';
import { RoleService } from '@users/services/role.service';
import { User, UserCreate, UserUpdate } from '@users/models/user.model';
import { RoleDetail } from '@users/models/role.model';
import { UsersToolbarComponent } from './components/users-toolbar/users-toolbar.component';
import { UsersTableComponent } from './components/users-table/users-table.component';
import { UserFormComponent } from './components/user-form/user-form.component';
import { UserDetailModalComponent } from './components/user-detail-modal/user-detail-modal.component';
import { ButtonComponent } from '@ui/button/button.component';
import { CardComponent } from '@ui/card/card.component';
import { AlertDialogComponent } from '@ui/alert-dialog/alert-dialog.component';

@Component({
  selector: 'app-users-page',
  standalone: true,
  imports: [
    CommonModule, 
    UsersToolbarComponent, 
    UsersTableComponent, 
    UserFormComponent, 
    UserDetailModalComponent,
    ButtonComponent,
    CardComponent,
    AlertDialogComponent
  ],
  templateUrl: './users-page.component.html',
})
export class UsersPageComponent implements OnInit {
  private readonly userSvc = inject(UserService);
  private readonly roleSvc = inject(RoleService);

  readonly loading = signal(true);
  readonly saving = signal(false);
  readonly showModal = signal(false);
  readonly showDetailModal = signal(false);
  readonly editingUser = signal<User | null>(null);
  readonly selectedUserForDetail = signal<User | null>(null);
  readonly selectedUserForDelete = signal<User | null>(null);
  readonly search = signal('');
  readonly selectedRoleId = signal<number | null>(null);
  readonly users = signal<User[]>([]);
  readonly availableRoles = signal<RoleDetail[]>([]);

  readonly filtered = computed(() => {
    let list = this.users();
    const q = this.search().toLowerCase();
    const roleId = this.selectedRoleId();

    if (q) {
      list = list.filter(
        (u) =>
          u.name.toLowerCase().includes(q) ||
          u.last_name.toLowerCase().includes(q) ||
          u.email.toLowerCase().includes(q)
      );
    }

    if (roleId) {
      list = list.filter((u) => u.roles.some((r) => r.id === roleId));
    }

    return list;
  });

  ngOnInit(): void {
    this.loadUsers();
    this.roleSvc.getAll().subscribe((roles) => this.availableRoles.set(roles));
  }

  loadUsers(): void {
    this.loading.set(true);
    this.userSvc.getAll().subscribe({
      next: (users) => { this.users.set(users); this.loading.set(false); },
      error: () => this.loading.set(false),
    });
  }

  openCreate(): void {
    this.editingUser.set(null);
    this.showModal.set(true);
  }

  openEdit(user: User): void {
    this.editingUser.set(user);
    this.showModal.set(true);
  }

  onViewDetail(user: User): void {
    this.selectedUserForDetail.set(user);
  }

  closeModal(): void {
    this.showModal.set(false);
  }

  onSave(payload: UserCreate | UserUpdate): void {
    this.saving.set(true);
    const user = this.editingUser();

    if (user) {
      this.userSvc.update(user.id, payload as UserUpdate).subscribe({
        next: () => this.handleSuccess(),
        error: () => this.saving.set(false),
      });
    } else {
      this.userSvc.create(payload as UserCreate).subscribe({
        next: () => this.handleSuccess(),
        error: () => this.saving.set(false),
      });
    }
  }

  private handleSuccess(): void {
    this.saving.set(false);
    this.closeModal();
    this.loadUsers();
  }

  confirmDelete(user: User): void {
    this.selectedUserForDelete.set(user);
  }

  onDeleteConfirm(): void {
    const user = this.selectedUserForDelete();
    if (!user) return;

    this.userSvc.delete(user.id).subscribe({
      next: () => {
        this.selectedUserForDelete.set(null);
        this.loadUsers();
      },
      error: () => this.selectedUserForDelete.set(null)
    });
  }
}
