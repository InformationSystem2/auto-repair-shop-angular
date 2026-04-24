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
    <form [formGroup]="form()" (ngSubmit)="save.emit()" class="space-y-8 pt-2 text-left">
      
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div class="space-y-2">
          <label class="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 ml-1">{{ i18n.translate('users.form.first_name') }}</label>
          <input formControlName="name" type="text" 
                 class="h-12 w-full rounded-2xl border border-white/5 bg-slate-950/40 px-5 text-sm focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all font-bold text-white outline-none shadow-inner" />
        </div>
        <div class="space-y-2">
          <label class="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 ml-1">{{ i18n.translate('users.form.last_name') }}</label>
          <input formControlName="last_name" type="text" 
                 class="h-12 w-full rounded-2xl border border-white/5 bg-slate-950/40 px-5 text-sm focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all font-bold text-white outline-none shadow-inner" />
        </div>
      </div>

      <div class="space-y-2">
        <label class="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 ml-1">{{ i18n.translate('users.form.email') }}</label>
        <input formControlName="email" type="email"
               class="h-12 w-full rounded-2xl border border-white/5 bg-slate-950/40 px-5 text-sm focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all disabled:opacity-50 font-bold text-white outline-none shadow-inner" />
      </div>

      <div class="space-y-2">
        <label class="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 ml-1">
          {{ isEditing() ? i18n.translate('users.form.password_hint') : i18n.translate('login.password') }}
        </label>
        <input formControlName="password" type="password" placeholder="••••••••"
               class="h-12 w-full rounded-2xl border border-white/5 bg-slate-950/40 px-5 text-sm focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all font-bold text-white outline-none shadow-inner" />
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div class="space-y-2">
          <label class="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 ml-1">{{ i18n.translate('users.form.phone') }}</label>
          <input formControlName="phone" type="text"
                 class="h-12 w-full rounded-2xl border border-white/5 bg-slate-950/40 px-5 text-sm focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all font-bold text-white outline-none shadow-inner" />
        </div>
        <div class="space-y-2">
          <label class="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 ml-1">{{ i18n.translate('technicians.form.availability') }}</label>
          <div class="flex items-center h-12 px-5 rounded-2xl border border-white/5 bg-slate-950/40 shadow-inner">
            <input formControlName="is_available" type="checkbox" class="w-4 h-4 rounded-md bg-slate-900 border-white/10 text-indigo-500 focus:ring-indigo-500 focus:ring-offset-slate-900" />
            <span class="ml-3 text-[11px] font-black text-slate-400 uppercase tracking-widest">{{ i18n.translate('technicians.form.status_active_desc') }}</span>
          </div>
        </div>
      </div>

      <div class="pt-8 border-t border-white/5 flex flex-col md:flex-row gap-4">
        <button appButton variant="outline" class="flex-1 order-2 md:order-1 h-14 rounded-2xl border-white/10 text-slate-400 font-black tracking-widest uppercase text-xs" (click)="cancel.emit()" type="button">
          {{ i18n.translate('common.cancel') }}
        </button>
        <button appButton class="flex-1 order-1 md:order-2 h-14 rounded-2xl shadow-xl shadow-indigo-500/20" [disabled]="saving()" type="submit">
          <span class="flex items-center justify-center gap-3">
            <svg *ngIf="saving()" class="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
            </svg>
            <span class="font-black uppercase tracking-[0.15em] text-xs">
              {{ saving() ? i18n.translate('common.saving') : i18n.translate('technicians.save_tech') }}
            </span>
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
