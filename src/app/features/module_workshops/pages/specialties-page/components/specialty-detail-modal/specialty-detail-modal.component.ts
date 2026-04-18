import { Component, input, output, ChangeDetectionStrategy, inject } from '@angular/core';
import { Specialty } from '../../../../models/specialty.model';
import { TranslationService } from '@core/services/translation.service';

@Component({
  selector: 'app-specialty-detail-modal',
  standalone: true,
  imports: [],
  templateUrl: './specialty-detail-modal.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SpecialtyDetailModalComponent {
  readonly i18n = inject(TranslationService);

  specialty = input<Specialty | null>(null);
  close = output<void>();
}
