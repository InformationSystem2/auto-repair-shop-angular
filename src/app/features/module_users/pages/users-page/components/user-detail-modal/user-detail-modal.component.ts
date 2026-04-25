import { Component, inject, input, output, signal, effect, ChangeDetectionStrategy } from '@angular/core';
import { UserService } from '@users/services/user.service';
import { User } from '@users/models/user.model';
import { DatePipe } from '@angular/common';
import { TranslationService } from '@core/services/translation.service';

@Component({
  selector: 'app-user-detail-modal',
  standalone: true,
  imports: [
    DatePipe
  ],
  templateUrl: './user-detail-modal.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserDetailModalComponent {
  private readonly userService = inject(UserService);
  readonly i18n = inject(TranslationService);

  userId = input<string | null>(null);
  close = output<void>();

  user = signal<User | null>(null);
  loading = signal(false);

  constructor() {
    effect(() => {
      const id = this.userId();
      if (id) {
        this.fetchDetails(id);
      } else {
        this.user.set(null);
      }
    });
  }

  private fetchDetails(id: string): void {
    this.loading.set(true);
    this.userService.getById(id).subscribe({
      next: (val) => {
        this.user.set(val);
        this.loading.set(false);
      },
      error: () => this.loading.set(false)
    });
  }
}
