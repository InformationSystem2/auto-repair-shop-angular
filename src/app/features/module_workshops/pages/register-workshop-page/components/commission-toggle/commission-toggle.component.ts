import { Component, input, output, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslationService } from '@core/services/translation.service';

@Component({
  selector: 'app-commission-toggle',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="p-6 rounded-3xl bg-slate-50 dark:bg-slate-950/50 border border-slate-100 dark:border-slate-800 transition-all
                hover:shadow-lg hover:shadow-slate-200/50 dark:hover:shadow-none group">
      <label class="flex items-start gap-4 cursor-pointer select-none">
        <div class="flex items-center h-6">
          <input 
            type="checkbox" 
            [checked]="accepted()"
            (change)="onToggle($event)"
            class="w-5 h-5 rounded-md border-slate-300 text-indigo-600 focus:ring-indigo-500 dark:bg-slate-900 dark:border-slate-700 transition-all cursor-pointer" />
        </div>
        <div class="flex-1 text-left">
          <p class="text-xs text-slate-600 dark:text-slate-400 leading-relaxed font-medium">
            {{ i18n.translate('workshops.commission_notice_1') }} 
            <span class="text-indigo-600 dark:text-indigo-400 font-bold">{{ i18n.translate('workshops.commission_notice_2') }}</span> 
            {{ i18n.translate('workshops.commission_notice_3') }}
          </p>
        </div>
      </label>
    </div>
  `
})
export class CommissionToggleComponent {
  readonly i18n = inject(TranslationService);
  
  accepted = input<boolean>(false);
  changed = output<boolean>();

  onToggle(event: Event): void {
    const checkbox = event.target as HTMLInputElement;
    this.changed.emit(checkbox.checked);
  }
}
