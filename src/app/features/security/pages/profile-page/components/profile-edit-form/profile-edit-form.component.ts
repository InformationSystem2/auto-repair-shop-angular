import { Component, inject, input, output, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { ReactiveFormsModule, Validators, FormGroup, FormBuilder } from '@angular/forms';
import { User, UserUpdate } from '@users/models/user.model';
import { ButtonComponent } from '@shared/components/ui/button/button.component';
import { InputDirective } from '@shared/components/ui/input/input.component';
import { TranslationService } from '@core/services/translation.service';
@Component({
  selector: 'app-profile-edit-form',
  imports: [ReactiveFormsModule, ButtonComponent, InputDirective],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="w-full bg-white/70 dark:bg-slate-900/70 backdrop-blur-3xl rounded-[2rem] shadow-2xl shadow-slate-200/50 dark:shadow-[0_0_40px_-15px_rgba(0,0,0,0.5)] border border-white/50 dark:border-slate-800/80 overflow-hidden relative transition-all duration-300">
      <div class="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 opacity-90"></div>

      <div class="px-8 sm:px-10 py-7 border-b border-slate-200/50 dark:border-slate-800/50">
        <h3 class="text-2xl font-black text-slate-800 dark:text-slate-100 flex items-center gap-2.5">
          <span class="p-2 bg-indigo-100 dark:bg-indigo-500/20 rounded-xl text-indigo-600 dark:text-indigo-400">
            <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
          </span>
          {{ i18n.translate('profile.edit_title') }}
        </h3>
        <p class="text-slate-500 dark:text-slate-400 mt-2 font-medium">{{ i18n.translate('profile.edit_subtitle') }}</p>
      </div>
      <form [formGroup]="form" (ngSubmit)="onSubmit()" class="px-8 sm:px-10 py-8 space-y-8">
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-7">

          <!-- Name -->
          <div class="space-y-3 col-span-1 sm:col-span-2 md:col-span-1">
            <label class="block text-sm font-bold text-slate-700 dark:text-slate-300 ml-1">{{ i18n.translate('users.form.first_name') }}</label>
            <div class="relative group">
              <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-indigo-500 transition-colors">
                <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
              </div>
              <input appInput type="text" formControlName="name" class="pl-12" [placeholder]="i18n.translate('users.form.first_name')" />
            </div>
          </div>
          <!-- Last Name -->
          <div class="space-y-3">
            <label class="block text-sm font-bold text-slate-700 dark:text-slate-300 ml-1">{{ i18n.translate('users.form.last_name') }}</label>
            <div class="relative group">
              <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-indigo-500 transition-colors">
                <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
              </div>
              <input appInput type="text" formControlName="last_name" class="pl-12" [placeholder]="i18n.translate('users.form.last_name')" />
            </div>
          </div>
          <!-- Phone -->
          <div class="space-y-3">
            <label class="block text-sm font-bold text-slate-700 dark:text-slate-300 ml-1">{{ i18n.translate('users.form.phone') }}</label>
            <div class="relative group">
              <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-indigo-500 transition-colors">
                <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
              </div>
              <input appInput type="tel" formControlName="phone" class="pl-12" placeholder="+123456789" />
            </div>
          </div>
          <!-- Password -->
          <div class="space-y-3">
            <label class="block text-sm font-bold text-slate-700 dark:text-slate-300 ml-1">{{ i18n.translate('users.form.password') }}</label>
            <div class="relative group">
              <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-indigo-500 transition-colors">
                <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
              </div>
              <input appInput type="password" formControlName="password" class="pl-12" [placeholder]="i18n.translate('users.form.password_hint')" />
            </div>
          </div>
        </div>
        <!-- Actions -->
        <div class="pt-8 border-t border-slate-200/60 dark:border-slate-800/60 flex flex-col sm:flex-row items-center justify-between gap-5">
          <div class="text-sm font-semibold text-slate-500 dark:text-slate-400 flex items-center gap-2">
            <svg class="w-5 h-5 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
            <span>{{ i18n.translate('profile.secure_note') }}</span>
          </div>
          <button appButton type="submit" [disabled]="form.invalid || saving()"
                  class="relative inline-flex items-center justify-center border-0 px-10 py-4 text-sm font-bold text-white transition-all duration-300 bg-indigo-600 rounded-2xl hover:bg-indigo-500 hover:shadow-xl hover:shadow-indigo-500/40 hover:-translate-y-1 focus:outline-none focus:ring-4 focus:ring-indigo-500/30 disabled:opacity-50 disabled:hover:translate-y-0 disabled:hover:shadow-none disabled:cursor-not-allowed overflow-hidden group w-full sm:w-auto h-auto">
            <div class="absolute inset-0 w-0 bg-white/20 transition-all duration-[300ms] ease-out group-hover:w-full"></div>
            <span class="relative flex items-center gap-2">
              @if(saving()) {
                <svg class="animate-spin -ml-1 mr-2 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                </svg>
                {{ i18n.translate('profile.saving') }}
              } @else {
                <svg class="w-5 h-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7" /></svg>
                {{ i18n.translate('profile.save_changes') }}
              }
            </span>
          </button>
        </div>
      </form>
    </div>
  `
})
export class ProfileEditFormComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  readonly i18n = inject(TranslationService);

  user = input.required<User>();
  saving = input<boolean>(false);
  save = output<UserUpdate>();

  readonly form: FormGroup = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(2)]],
    last_name: ['', [Validators.required, Validators.minLength(2)]],
    phone: ['', [Validators.pattern(/^$|^\+?[0-9\s()-]{7,20}$/)]],
    password: ['', [Validators.minLength(8)]]
  });

  ngOnInit() {
    this.form.patchValue({
      name: this.user().name,
      last_name: this.user().last_name,
      phone: this.user().phone
    });
  }

  onSubmit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const v = this.form.value;
    const payload: UserUpdate = {
      name: v.name,
      last_name: v.last_name,
      phone: v.phone || null
    };
    if (v.password) {
      payload.password = v.password;
    }
    this.save.emit(payload);
  }
}
