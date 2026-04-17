import { Component, input, output, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Technician } from '../../../../models/technician.model';
import { CardComponent } from '@ui/card/card.component';
import { BadgeComponent } from '@ui/badge/badge.component';
import { ButtonComponent } from '@ui/button/button.component';
import { TranslationService } from '@core/services/translation.service';

@Component({
  selector: 'app-technician-card',
  standalone: true,
  imports: [CommonModule, CardComponent, BadgeComponent, ButtonComponent],
  template: `
    <app-card class="bg-white/50 dark:bg-slate-900/40 border-none shadow-xl shadow-slate-200/40 dark:shadow-none overflow-hidden group relative text-left">
      <!-- Status Badge inside card -->
      <div class="absolute top-5 right-5 z-10">
        <app-badge [variant]="tech().is_available ? 'success' : 'secondary'">
          <span class="text-[0.6rem] font-black uppercase tracking-widest leading-none">
            {{ tech().is_available ? i18n.translate('common.available') : i18n.translate('common.not_available') }}
          </span>
        </app-badge>
      </div>

      <div class="p-8 space-y-6">
        <div class="flex items-center gap-5">
          <div class="w-14 h-14 rounded-2xl bg-indigo-600 flex items-center justify-center text-white font-black text-xl shadow-lg shadow-indigo-500/30 group-hover:scale-105 transition-transform duration-300">
            {{ tech().name[0] }}{{ tech().last_name[0] }}
          </div>
          <div class="space-y-0.5 min-w-0">
            <h3 class="font-black text-slate-900 dark:text-white truncate tracking-tight">{{ tech().name }} {{ tech().last_name }}</h3>
            <div class="flex items-center gap-1.5 opacity-60">
              <span class="w-1.5 h-1.5 rounded-full bg-slate-400"></span>
              <p class="text-[0.65rem] text-slate-500 dark:text-slate-400 font-bold uppercase tracking-[0.2em] truncate">{{ tech().phone }}</p>
            </div>
          </div>
        </div>

        <div class="space-y-3">
          <div class="flex items-center gap-3 p-3 rounded-xl bg-slate-50/50 dark:bg-slate-800/20 border border-slate-100/50 dark:border-slate-800/50">
             <svg class="w-4 h-4 text-slate-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor font-bold">
               <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
             </svg>
             <span class="text-[0.7rem] font-bold text-slate-600 dark:text-slate-400 truncate">{{ tech().email }}</span>
          </div>
        </div>

        <div class="pt-5 border-t border-slate-100 dark:border-slate-800 flex items-center gap-3">
          <button 
            appButton 
            (click)="edit.emit(tech())" 
            variant="ghost" 
            class="flex-1 h-11 rounded-xl bg-slate-100 dark:bg-slate-800/50 hover:bg-slate-200 dark:hover:bg-slate-800"
          >
            <span class="text-[0.65rem] font-black uppercase tracking-widest">{{ i18n.translate('common.edit') }}</span>
          </button>
          
          <button 
            (click)="delete.emit(tech())"
            class="flex items-center justify-center w-11 h-11 text-rose-500 bg-rose-50/50 dark:bg-rose-500/5 hover:bg-rose-600 hover:text-white rounded-xl transition-all shadow-sm active:scale-95"
          >
            <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor font-bold">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      </div>
    </app-card>
  `
})
export class TechnicianCardComponent {
  readonly i18n = inject(TranslationService);
  
  tech = input.required<Technician>();
  edit = output<Technician>();
  delete = output<Technician>();
}
