import { Component, inject, signal } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators, FormGroup } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { WorkshopService } from '../../services/workshop.service';
import { ToastService } from '@core/services/toast.service';
import { TranslationService } from '@core/services/translation.service';
import { RegistrationFormComponent } from './components/registration-form/registration-form.component';
import { CommissionToggleComponent } from './components/commission-toggle/commission-toggle.component';

@Component({
  selector: 'app-register-workshop-page',
  standalone: true,
  imports: [
    CommonModule, 
    ReactiveFormsModule, 
    RouterLink,
    RegistrationFormComponent, 
    CommissionToggleComponent
  ],
  templateUrl: './register-workshop-page.component.html',
})
export class RegisterWorkshopPageComponent {
  private readonly fb = inject(FormBuilder);
  private readonly workshopSvc = inject(WorkshopService);
  private readonly toastSvc = inject(ToastService);
  private readonly router = inject(Router);

  readonly loading = signal(false);
  readonly commissionAccepted = signal(false);

  readonly form = this.fb.group({
    name: ['', [Validators.required, Validators.maxLength(150)]],
    business_name: ['', [Validators.required, Validators.maxLength(200)]],
    ruc_nit: ['', [Validators.required, Validators.maxLength(50)]],
    address: ['', [Validators.required]],
    phone: ['', [Validators.required, Validators.maxLength(50)]],
    email: ['', [Validators.required, Validators.email, Validators.maxLength(100)]],
    latitude: [null as number | null],
    longitude: [null as number | null],
    owner_name: ['', [Validators.required, Validators.maxLength(100)]],
    owner_last_name: ['', [Validators.required, Validators.maxLength(100)]],
    owner_phone: ['', [Validators.required, Validators.maxLength(20)]],
    owner_password: ['', [Validators.required, Validators.minLength(6)]],
  });

  readonly i18n = inject(TranslationService);

  onSubmit(): void {
    if (this.form.invalid || !this.commissionAccepted()) {
      this.form.markAllAsTouched();
      return;
    }

    this.loading.set(true);
    const payload: any = { ...this.form.value };

    this.workshopSvc.registerPublic(payload).subscribe({
      next: () => {
        this.loading.set(false);
        this.toastSvc.success(this.i18n.translate('workshops.save_success'));
        this.router.navigateByUrl('/login');
      },
      error: () => {
        this.loading.set(false);
        // Error is handled by global interceptor
      }
    });
  }
}
