import { Component, inject, input, ChangeDetectionStrategy } from '@angular/core';
import { UpperCasePipe } from '@angular/common';
import { User } from '@users/models/user.model';
import { TranslationService } from '@core/services/translation.service';
@Component({
  selector: 'app-profile-header',
  imports: [UpperCasePipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="relative overflow-hidden rounded-3xl p-8 flex flex-col sm:flex-row items-center gap-6 sm:gap-8 transition-all hover:shadow-2xl group" style="background-color: var(--ds-card); border: 1px solid var(--ds-border); box-shadow: 0 4px 20px var(--ds-shadow);">
      <div class="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-purple-500/5 z-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>

      <div class="relative z-10 w-28 h-28 shrink-0 rounded-[2rem] bg-gradient-to-tr from-indigo-600 to-purple-500 flex items-center justify-center text-white text-4xl font-black shadow-xl shadow-indigo-500/30 ring-4 transform transition-transform duration-500 group-hover:scale-105 group-hover:-rotate-3" style="ring-color: var(--ds-bg);">
        {{ user().name[0] | uppercase }}{{ user().last_name[0] | uppercase }}
      </div>

      <div class="relative z-10 text-center sm:text-left flex-1">
        <h2 class="text-3xl font-extrabold tracking-tight" style="color: var(--ds-text);">
          {{ user().name }} {{ user().last_name }}
        </h2>
        <p class="text-indigo-600 dark:text-indigo-400 font-bold tracking-wide mt-1.5 text-sm uppercase letter-spacing-1">
          {{ '@' + user().username }}
        </p>

        <div class="mt-5 flex flex-wrap justify-center sm:justify-start gap-2.5">
          <span [class]="user().is_active
            ? 'inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/20 shadow-sm transition-colors'
            : 'inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-500/20 shadow-sm transition-colors'">
            <span class="relative flex h-2.5 w-2.5">
              <span [class]="user().is_active ? 'animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75' : 'hidden'"></span>
              <span class="relative inline-flex rounded-full h-2.5 w-2.5" [class]="user().is_active ? 'bg-emerald-500' : 'bg-red-500'"></span>
            </span>
            {{ user().is_active ? i18n.translate('profile.active_account') : i18n.translate('profile.inactive_account') }}
          </span>

          @for (role of user().roles; track role.id) {
            <span class="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 shadow-sm hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">
              <svg class="w-3.5 h-3.5 mr-1.5 text-slate-400 dark:text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
              {{ role.name | uppercase }}
            </span>
          }
        </div>
      </div>
    </div>
  `
})
export class ProfileHeaderComponent {
  readonly user = input.required<User>();
  readonly i18n = inject(TranslationService);
}
