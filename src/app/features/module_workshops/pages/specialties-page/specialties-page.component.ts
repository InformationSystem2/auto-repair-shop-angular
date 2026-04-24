import { Component, inject, OnInit, signal, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SpecialtyService } from '../../services/specialty.service';
import { Specialty, SpecialtyCreate, SpecialtyUpdate } from '../../models/specialty.model';
import { ButtonComponent } from '@ui/button/button.component';
import { CardComponent } from '@ui/card/card.component';
import { SpecialtyFormComponent } from './components/specialty-form/specialty-form.component';
import { SpecialtyDetailModalComponent } from './components/specialty-detail-modal/specialty-detail-modal.component';
import { ToastService } from '@core/services/toast.service';
import { TranslationService } from '@core/services/translation.service';

@Component({
  selector: 'app-specialties-page',
  standalone: true,
  imports: [
    CommonModule,
    SpecialtyFormComponent,
    SpecialtyDetailModalComponent
  ],
  templateUrl: './specialties-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SpecialtiesPageComponent implements OnInit {
  private readonly specialtySvc = inject(SpecialtyService);
  private readonly toastSvc = inject(ToastService);
  readonly i18n = inject(TranslationService);

  readonly loading = signal(true);
  readonly saving = signal(false);
  readonly showModal = signal(false);
  readonly showDetailModal = signal(false);
  readonly specialties = signal<Specialty[]>([]);
  readonly editingSpecialty = signal<Specialty | null>(null);
  readonly selectedSpecialty = signal<Specialty | null>(null);

  ngOnInit(): void {
    this.loadSpecialties();
  }

  loadSpecialties(): void {
    this.loading.set(true);
    this.specialtySvc.getAll().subscribe({
      next: (data) => {
        this.specialties.set(data);
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });
  }

  openCreate(): void {
    this.editingSpecialty.set(null);
    this.showModal.set(true);
  }

  openEdit(specialty: Specialty): void {
    this.loading.set(true);
    this.specialtySvc.getById(specialty.id).subscribe({
      next: (data) => {
        this.editingSpecialty.set(data);
        this.showModal.set(true);
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });
  }

  closeModal(): void {
    this.showModal.set(false);
  }

  openDetail(specialty: Specialty): void {
    this.loading.set(true);
    this.specialtySvc.getById(specialty.id).subscribe({
      next: (data) => {
        this.selectedSpecialty.set(data);
        this.showDetailModal.set(true);
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });
  }

  closeDetailModal(): void {
    this.showDetailModal.set(false);
    this.selectedSpecialty.set(null);
  }

  onSave(payload: SpecialtyCreate | SpecialtyUpdate): void {
    this.saving.set(true);
    const specialty = this.editingSpecialty();

    if (specialty) {
      this.specialtySvc.update(specialty.id, payload as SpecialtyUpdate).subscribe({
        next: () => this.handleSuccess(this.i18n.translate('workshops.save_success')),
        error: () => this.saving.set(false),
      });
    } else {
      this.specialtySvc.create(payload as SpecialtyCreate).subscribe({
        next: () => this.handleSuccess(this.i18n.translate('workshops.save_success')),
        error: () => this.saving.set(false),
      });
    }
  }

  confirmDelete(specialty: Specialty): void {
    const confirmMsg = this.i18n.translate('workshops.delete_confirm', { name: specialty.name });
    if (!confirm(confirmMsg)) return;
    
    this.specialtySvc.delete(specialty.id).subscribe({
      next: () => {
        this.toastSvc.success(this.i18n.translate('workshops.specialty_delete_success'));
        this.loadSpecialties();
      },
    });
  }

  private handleSuccess(message: string): void {
    this.toastSvc.success(message);
    this.saving.set(false);
    this.closeModal();
    this.loadSpecialties();
  }
}
