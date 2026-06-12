import { Component, inject, signal, ChangeDetectionStrategy } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '@core/auth/auth.service';
import { TranslationService } from '@core/services/translation.service';

@Component({
  selector: 'app-forgot-password-page',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './forgot-password-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ForgotPasswordPageComponent {
  private readonly fb = inject(FormBuilder);
  private readonly auth = inject(AuthService);
  readonly i18n = inject(TranslationService);

  readonly loading = signal(false);
  readonly error = signal<string | null>(null);
  readonly success = signal<string | null>(null);
  readonly stage = signal<'email' | 'code'>('email');
  readonly emailSent = signal('');
  readonly devCode = signal<string | null>(null);

  readonly form = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    code: ['', Validators.required],
    newPassword: ['', [Validators.required, Validators.minLength(8)]],
  });

  sendRecoveryCode(): void {
    const email = this.form.get('email')?.value;
    if (!email || this.form.get('email')?.invalid) {
      this.form.get('email')?.markAsTouched();
      return;
    }
    this.loading.set(true);
    this.error.set(null);

    this.auth.forgotPassword(email!).subscribe({
      next: (res) => {
        this.loading.set(false);
        this.emailSent.set(email!);
        if (res.code) {
          this.devCode.set(res.code);
          this.form.patchValue({ code: res.code });
        }
        this.stage.set('code');
        this.success.set(res.message);
      },
      error: (err) => {
        this.loading.set(false);
        this.error.set(err.error?.detail || 'Error al enviar el código');
      },
    });
  }

  resetPassword(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const { code, newPassword } = this.form.value;
    this.loading.set(true);
    this.error.set(null);

    this.auth.resetPassword(this.emailSent(), code!, newPassword!).subscribe({
      next: (res) => {
        this.loading.set(false);
        this.success.set(res.message);
      },
      error: (err) => {
        this.loading.set(false);
        this.error.set(err.error?.detail || 'Error al restablecer contraseña');
      },
    });
  }

  backToEmail(): void {
    this.stage.set('email');
    this.error.set(null);
    this.success.set(null);
  }
}
