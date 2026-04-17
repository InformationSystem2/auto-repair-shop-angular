import { Component, input, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { TranslationService } from '@core/services/translation.service';

@Component({
  selector: 'app-registration-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div [formGroup]="form()" class="space-y-10 text-left">
      <!-- Section: Workshop Info -->
      <div class="space-y-6">
        <div class="flex items-center gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
          <div class="w-8 h-8 rounded-xl bg-indigo-50 dark:bg-indigo-500/10 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
            <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
          </div>
          <div>
            <h3 class="font-black text-slate-800 dark:text-white uppercase tracking-wider text-[0.65rem]">{{ i18n.translate('workshops.form.workshop_section') }}</h3>
            <p class="text-[0.6rem] text-slate-400 mt-0.5 uppercase font-bold tracking-tight">{{ i18n.translate('users.detail_subtitle') }}</p>
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div class="space-y-1.5">
            <label class="text-[0.65rem] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-1">{{ i18n.translate('workshops.form.name') }}</label>
            <input formControlName="name" type="text" [placeholder]="i18n.translate('workshops.form.name_placeholder')"
                   class="h-11 w-full rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-950/50 px-4 text-sm focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all font-bold outline-none" />
            <p *ngIf="hasError('name', 'required')" class="text-rose-500 text-[0.6rem] font-black pl-1 mt-1 leading-none uppercase tracking-tighter">{{ i18n.translate('common.required_field') }}</p>
          </div>
          <div class="space-y-1.5">
            <label class="text-[0.65rem] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-1">{{ i18n.translate('workshops.form.business_name') }}</label>
            <input formControlName="business_name" type="text" [placeholder]="i18n.translate('workshops.form.business_name_placeholder')"
                   class="h-11 w-full rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-950/50 px-4 text-sm focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all font-bold outline-none" />
            <p *ngIf="hasError('business_name', 'required')" class="text-rose-500 text-[0.6rem] font-black pl-1 mt-1 leading-none uppercase tracking-tighter">{{ i18n.translate('common.required_field') }}</p>
          </div>
          <div class="space-y-1.5">
            <label class="text-[0.65rem] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-1">{{ i18n.translate('workshops.form.ruc_nit') }}</label>
            <input formControlName="ruc_nit" type="text" [placeholder]="i18n.translate('workshops.form.ruc_nit_placeholder')"
                   class="h-11 w-full rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-950/50 px-4 text-sm focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all font-bold outline-none" />
            <p *ngIf="hasError('ruc_nit', 'required')" class="text-rose-500 text-[0.6rem] font-black pl-1 mt-1 leading-none uppercase tracking-tighter">{{ i18n.translate('common.required_field') }}</p>
          </div>
          <div class="space-y-1.5">
            <label class="text-[0.65rem] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-1">{{ i18n.translate('workshops.form.phone') }}</label>
            <input formControlName="phone" type="text" [placeholder]="i18n.translate('workshops.form.phone_placeholder')"
                   class="h-11 w-full rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-950/50 px-4 text-sm focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all font-bold outline-none" />
            <p *ngIf="hasError('phone', 'required')" class="text-rose-500 text-[0.6rem] font-black pl-1 mt-1 leading-none uppercase tracking-tighter">{{ i18n.translate('common.required_field') }}</p>
          </div>
          <div class="md:col-span-2 space-y-1.5">
            <label class="text-[0.65rem] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-1">{{ i18n.translate('workshops.form.address') }}</label>
            <input formControlName="address" type="text" [placeholder]="i18n.translate('workshops.form.address_placeholder')"
                   class="h-11 w-full rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-950/50 px-4 text-sm focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all font-bold outline-none" />
            <p *ngIf="hasError('address', 'required')" class="text-rose-500 text-[0.6rem] font-black pl-1 mt-1 leading-none uppercase tracking-tighter">{{ i18n.translate('common.required_field') }}</p>
          </div>
        </div>
      </div>

      <!-- Section: Owner Info -->
      <div class="space-y-6">
        <div class="flex items-center gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
          <div class="w-8 h-8 rounded-xl bg-cyan-50 dark:bg-cyan-500/10 flex items-center justify-center text-cyan-600 dark:text-cyan-400">
            <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
          </div>
          <div>
            <h3 class="font-black text-slate-800 dark:text-white uppercase tracking-wider text-[0.65rem]">{{ i18n.translate('workshops.form.owner_section') }}</h3>
            <p class="text-[0.6rem] text-slate-400 mt-0.5 uppercase font-bold tracking-tight">{{ i18n.translate('profile.edit_subtitle') }}</p>
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div class="space-y-1.5">
            <label class="text-[0.65rem] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-1">{{ i18n.translate('workshops.form.owner_name') }}</label>
            <input formControlName="owner_name" type="text" [placeholder]="i18n.translate('workshops.form.owner_name_placeholder')"
                   class="h-11 w-full rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-950/50 px-4 text-sm focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all font-bold outline-none" />
            <p *ngIf="hasError('owner_name', 'required')" class="text-rose-500 text-[0.6rem] font-black pl-1 mt-1 leading-none uppercase tracking-tighter">{{ i18n.translate('common.required_field') }}</p>
          </div>
          <div class="space-y-1.5">
            <label class="text-[0.65rem] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-1">{{ i18n.translate('workshops.form.owner_last_name') }}</label>
            <input formControlName="owner_last_name" type="text" [placeholder]="i18n.translate('workshops.form.owner_last_name_placeholder')"
                   class="h-11 w-full rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-950/50 px-4 text-sm focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all font-bold outline-none" />
            <p *ngIf="hasError('owner_last_name', 'required')" class="text-rose-500 text-[0.6rem] font-black pl-1 mt-1 leading-none uppercase tracking-tighter">{{ i18n.translate('common.required_field') }}</p>
          </div>
          <div class="space-y-1.5">
            <label class="text-[0.65rem] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-1">{{ i18n.translate('workshops.form.owner_phone') }}</label>
            <input formControlName="owner_phone" type="text" [placeholder]="i18n.translate('workshops.form.owner_phone_placeholder')"
                   class="h-11 w-full rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-950/50 px-4 text-sm focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all font-bold outline-none" />
            <p *ngIf="hasError('owner_phone', 'required')" class="text-rose-500 text-[0.6rem] font-black pl-1 mt-1 leading-none uppercase tracking-tighter">{{ i18n.translate('common.required_field') }}</p>
          </div>
          <div class="space-y-1.5">
            <label class="text-[0.65rem] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-1">{{ i18n.translate('workshops.form.email') }}</label>
            <input formControlName="email" type="email" [placeholder]="i18n.translate('workshops.form.email_placeholder')"
                   class="h-11 w-full rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-950/50 px-4 text-sm focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all font-bold outline-none" />
            <p *ngIf="hasError('email', 'required')" class="text-rose-500 text-[0.6rem] font-black pl-1 mt-1 leading-none uppercase tracking-tighter">{{ i18n.translate('common.required_field') }}</p>
            <p *ngIf="hasError('email', 'email')" class="text-rose-500 text-[0.6rem] font-black pl-1 mt-1 leading-none uppercase tracking-tighter">{{ i18n.translate('common.invalid_format') }}</p>
          </div>
          <div class="space-y-1.5">
            <label class="text-[0.65rem] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-1">{{ i18n.translate('workshops.form.owner_password') }}</label>
            <input formControlName="owner_password" type="password" placeholder="••••••••"
                   class="h-11 w-full rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-950/50 px-4 text-sm focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all font-bold outline-none" />
            <p *ngIf="hasError('owner_password', 'required')" class="text-rose-500 text-[0.6rem] font-black pl-1 mt-1 leading-none uppercase tracking-tighter">{{ i18n.translate('common.required_short') }}</p>
            <p *ngIf="hasError('owner_password', 'minlength')" class="text-rose-500 text-[0.6rem] font-black pl-1 mt-1 leading-none uppercase tracking-tighter">{{ i18n.translate('users.form.min_length_error', { min: '6' }) }}</p>
          </div>
        </div>
      </div>
    </div>
  `
})
export class RegistrationFormComponent {
  readonly i18n = inject(TranslationService);
  
  form = input.required<FormGroup>();

  hasError(controlName: string, errorName: string): boolean {
    const control = this.form().get(controlName);
    return !!control && control.hasError(errorName) && (control.touched || control.dirty);
  }
}
