import { Component, input, output, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Workshop } from '../../../../models/workshop.model';

import { ButtonComponent } from '@ui/button/button.component';
import { TranslationService } from '@core/services/translation.service';

@Component({
  selector: 'app-workshop-info-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="rounded-xl p-8" style="background-color: var(--ds-card); border: 1px solid var(--ds-border); box-shadow: 0 4px 20px var(--ds-shadow);">
      <div class="flex items-center gap-4 mb-8">
        <div class="w-10 h-10 rounded-lg flex items-center justify-center text-indigo-400" style="background-color: var(--ds-surface0);">
          <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
        </div>
        <div>
          <h3 class="text-lg font-bold" style="color: var(--ds-text);">{{ i18n.translate('workshops.general_info') }}</h3>
          <p class="text-xs" style="color: var(--ds-subtext);">{{ i18n.translate('workshops.profile_desc') }}</p>
        </div>
      </div>

      <form [formGroup]="form()" (ngSubmit)="save.emit()" class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div class="space-y-1.5">
          <label class="text-xs font-bold" style="color: var(--ds-subtext);">{{ i18n.translate('workshops.form.name') }}</label>
          <input formControlName="name" type="text" [placeholder]="i18n.translate('workshops.form.name_placeholder')"
                 class="h-11 w-full rounded-lg border px-4 text-sm focus:ring-2 focus:ring-indigo-500/20 transition-all outline-none" 
                 style="background-color: var(--ds-card-hi); border-color: var(--ds-border-sub); color: var(--ds-text);" />
        </div>

        <div class="space-y-1.5">
          <label class="text-xs font-bold" style="color: var(--ds-subtext);">{{ i18n.translate('workshops.form.business_name') }}</label>
          <input formControlName="business_name" type="text" [placeholder]="i18n.translate('workshops.form.business_name_placeholder')"
                 class="h-11 w-full rounded-lg border px-4 text-sm focus:ring-2 focus:ring-indigo-500/20 transition-all outline-none" 
                 style="background-color: var(--ds-card-hi); border-color: var(--ds-border-sub); color: var(--ds-text);" />
        </div>
        
        <div class="space-y-1.5 opacity-60">
          <label class="text-xs font-bold" style="color: var(--ds-subtext);">{{ i18n.translate('workshops.form.ruc_nit') }} ({{ i18n.translate('common.not_editable') }})</label>
          <input [value]="workshop()?.ruc_nit" type="text" readonly
                 class="h-11 w-full rounded-lg border px-4 text-sm cursor-not-allowed outline-none" 
                 style="background-color: var(--ds-surface0); border-color: var(--ds-border-sub); color: var(--ds-subtext);" />
        </div>

        <div class="space-y-1.5">
          <label class="text-xs font-bold" style="color: var(--ds-subtext);">{{ i18n.translate('workshops.form.phone') }}</label>
          <input formControlName="phone" type="text" [placeholder]="i18n.translate('workshops.form.phone_placeholder')"
                 class="h-11 w-full rounded-lg border px-4 text-sm focus:ring-2 focus:ring-indigo-500/20 transition-all outline-none" 
                 style="background-color: var(--ds-card-hi); border-color: var(--ds-border-sub); color: var(--ds-text);" />
        </div>

        <div class="md:col-span-2 space-y-1.5">
          <label class="text-xs font-bold" style="color: var(--ds-subtext);">{{ i18n.translate('workshops.form.address') }}</label>
          <input formControlName="address" type="text" [placeholder]="i18n.translate('workshops.form.address_placeholder')"
                 class="h-11 w-full rounded-lg border px-4 text-sm focus:ring-2 focus:ring-indigo-500/20 transition-all outline-none" 
                 style="background-color: var(--ds-card-hi); border-color: var(--ds-border-sub); color: var(--ds-text);" />
        </div>

        <div class="md:col-span-2 pt-4 flex justify-end">
          <button class="ds-btn-primary px-8 h-10 flex items-center gap-2" [disabled]="saving() || form().invalid">
            <svg *ngIf="saving()" class="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
            </svg>
            {{ saving() ? i18n.translate('common.saving') : i18n.translate('common.save') }}
          </button>
        </div>
      </form>
    </div>
  `
})
export class WorkshopInfoFormComponent {
  readonly i18n = inject(TranslationService);
  
  form = input.required<FormGroup>();
  workshop = input<Workshop | null>(null);
  saving = input<boolean>(false);
  save = output<void>();
}
