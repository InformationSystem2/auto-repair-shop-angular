import { Component, input, output, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Workshop } from '../../../../models/workshop.model';
import { CardComponent } from '@ui/card/card.component';
import { ButtonComponent } from '@ui/button/button.component';
import { TranslationService } from '@core/services/translation.service';

@Component({
  selector: 'app-workshop-info-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, CardComponent, ButtonComponent],
  template: `
    <app-card class="bg-white/50 dark:bg-slate-900/40 border-none shadow-xl shadow-slate-200/40 dark:shadow-none">
      <div class="p-8 space-y-8">
        <div class="flex items-center gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
          <div class="w-8 h-8 rounded-xl bg-indigo-50 dark:bg-indigo-500/10 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
            <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
          </div>
          <div>
            <h3 class="font-black text-slate-800 dark:text-white uppercase tracking-wider text-[0.65rem]">{{ i18n.translate('workshops.general_info') }}</h3>
            <p class="text-[0.6rem] text-slate-400 mt-0.5 uppercase font-bold tracking-tight">{{ i18n.translate('users.detail_subtitle') }}</p>
          </div>
        </div>

        <form [formGroup]="form()" (ngSubmit)="save.emit()" class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div class="space-y-1.5">
            <label class="text-[0.65rem] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-1">{{ i18n.translate('workshops.form.name') }}</label>
            <input formControlName="name" type="text" [placeholder]="i18n.translate('workshops.form.name_placeholder')"
                   class="h-11 w-full rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-950/50 px-4 text-sm focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all font-bold outline-none" />
          </div>

          <div class="space-y-1.5">
            <label class="text-[0.65rem] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-1">{{ i18n.translate('workshops.form.business_name') }}</label>
            <input formControlName="business_name" type="text" [placeholder]="i18n.translate('workshops.form.business_name_placeholder')"
                   class="h-11 w-full rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-950/50 px-4 text-sm focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all font-bold outline-none" />
          </div>
          
          <div class="space-y-1.5 opacity-60">
            <label class="text-[0.65rem] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-1 cursor-not-allowed">{{ i18n.translate('workshops.form.ruc_nit') }} ({{ i18n.translate('common.not_editable') }})</label>
            <input [value]="workshop()?.ruc_nit" type="text" readonly
                   class="h-11 w-full rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 px-4 text-sm cursor-not-allowed font-bold outline-none" />
          </div>

          <div class="space-y-1.5">
            <label class="text-[0.65rem] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-1">{{ i18n.translate('workshops.form.phone') }}</label>
            <input formControlName="phone" type="text" [placeholder]="i18n.translate('workshops.form.phone_placeholder')"
                   class="h-11 w-full rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-950/50 px-4 text-sm focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all font-bold outline-none" />
          </div>

          <div class="md:col-span-2 space-y-1.5">
            <label class="text-[0.65rem] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-1">{{ i18n.translate('workshops.form.address') }}</label>
            <input formControlName="address" type="text" [placeholder]="i18n.translate('workshops.form.address_placeholder')"
                   class="h-11 w-full rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-950/50 px-4 text-sm focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all font-bold outline-none" />
          </div>

          <div class="md:col-span-2 pt-6 flex justify-end">
            <button appButton 
                    type="submit" 
                    [disabled]="saving() || form().invalid" 
                    variant="default"
                    class="px-10 h-12 rounded-2xl"
            >
              <div class="flex items-center gap-2">
                <svg *ngIf="saving()" class="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                </svg>
                <span class="font-bold uppercase tracking-widest text-xs">
                  {{ saving() ? i18n.translate('common.saving') : i18n.translate('common.save') }}
                </span>
              </div>
            </button>
          </div>
        </form>
      </div>
    </app-card>
  `
})
export class WorkshopInfoFormComponent {
  readonly i18n = inject(TranslationService);
  
  form = input.required<FormGroup>();
  workshop = input<Workshop | null>(null);
  saving = input<boolean>(false);
  save = output<void>();
}
