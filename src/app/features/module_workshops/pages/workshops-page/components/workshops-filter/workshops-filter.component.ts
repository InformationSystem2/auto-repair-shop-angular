import { Component, input, output, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslationService } from '@core/services/translation.service';

export type WorkshopFilterType = 'all' | 'verified' | 'pending';

@Component({
  selector: 'app-workshops-filter',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="flex items-center gap-2 bg-slate-100 dark:bg-slate-900 p-1 rounded-xl w-fit">
      <button 
        (click)="onChange('all')"
        [class.bg-white]="current() === 'all'"
        [class.dark:bg-slate-800]="current() === 'all'"
        [class.shadow-sm]="current() === 'all'"
        class="px-4 py-2 text-xs font-bold rounded-lg transition-all text-slate-600 dark:text-slate-400"
        [class.text-indigo-600]="current() === 'all'">
        {{ i18n.translate('common.all') }}
      </button>
      <button 
        (click)="onChange('pending')"
        [class.bg-white]="current() === 'pending'"
        [class.dark:bg-slate-800]="current() === 'pending'"
        [class.shadow-sm]="current() === 'pending'"
        class="px-4 py-2 text-xs font-bold rounded-lg transition-all text-slate-600 dark:text-slate-400"
        [class.text-indigo-600]="current() === 'pending'">
        {{ i18n.translate('common.pending_plural') }}
      </button>
      <button 
        (click)="onChange('verified')"
        [class.bg-white]="current() === 'verified'"
        [class.dark:bg-slate-800]="current() === 'verified'"
        [class.shadow-sm]="current() === 'verified'"
        class="px-4 py-2 text-xs font-bold rounded-lg transition-all text-slate-600 dark:text-slate-400"
        [class.text-indigo-600]="current() === 'verified'">
        {{ i18n.translate('common.verified_plural') }}
      </button>
    </div>
  `
})
export class WorkshopsFilterComponent {
  readonly i18n = inject(TranslationService);
  
  current = input<WorkshopFilterType>('all');
  changed = output<WorkshopFilterType>();

  onChange(type: WorkshopFilterType): void {
    this.changed.emit(type);
  }
}
