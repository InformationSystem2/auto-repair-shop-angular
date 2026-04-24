import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { TechnicianService } from '../../services/technician.service';
import { Technician, TechnicianCreate, TechnicianUpdate } from '../../models/technician.model';
import { ButtonComponent } from '@ui/button/button.component';
import { ToastService } from '@core/services/toast.service';
import { TranslationService } from '@core/services/translation.service';
import { DialogComponent, DialogOverlayComponent, DialogContentComponent, DialogHeaderComponent, DialogTitleComponent } from '@ui/dialog/dialog.component';
import { TechnicianFormComponent } from './components/technician-form/technician-form.component';
import { CardComponent } from '@ui/card/card.component';
import { TechniciansTableComponent } from './components/technicians-table/technicians-table.component';
import { TechnicianDetailModalComponent } from './components/technician-detail-modal/technician-detail-modal.component';

@Component({
  selector: 'app-workshop-technicians-page',
  standalone: true,
  imports: [
    CommonModule, 
    ReactiveFormsModule, 
    DialogComponent,
    DialogOverlayComponent,
    DialogContentComponent,
    DialogHeaderComponent,
    DialogTitleComponent,
    TechnicianFormComponent,
    TechniciansTableComponent,
    TechnicianDetailModalComponent
  ],
  templateUrl: './workshop-technicians-page.component.html',
})
export class WorkshopTechniciansPageComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly techSvc = inject(TechnicianService);
  private readonly toastSvc = inject(ToastService);
  readonly i18n = inject(TranslationService);

  readonly loading = signal(true);
  readonly saving = signal(false);
  readonly technicians = signal<Technician[]>([]);
  
  readonly showModal = signal(false);
  readonly showDetailModal = signal(false);
  readonly selectedTech = signal<Technician | null>(null);
  readonly selectedTechDetail = signal<Technician | null>(null);

  readonly form = this.fb.group({
    name: ['', [Validators.required, Validators.maxLength(100)]],
    last_name: ['', [Validators.required, Validators.maxLength(100)]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    phone: ['', [Validators.required, Validators.maxLength(20)]],
    is_available: [true],
  });

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.loading.set(true);
    this.techSvc.getAll().subscribe({
      next: (data) => {
        this.technicians.set(data);
        this.loading.set(false);
      },
      error: () => this.loading.set(false)
    });
  }

  openModal(tech: Technician | null = null): void {
    if (tech) {
      this.loading.set(true);
      this.techSvc.getById(tech.id).subscribe({
        next: (data) => {
          this.selectedTech.set(data);
          this.form.patchValue({
            name: data.name,
            last_name: data.last_name,
            email: data.email,
            phone: data.phone,
            is_available: data.is_available,
          });
          this.form.get('password')?.setValidators([Validators.minLength(6)]);
          this.form.get('email')?.disable();
          this.showModal.set(true);
          this.loading.set(false);
        },
        error: () => this.loading.set(false),
      });
    } else {
      this.selectedTech.set(null);
      this.form.reset({ is_available: true });
      this.form.get('password')?.setValidators([Validators.required, Validators.minLength(6)]);
      this.form.get('email')?.enable();
      this.showModal.set(true);
    }
  }

  onSave(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.saving.set(true);
    const tech = this.selectedTech();
    const payload = this.form.getRawValue();

    if (tech) {
      const updatePayload: TechnicianUpdate = {
        name: payload.name!,
        last_name: payload.last_name!,
        phone: payload.phone!,
        is_available: payload.is_available!,
      };
      this.techSvc.update(tech.id, updatePayload).subscribe({
        next: () => this.handleSuccess(this.i18n.translate('technicians.save_success')),
        error: () => this.saving.set(false)
      });
    } else {
      this.techSvc.create(payload as TechnicianCreate).subscribe({
        next: () => this.handleSuccess(this.i18n.translate('technicians.save_success')),
        error: () => this.saving.set(false)
      });
    }
  }

  handleSuccess(message: string): void {
    this.toastSvc.success(message);
    this.showModal.set(false);
    this.selectedTech.set(null);
    this.loadData();
    this.saving.set(false);
  }

  deleteTech(tech: Technician): void {
    if (confirm(this.i18n.translate('technicians.delete_confirm', { name: tech.name }))) {
      this.techSvc.delete(tech.id).subscribe({
        next: () => {
          this.toastSvc.success(this.i18n.translate('technicians.delete_success'));
          this.loadData();
        },
        error: () => {} // Handled by interceptor
      });
    }
  }

  openDetail(tech: Technician): void {
    this.loading.set(true);
    this.techSvc.getById(tech.id).subscribe({
      next: (data) => {
        this.selectedTechDetail.set(data);
        this.showDetailModal.set(true);
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });
  }

  closeDetailModal(): void {
    this.showDetailModal.set(false);
    this.selectedTechDetail.set(null);
  }
}
