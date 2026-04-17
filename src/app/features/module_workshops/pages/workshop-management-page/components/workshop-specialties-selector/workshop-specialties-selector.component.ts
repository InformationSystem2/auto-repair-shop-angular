import { Component, input, output, inject, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Specialty } from '../../../../models/specialty.model';
import { CardComponent } from '@ui/card/card.component';
import { TranslationService } from '@core/services/translation.service';

@Component({
  selector: 'app-workshop-specialties-selector',
  standalone: true,
  imports: [CommonModule, CardComponent],
  template: `
    <app-card class="bg-white/50 dark:bg-slate-900/40 border-none shadow-xl shadow-slate-200/40 dark:shadow-none">
      <div class="p-6">
        <div class="mb-6 flex items-center gap-3">
          <div class="w-8 h-8 rounded-xl bg-indigo-50 dark:bg-indigo-500/10 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
            <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" /></svg>
          </div>
          <div>
            <h3 class="font-black text-slate-800 dark:text-white uppercase tracking-wider text-[0.65rem]">{{ i18n.translate('workshops.specialties') }}</h3>
            <p class="text-[0.6rem] text-slate-400 mt-0.5 uppercase font-bold tracking-tight">{{ i18n.translate('workshops.select_specialties_desc') }}</p>
          </div>
        </div>

        <div class="mb-4">
          <label class="sr-only" for="specialty-search-input">{{ i18n.translate('common.search') }}</label>
          <div class="relative">
            <span class="pointer-events-none absolute inset-y-0 left-3 flex items-center text-slate-400">
              <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m21 21-4.35-4.35m1.6-5.15a6.75 6.75 0 11-13.5 0 6.75 6.75 0 0113.5 0z" />
              </svg>
            </span>
            <input
              id="specialty-search-input"
              type="text"
              [value]="searchTerm()"
              (input)="onSearch($event)"
              [placeholder]="i18n.translate('common.search')"
              class="h-10 w-full rounded-xl border border-slate-200 bg-white/80 pl-9 pr-3 text-sm font-medium text-slate-700 outline-none transition focus:border-indigo-400 focus:ring-2 focus:ring-indigo-500/20 dark:border-slate-700 dark:bg-slate-900/60 dark:text-slate-200"
            />
          </div>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-[180px] sm:max-h-[220px] overflow-y-auto overflow-x-hidden pr-2 custom-scrollbar">
          @for (specialty of filteredSpecialties(); track specialty.id) {
            <div 
                 (click)="toggle.emit(specialty.id)"
                 class="flex items-center gap-3 p-3 rounded-2xl border transition-all cursor-pointer group hover:scale-[1.02]"
                 [class.bg-indigo-600]="selectedIds().includes(specialty.id)"
                 [class.border-indigo-600]="selectedIds().includes(specialty.id)"
                 [class.shadow-lg]="selectedIds().includes(specialty.id)"
                 [class.shadow-indigo-500/20]="selectedIds().includes(specialty.id)"
                 [class.bg-white/50]="!selectedIds().includes(specialty.id)"
                 [class.dark:bg-slate-800/50]="!selectedIds().includes(specialty.id)"
                 [class.border-slate-100]="!selectedIds().includes(specialty.id)"
                 [class.dark:border-slate-800]="!selectedIds().includes(specialty.id)">
              
              <div class="w-4 h-4 rounded-full flex items-center justify-center border-2 transition-all shrink-0"
                   [class.bg-white]="selectedIds().includes(specialty.id)"
                   [class.border-white]="selectedIds().includes(specialty.id)"
                   [class.border-slate-200]="!selectedIds().includes(specialty.id)"
                   [class.dark:border-slate-700]="!selectedIds().includes(specialty.id)">
                @if (selectedIds().includes(specialty.id)) {
                  <svg class="w-2.5 h-2.5 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="4" d="M5 13l4 4L19 7" />
                  </svg>
                }
              </div>

              <span class="text-[0.7rem] font-bold truncate leading-none transition-colors" 
                    [class.text-white]="selectedIds().includes(specialty.id)"
                    [class.text-slate-600]="!selectedIds().includes(specialty.id)"
                    [class.dark:text-slate-300]="!selectedIds().includes(specialty.id)">
                {{ specialty.name }}
              </span>
            </div>
          } @empty {
            <div class="col-span-full rounded-xl border border-dashed border-slate-200 p-4 text-center text-xs font-semibold text-slate-500 dark:border-slate-700 dark:text-slate-400">
              {{ i18n.translate('common.no_results') }}
            </div>
          }
        </div>
      </div>
    </app-card>
  `
})
export class WorkshopSpecialtiesSelectorComponent {
  readonly i18n = inject(TranslationService);
  
  availableSpecialties = input.required<Specialty[]>();
  selectedIds = input<string[]>([]);
  toggle = output<string>();

  readonly searchTerm = signal('');
  readonly filteredSpecialties = computed(() => {
    const term = this.searchTerm().trim().toLowerCase();
    if (!term) return this.availableSpecialties();
    return this.availableSpecialties().filter((specialty) =>
      specialty.name.toLowerCase().includes(term)
    );
  });

  onSearch(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.searchTerm.set(target.value ?? '');
  }
}
