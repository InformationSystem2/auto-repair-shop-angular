import { Component, input, output, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ButtonComponent } from '@ui/button/button.component';
import { TranslationService } from '@core/services/translation.service';

@Component({
  selector: 'app-technician-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, ButtonComponent],
  template: `
    <form [formGroup]="form()" (ngSubmit)="save.emit()" class="space-y-6 pt-2 text-left">
      
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div class="space-y-1">
          <label class="text-[0.65rem] font-black uppercase tracking-widest text-slate-500 ml-1">{{ i18n.translate('users.form.first_name') }}</label>
          <input formControlName="name" type="text" 
                 class="h-10 w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 px-4 text-xs focus:ring-4 focus:ring-indigo-500/10 transition-all font-medium" />
        </div>
        <div class="space-y-1">
          <label class="text-[0.65rem] font-black uppercase tracking-widest text-slate-500 ml-1">{{ i18n.translate('users.form.last_name') }}</label>
          <input formControlName="last_name" type="text" 
                 class="h-10 w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 px-4 text-xs focus:ring-4 focus:ring-indigo-500/10 transition-all font-medium" />
        </div>
      </div>

      <div class="space-y-1">
        <label class="text-[0.65rem] font-black uppercase tracking-widest text-slate-500 ml-1">{{ i18n.translate('users.form.email') }}</label>
        <input formControlName="email" type="email"
               class="h-10 w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 px-4 text-xs focus:ring-4 focus:ring-indigo-500/10 transition-all disabled:opacity-50 font-medium" />
      </div>

      <div class="space-y-1">
        <label class="text-[0.65rem] font-black uppercase tracking-widest text-slate-500 ml-1">
          {{ isEditing() ? i18n.translate('users.form.password_hint') : i18n.translate('login.password') }}
        </label>
        <input formControlName="password" type="password" placeholder="••••••••"
               class="h-10 w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 px-4 text-xs focus:ring-4 focus:ring-indigo-500/10 transition-all font-medium" />
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div class="space-y-1">
          <label class="text-[0.65rem] font-black uppercase tracking-widest text-slate-500 ml-1">{{ i18n.translate('users.form.phone') }}</label>
          <input formControlName="phone" type="text"
                 class="h-10 w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 px-4 text-xs focus:ring-4 focus:ring-indigo-500/10 transition-all font-medium" />
        </div>
        <div class="space-y-1">
          <label class="text-[0.65rem] font-black uppercase tracking-widest text-slate-500 ml-1">{{ i18n.translate('technicians.form.availability') }}</label>
          <div class="flex items-center h-10 px-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950">
            <input formControlName="is_available" type="checkbox" class="w-4 h-4 rounded-md text-indigo-600 focus:ring-indigo-500" />
            <span class="ml-2 text-[0.7rem] font-bold text-slate-600 dark:text-slate-400">{{ i18n.translate('technicians.form.status_active_desc') }}</span>
          </div>
        </div>
      </div>

      <div class="pt-4 border-t border-slate-100 dark:border-slate-800 flex flex-col md:flex-row gap-3">
        <button appButton variant="outline" class="flex-1 order-2 md:order-1" (click)="cancel.emit()" type="button">
          {{ i18n.translate('common.cancel') }}
        </button>
        <button appButton class="flex-1 order-1 md:order-2" [disabled]="saving()" type="submit">
          <span class="flex items-center justify-center gap-2">
            <svg *ngIf="saving()" class="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
            </svg>
            {{ saving() ? i18n.translate('common.saving') : i18n.translate('technicians.save_tech') }}
          </span>
        </button>
      </div>
    </form>
  `
})
export class TechnicianFormComponent {
  readonly i18n = inject(TranslationService);
  
  form = input.required<FormGroup>();
  saving = input<boolean>(false);
  isEditing = input<boolean>(false);

  save = output<void>();
  cancel = output<void>();
}
