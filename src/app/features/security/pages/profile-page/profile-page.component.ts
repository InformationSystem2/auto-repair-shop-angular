import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '@core/auth/auth.service';
import { UserService } from '@users/services/user.service';
import { ToastService } from '@core/services/toast.service';
import { User, UserUpdate } from '@users/models/user.model';
import { ButtonComponent } from '@shared/components/ui/button/button.component';
import { ProfileHeaderComponent } from './components/profile-header/profile-header.component';
import { ProfileEditFormComponent } from './components/profile-edit-form/profile-edit-form.component';

@Component({
  selector: 'app-profile-page',
  standalone: true,
  imports: [
    CommonModule,
    ProfileHeaderComponent,
    ProfileEditFormComponent
  ],
  templateUrl: './profile-page.component.html',
})
export class ProfilePageComponent implements OnInit {
  private readonly auth = inject(AuthService);
  private readonly userSvc = inject(UserService);
  private readonly toastSvc = inject(ToastService);

  readonly loading = signal(true);
  readonly saving = signal(false);
  readonly user = signal<User | null>(null);

  ngOnInit(): void {
    this.loadUser();
  }

  loadUser() {
    this.loading.set(true);
    this.auth.me().subscribe({
      next: (u: User) => { 
        this.user.set(u); 
        this.loading.set(false); 
      },
      error: () => {
        this.loading.set(false);
        this.toastSvc.error('Error al cargar el perfil');
      },
    });
  }

  onSave(payload: UserUpdate) {
    const currentUser = this.user();
    if (!currentUser) return;
    
    this.saving.set(true);
    this.userSvc.update(currentUser.id, payload).subscribe({
      next: (updatedUser: User) => {
        this.saving.set(false);
        this.user.set(updatedUser);
        this.toastSvc.success('Perfil actualizado correctamente');
      },
      error: () => {
        this.saving.set(false);
        this.toastSvc.error('Hubo un error al actualizar el perfil');
      }
    });
  }
}
