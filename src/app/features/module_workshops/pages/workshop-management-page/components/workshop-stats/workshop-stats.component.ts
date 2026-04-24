import { Component, input, inject } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TranslationService } from '@core/services/translation.service';

@Component({
  selector: 'app-workshop-stats',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="grid grid-cols-2 lg:grid-cols-4 gap-4">
      <!-- RATING CARD -->
      <div class="rounded-xl p-5 relative overflow-hidden group border shadow-sm transition-all duration-300 hover:shadow-md" style="background-color: var(--ds-card); border-color: var(--ds-border);">
        <div class="flex items-start justify-between mb-2">
          <p class="text-[10px] font-bold uppercase tracking-widest opacity-60" style="color: var(--ds-subtext);">{{ i18n.translate('workshops.stat_rating') }}</p>
          <div class="w-6 h-6 rounded-lg flex items-center justify-center opacity-20" style="background-color: var(--ds-yellow); color: var(--ds-yellow);">
            <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
          </div>
        </div>
        <div class="flex items-baseline gap-1.5">
          <span class="text-2xl font-black" style="color: var(--ds-text);">{{ rating() }}</span>
          <span class="text-xs font-bold" style="color: var(--ds-yellow);">★</span>
        </div>
      </div>

      <!-- SERVICES CARD -->
      <div class="rounded-xl p-5 relative overflow-hidden group border shadow-sm transition-all duration-300 hover:shadow-md" style="background-color: var(--ds-card); border-color: var(--ds-border);">
        <div class="flex items-start justify-between mb-2">
          <p class="text-[10px] font-bold uppercase tracking-widest opacity-60" style="color: var(--ds-subtext);">{{ i18n.translate('workshops.stat_services') }}</p>
          <div class="w-6 h-6 rounded-lg flex items-center justify-center opacity-20" style="background-color: var(--ds-blue); color: var(--ds-blue);">
            <svg class="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>
          </div>
        </div>
        <span class="text-2xl font-black" style="color: var(--ds-text);">{{ totalServices() }}</span>
      </div>

      <!-- TECHNICIANS CARD -->
      <div class="rounded-xl p-5 relative overflow-hidden group border shadow-sm transition-all duration-300 hover:shadow-md" style="background-color: var(--ds-card); border-color: var(--ds-border);">
        <div class="flex items-start justify-between mb-2">
          <p class="text-[10px] font-bold uppercase tracking-widest opacity-60" style="color: var(--ds-subtext);">{{ i18n.translate('workshops.stat_techs') }}</p>
          <div class="w-6 h-6 rounded-lg flex items-center justify-center opacity-20" style="background-color: var(--ds-mauve); color: var(--ds-mauve);">
            <svg class="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
          </div>
        </div>
        <span class="text-2xl font-black" style="color: var(--ds-text);">{{ technicianCount() }}</span>
      </div>

      <!-- REJECTION RATE CARD -->
      <div class="rounded-xl p-5 relative overflow-hidden group border shadow-sm transition-all duration-300 hover:shadow-md" style="background-color: var(--ds-card); border-color: var(--ds-border);">
        <div class="flex items-start justify-between mb-2">
          <p class="text-[10px] font-bold uppercase tracking-widest opacity-60" style="color: var(--ds-subtext);">{{ i18n.translate('workshops.stat_rejection_rate') }}</p>
          <div class="w-6 h-6 rounded-lg flex items-center justify-center opacity-20" style="background-color: var(--ds-red); color: var(--ds-red);">
            <svg class="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M6 18L18 6M6 6l12 12" /></svg>
          </div>
        </div>
        <div class="flex items-baseline gap-1">
          <span class="text-2xl font-black" style="color: var(--ds-text);">{{ rejectionRate() | number:'1.0-1' }}</span>
          <span class="text-xs font-bold opacity-40" style="color: var(--ds-subtext);">%</span>
        </div>
      </div>
    </div>
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
