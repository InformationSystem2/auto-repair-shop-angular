import { Component, input, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardComponent } from '@ui/card/card.component';
import { TranslationService } from '@core/services/translation.service';

@Component({
  selector: 'app-workshop-stats',
  standalone: true,
  imports: [CommonModule, CardComponent],
  template: `
    <app-card class="bg-indigo-600 dark:bg-indigo-500/10 text-white dark:text-indigo-400 border-none shadow-xl shadow-indigo-500/20 dark:shadow-none overflow-hidden relative">
      <!-- Decorative background pattern -->
      <div class="absolute right-0 top-0 -mr-4 -mt-4 w-24 h-24 bg-white/10 dark:bg-indigo-400/10 rounded-full blur-2xl"></div>
      
      <div class="p-6 relative">
        <div class="flex items-center gap-2 mb-6">
          <div class="w-6 h-6 rounded-lg bg-white/20 dark:bg-indigo-400/20 flex items-center justify-center">
            <svg class="w-3.5 h-3.5 text-white dark:text-indigo-300" fill="none" viewBox="0 0 24 24" stroke="currentColor font-bold">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
          </div>
          <h4 class="text-[0.65rem] font-black uppercase tracking-[0.2em] opacity-80">{{ i18n.translate('workshops.stats_title') }}</h4>
        </div>

        <div class="grid grid-cols-2 gap-y-6 gap-x-4">
          <div class="space-y-0.5">
            <span class="text-3xl font-black tracking-tighter">{{ rating() }}</span>
            <p class="text-[0.6rem] uppercase font-black opacity-60 tracking-widest leading-none">{{ i18n.translate('workshops.stat_rating') }}</p>
          </div>
          <div class="space-y-0.5">
            <span class="text-3xl font-black tracking-tighter">{{ totalServices() }}</span>
            <p class="text-[0.6rem] uppercase font-black opacity-60 tracking-widest leading-none">{{ i18n.translate('workshops.stat_services') }}</p>
          </div>
          <div class="col-span-2 pt-2 border-t border-white/10 dark:border-indigo-400/10 flex items-center justify-between">
            <div class="flex -space-x-2">
              <div *ngFor="let i of [1,2,3]" class="w-6 h-6 rounded-full border-2 border-indigo-600 dark:border-slate-900 bg-slate-200 dark:bg-slate-800"></div>
            </div>
            <div class="text-right">
              <span class="text-lg font-black block leading-none">{{ technicianCount() }}</span>
              <p class="text-[0.55rem] uppercase font-black opacity-60 tracking-widest">{{ i18n.translate('workshops.stat_techs') }}</p>
            </div>
          </div>

          <div class="col-span-2 pt-2 border-t border-white/10 dark:border-indigo-400/10 grid grid-cols-2 gap-4">
            <div>
              <span class="text-lg font-black block leading-none">{{ rejectionCount() }}</span>
              <p class="text-[0.55rem] uppercase font-black opacity-60 tracking-widest">{{ i18n.translate('workshops.stat_rejections') }}</p>
            </div>
            <div class="text-right">
              <span class="text-lg font-black block leading-none">{{ rejectionRate() | number:'1.0-2' }}%</span>
              <p class="text-[0.55rem] uppercase font-black opacity-60 tracking-widest">{{ i18n.translate('workshops.stat_rejection_rate') }}</p>
            </div>
          </div>
        </div>
      </div>
    </app-card>
  `
})
export class WorkshopStatsComponent {
  readonly i18n = inject(TranslationService);
  
  rating = input<string | number>('0.0');
  totalServices = input<number>(0);
  technicianCount = input<number>(0);
  rejectionCount = input<number>(0);
  rejectionRate = input<number>(0);
}
