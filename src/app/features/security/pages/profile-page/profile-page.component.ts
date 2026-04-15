import { Component, inject, OnInit, signal, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '@core/auth/auth.service';
import { UserService } from '@users/services/user.service';
import { ToastService } from '@core/services/toast.service';
import { TranslationService } from '@core/services/translation.service';
import { User, UserUpdate } from '@users/models/user.model';
import { ButtonComponent } from '@shared/components/ui/button/button.component';
import { ProfileHeaderComponent } from './components/profile-header/profile-header.component';
import { ProfileEditFormComponent } from './components/profile-edit-form/profile-edit-form.component';
@Component({
  selector: 'app-profile-page',
  imports: [
    CommonModule,
    ProfileHeaderComponent,
    ProfileEditFormComponent
  ],
  templateUrl: './profile-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProfilePageComponent implements OnInit {
  private readonly auth = inject(AuthService);
  private readonly userSvc = inject(UserService);
  private readonly toastSvc = inject(ToastService);
  readonly i18n = inject(TranslationService);

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
        this.toastSvc.error(this.i18n.translate('profile.load_error'));
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
        this.toastSvc.success(this.i18n.translate('profile.save_success'));
      },
      error: () => {
        this.saving.set(false);
        this.toastSvc.error(this.i18n.translate('profile.save_error'));
      }
    });
  }
}
