import { Component, inject, input, output, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { ReactiveFormsModule, Validators, FormGroup, FormBuilder } from '@angular/forms';
import { User, UserUpdate } from '@users/models/user.model';
import { ButtonComponent } from '@shared/components/ui/button/button.component';
import { InputDirective } from '@shared/components/ui/input/input.component';
import { TranslationService } from '@core/services/translation.service';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import { heroUser, heroUsers, heroPhone, heroLockClosed, heroPencilSquare, heroShieldCheck, heroCheck } from '@ng-icons/heroicons/outline';
@Component({
  selector: 'app-profile-edit-form',
  imports: [ReactiveFormsModule, ButtonComponent, InputDirective, NgIconComponent],
  providers: [provideIcons({ heroUser, heroUsers, heroPhone, heroLockClosed, heroPencilSquare, heroShieldCheck, heroCheck })],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="w-full rounded-[2rem] overflow-hidden relative transition-all duration-300" style="background-color: var(--ds-card); border: 1px solid var(--ds-border); box-shadow: 0 4px 20px var(--ds-shadow);">
      <div class="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 opacity-90"></div>

      <div class="px-8 sm:px-10 py-7" style="border-bottom: 1px solid var(--ds-border);">
        <h3 class="text-2xl font-black flex items-center gap-2.5" style="color: var(--ds-text);">
          <span class="p-2 rounded-xl flex items-center justify-center text-slate-400 dark:text-slate-500" style="background-color: color-mix(in srgb, var(--ds-blue) 15%, transparent); color: var(--ds-blue);">
            <ng-icon name="heroPencilSquare" class="w-6 h-6"></ng-icon>
          </span>
          {{ i18n.translate('profile.edit_title') }}
        </h3>
        <p class="mt-2 font-medium" style="color: var(--ds-subtext);">{{ i18n.translate('profile.edit_subtitle') }}</p>
      </div>
      <form [formGroup]="form" (ngSubmit)="onSubmit()" class="px-8 sm:px-10 py-8 space-y-8">
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-7">

          <!-- Name -->
          <div class="space-y-3 col-span-1 sm:col-span-2 md:col-span-1">
            <label class="block text-sm font-bold ml-1" style="color: var(--ds-text);">{{ i18n.translate('users.form.first_name') }}</label>
            <div class="relative group">
              <div class="absolute z-10 inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 dark:text-slate-500 group-focus-within:text-indigo-500 transition-colors">
                <ng-icon name="heroUser" class="w-5 h-5"></ng-icon>
              </div>
              <input appInput type="text" formControlName="name" class="pl-12" [placeholder]="i18n.translate('users.form.first_name')" />
            </div>
          </div>
          <!-- Last Name -->
          <div class="space-y-3">
            <label class="block text-sm font-bold ml-1" style="color: var(--ds-text);">{{ i18n.translate('users.form.last_name') }}</label>
            <div class="relative group">
              <div class="absolute z-10 inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 dark:text-slate-500 group-focus-within:text-indigo-500 transition-colors">
                <ng-icon name="heroUsers" class="w-5 h-5"></ng-icon>
              </div>
              <input appInput type="text" formControlName="last_name" class="pl-12" [placeholder]="i18n.translate('users.form.last_name')" />
            </div>
          </div>
          <!-- Phone -->
          <div class="space-y-3">
            <label class="block text-sm font-bold ml-1" style="color: var(--ds-text);">{{ i18n.translate('users.form.phone') }}</label>
            <div class="relative group">
              <div class="absolute z-10 inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 dark:text-slate-500 group-focus-within:text-indigo-500 transition-colors">
                <ng-icon name="heroPhone" class="w-5 h-5"></ng-icon>
              </div>
              <input appInput type="tel" formControlName="phone" class="pl-12" placeholder="+123456789" />
            </div>
          </div>
          <!-- Password -->
          <div class="space-y-3">
            <label class="block text-sm font-bold ml-1" style="color: var(--ds-text);">{{ i18n.translate('users.form.password') }}</label>
            <div class="relative group">
              <div class="absolute z-10 inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 dark:text-slate-500 group-focus-within:text-indigo-500 transition-colors">
                <ng-icon name="heroLockClosed" class="w-5 h-5"></ng-icon>
              </div>
              <input appInput type="password" formControlName="password" class="pl-12" [placeholder]="i18n.translate('users.form.password_hint')" />
            </div>
          </div>
        </div>
        <!-- Actions -->
        <div class="pt-8 flex flex-col sm:flex-row items-center justify-between gap-5" style="border-top: 1px solid var(--ds-border);">
          <div class="text-sm font-semibold flex items-center gap-2" style="color: var(--ds-subtext);">
            <ng-icon name="heroShieldCheck" class="w-5 h-5 text-emerald-500"></ng-icon>
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
                <ng-icon name="heroCheck" class="w-5 h-5 mr-1"></ng-icon>
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
