import { Component, inject, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { WorkshopService } from '../../services/workshop.service';
import { Workshop, WorkshopAdminUpdate } from '../../models/workshop.model';
import { ToastService } from '@core/services/toast.service';
import { ReactiveFormsModule } from '@angular/forms';
import { WorkshopsFilterComponent, WorkshopFilterType } from './components/workshops-filter/workshops-filter.component';
import { WorkshopsTableComponent } from './components/workshops-table/workshops-table.component';
import { TranslationService } from '@core/services/translation.service';

import { CardComponent } from '@ui/card/card.component';

@Component({
  selector: 'app-workshops-page',
  standalone: true,
  imports: [
    CommonModule, 
    ReactiveFormsModule, 
    WorkshopsFilterComponent, 
    WorkshopsTableComponent,
    CardComponent
  ],
  templateUrl: './workshops-page.component.html',
})
export class WorkshopsPageComponent implements OnInit {
  private readonly workshopSvc = inject(WorkshopService);
  private readonly router = inject(Router);
  private readonly toastSvc = inject(ToastService);
  readonly i18n = inject(TranslationService);

  readonly loading = signal(true);
  readonly workshops = signal<Workshop[]>([]);
  readonly filterVerified = signal<WorkshopFilterType>('all');

  readonly filteredWorkshops = computed(() => {
    const list = this.workshops();
    const filter = this.filterVerified();
    
    if (filter === 'verified') return list.filter(w => w.is_verified);
    if (filter === 'pending') return list.filter(w => !w.is_verified);
    return list;
  });

  ngOnInit(): void {
    this.loadWorkshops();
  }

  loadWorkshops(): void {
    this.loading.set(true);
    this.workshopSvc.getAll().subscribe({
      next: (data) => {
        this.workshops.set(data);
        this.loading.set(false);
      },
      error: () => this.loading.set(false)
    });
  }

  onWorkshopSelect(workshop: Workshop): void {
    this.router.navigate(['/app/workshops', workshop.id]);
  }

  verifyWorkshop(workshop: Workshop): void {
    const payload: WorkshopAdminUpdate = { is_verified: true };
    this.workshopSvc.adminUpdate(workshop.id, payload).subscribe({
      next: () => {
        this.toastSvc.success(this.i18n.translate('workshops.update_success'));
        this.loadWorkshops();
      },
      error: () => {}
    });
  }
}
