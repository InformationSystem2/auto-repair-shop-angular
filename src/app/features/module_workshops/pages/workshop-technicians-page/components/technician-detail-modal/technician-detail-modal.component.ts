import { Component, input, output, ChangeDetectionStrategy, inject } from '@angular/core';
import { DatePipe } from '@angular/common';
import { Technician } from '../../../../models/technician.model';
import { BadgeComponent } from '@ui/badge/badge.component';
import { TranslationService } from '@core/services/translation.service';

@Component({
  selector: 'app-technician-detail-modal',
  standalone: true,
  imports: [DatePipe, BadgeComponent],
  templateUrl: './technician-detail-modal.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TechnicianDetailModalComponent {
  readonly i18n = inject(TranslationService);

  technician = input<Technician | null>(null);
  close = output<void>();
}
