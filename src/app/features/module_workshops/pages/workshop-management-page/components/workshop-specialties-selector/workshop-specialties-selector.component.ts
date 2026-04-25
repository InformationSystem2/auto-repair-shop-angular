import { Component, input, output, inject, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Specialty } from '../../../../models/specialty.model';

import { TranslationService } from '@core/services/translation.service';

@Component({
  selector: 'app-workshop-specialties-selector',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="rounded-xl p-8 h-full flex flex-col" style="background-color: var(--ds-card); border: 1px solid var(--ds-border); box-shadow: 0 4px 20px var(--ds-shadow);">
      <div class="flex items-center gap-4 mb-8">
        <div class="w-10 h-10 rounded-lg flex items-center justify-center text-indigo-400" style="background-color: var(--ds-surface0);">
          <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" /></svg>
        </div>
        <div>
          <h3 class="text-lg font-bold" style="color: var(--ds-text);">{{ i18n.translate('workshops.specialties') }}</h3>
          <p class="text-xs" style="color: var(--ds-subtext);">{{ i18n.translate('workshops.select_specialties_desc') }}</p>
        </div>
      </div>

      <div class="mb-6">
        <div class="relative group">
          <span class="pointer-events-none absolute inset-y-0 left-4 flex items-center transition-colors" style="color: var(--ds-overlay0);">
            <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="m21 21-4.35-4.35m1.6-5.15a6.75 6.75 0 11-13.5 0 6.75 6.75 0 0113.5 0z" />
            </svg>
          </span>
          <input
            id="specialty-search-input"
            type="text"
            [value]="searchTerm()"
            (input)="onSearch($event)"
            [placeholder]="i18n.translate('common.search')"
            class="h-10 w-full rounded-lg border pl-11 pr-4 text-sm focus:ring-2 focus:ring-indigo-500/20 transition-all outline-none" 
            style="background-color: var(--ds-card-hi); border-color: var(--ds-border-sub); color: var(--ds-text);"
          />
        </div>
      </div>

      <div class="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-3 overflow-y-auto pr-2 custom-scrollbar">
        @for (specialty of filteredSpecialties(); track specialty.id) {
          <div 
               (click)="toggle.emit(specialty.id)"
               class="flex items-center gap-3 p-3 rounded-lg border transition-all cursor-pointer group active:scale-[0.98] select-none"
               [style.background-color]="selectedIds().includes(specialty.id) ? 'var(--ds-surface0)' : 'var(--ds-card-hi)'"
               [style.border-color]="selectedIds().includes(specialty.id) ? 'var(--ds-blue)' : 'var(--ds-border-sub)'">
            
            <div class="w-5 h-5 rounded-md flex items-center justify-center border transition-all shrink-0"
                 [style.background-color]="selectedIds().includes(specialty.id) ? 'var(--ds-blue)' : 'transparent'"
                 [style.border-color]="selectedIds().includes(specialty.id) ? 'var(--ds-blue)' : 'var(--ds-overlay0)'">
              @if (selectedIds().includes(specialty.id)) {
                <svg class="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3.5" d="M5 13l4 4L19 7" />
                </svg>
              }
            </div>

            <span class="text-xs font-bold uppercase tracking-tight truncate transition-colors" 
                  [style.color]="selectedIds().includes(specialty.id) ? 'var(--ds-text)' : 'var(--ds-subtext)'">
              {{ specialty.name }}
            </span>
          </div>
        } @empty {
          <div class="col-span-full rounded-lg border border-dashed p-8 text-center text-xs font-bold" 
               style="border-color: var(--ds-border); color: var(--ds-subtext);">
            {{ i18n.translate('common.no_results') }}
          </div>
        }
      </div>
    </div>
  `
})
export class WorkshopSpecialtiesSelectorComponent {
  readonly i18n = inject(TranslationService);
  
  availableSpecialties = input.required<Specialty[]>();
  selectedIds = input<number[]>([]);
  toggle = output<number>();

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
