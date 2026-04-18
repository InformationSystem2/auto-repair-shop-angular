import { Component, inject, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { WorkshopService } from '../../services/workshop.service';
import { SpecialtyService } from '../../services/specialty.service';
import { AuthService } from '@core/auth/auth.service';
import { Workshop, WorkshopUpdate, WorkshopAdminUpdate } from '../../models/workshop.model';
import { Specialty } from '../../models/specialty.model';
import { ButtonComponent } from '@ui/button/button.component';
import { CardComponent } from '@ui/card/card.component';
import { BadgeComponent } from '@ui/badge/badge.component';
import { ToastService } from '@core/services/toast.service';
import { TranslationService } from '@core/services/translation.service';
import { SwitchComponent } from '@ui/switch/switch.component';

// Shared Components
import { WorkshopInfoFormComponent } from './components/workshop-info-form/workshop-info-form.component';
import { WorkshopSpecialtiesSelectorComponent } from './components/workshop-specialties-selector/workshop-specialties-selector.component';
import { WorkshopStatsComponent } from './components/workshop-stats/workshop-stats.component';

@Component({
  selector: 'app-workshop-management-page',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    BadgeComponent,
    ButtonComponent,
    CardComponent,
    WorkshopInfoFormComponent,
    WorkshopSpecialtiesSelectorComponent,
    WorkshopStatsComponent,
    SwitchComponent
  ],
  templateUrl: './workshop-management-page.component.html'
})
export class WorkshopManagementPageComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly fb = inject(FormBuilder);
  private readonly workshopSvc = inject(WorkshopService);
  private readonly specialtySvc = inject(SpecialtyService);
  private readonly authSvc = inject(AuthService);
  private readonly toastSvc = inject(ToastService);
  readonly i18n = inject(TranslationService);

  readonly workshop = signal<Workshop | null>(null);
  readonly availableSpecialties = signal<Specialty[]>([]);
  readonly loading = signal(true);
  readonly saving = signal(false);
  
  // Context Detection
  readonly isAdmin = this.authSvc.isAdmin;
  readonly isAdminMode = signal(false); // true if managing via /workshops/:id
  
  readonly form = this.fb.group({
    // Basic Info (WorkshopUpdate)
    name: ['', [Validators.required, Validators.maxLength(150)]],
    business_name: ['', [Validators.required, Validators.maxLength(255)]],
    address: ['', [Validators.required]],
    phone: ['', [Validators.required, Validators.maxLength(50)]],
    latitude: [null as number | null],
    longitude: [null as number | null],
    specialty_ids: [[] as number[]],
    
    // Admin Only Info (WorkshopAdminUpdate)
    commission_rate: [0, [Validators.required, Validators.min(0)]],
    is_verified: [false],
    is_available: [true]
  });

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    this.isAdminMode.set(!!id);
    this.loadData(id);
  }

  loadData(id: string | null): void {
    this.loading.set(true);
    
    // 1. Load available specialties (shared)
    this.specialtySvc.getAll().subscribe(specs => this.availableSpecialties.set(specs));

    // 2. Load workshop data based on mode
    const request$ = id 
      ? this.workshopSvc.getById(id) 
      : this.workshopSvc.getMyWorkshop();

    request$.subscribe({
      next: (data) => {
        this.workshop.set(data);
        this.patchForm(data);
        this.loading.set(false);
      },
      error: () => {
        this.toastSvc.error(this.i18n.translate('errors.generic'));
        if (id) this.router.navigate(['/app/workshops']);
        this.loading.set(false);
      }
    });
  }

  private patchForm(data: Workshop): void {
    this.form.patchValue({
      name: data.name,
      business_name: data.business_name,
      address: data.address,
      phone: data.phone,
      latitude: data.latitude,
      longitude: data.longitude,
      specialty_ids: data.specialties.map(s => s.id),
      commission_rate: data.commission_rate,
      is_verified: data.is_verified,
      is_available: data.is_available
    });
  }

  onSpecialtyToggle(id: number): void {
    const current = this.form.get('specialty_ids')?.value || [];
    const index = current.indexOf(id);
    const updated = [...current];
    if (index > -1) {
      updated.splice(index, 1);
    } else {
      updated.push(id);
    }
    this.form.get('specialty_ids')?.setValue(updated);
  }

  onSubmit(): void {
    const data = this.workshop();
    if (!data || this.form.invalid) return;

    this.saving.set(true);
    
    if (this.isAdminMode()) {
      // Admin Update
      const payload: WorkshopAdminUpdate = this.form.value as WorkshopAdminUpdate;
      this.workshopSvc.adminUpdate(data.id, payload).subscribe({
        next: (updated) => this.handleSuccess(updated),
        error: () => this.handleError()
      });
    } else {
      // Owner Update
      const payload: WorkshopUpdate = {
        name: this.form.value.name ?? undefined,
        business_name: this.form.value.business_name ?? undefined,
        address: this.form.value.address ?? undefined,
        phone: this.form.value.phone ?? undefined,
        latitude: this.form.value.latitude ?? undefined,
        longitude: this.form.value.longitude ?? undefined,
        specialty_ids: this.form.value.specialty_ids ?? undefined
      };
      this.workshopSvc.updateMyWorkshop(payload).subscribe({
        next: (updated) => this.handleSuccess(updated),
        error: () => this.handleError()
      });
    }
  }

  private handleSuccess(updated: Workshop): void {
    this.workshop.set(updated);
    this.patchForm(updated);
    this.saving.set(false);
    this.toastSvc.success(this.i18n.translate('workshops.update_success'));
  }

  private handleError(): void {
    this.saving.set(false);
    this.toastSvc.error(this.i18n.translate('errors.generic'));
  }

  deleteWorkshop(): void {
    const data = this.workshop();
    if (!data) return;

    const confirmMsg = this.i18n.translate('users.delete_confirm', { name: data.business_name });
    if (confirm(confirmMsg)) {
      this.workshopSvc.delete(data.id).subscribe({
        next: () => {
          this.toastSvc.success(this.i18n.translate('workshops.delete_success'));
          this.router.navigate(['/app/workshops']);
        },
        error: () => this.toastSvc.error(this.i18n.translate('errors.generic'))
      });
    }
  }

  goBack(): void {
    if (this.isAdminMode()) {
      this.router.navigate(['/app/workshops']);
    } else {
      window.history.back();
    }
  }
}
