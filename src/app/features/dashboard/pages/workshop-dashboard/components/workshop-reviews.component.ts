import { Component, Input, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslationService } from '@core/services/translation.service';

@Component({
  selector: 'app-workshop-reviews',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="reviews-container">
      <div class="flex items-center justify-between mb-4">
        <h2 class="text-sm font-bold" style="color:var(--ds-text)">
          {{ i18n.translate('dashboard.workshop.reviews_title') }}
        </h2>
        <div class="flex items-center gap-2">
          <span class="ds-badge ds-badge-blue">{{ reviews.length }}</span>
          <button (click)="toggleAllComments()" class="text-[10px] font-bold uppercase tracking-wider hover:opacity-70 transition-opacity" style="color:var(--ds-blue)">
            {{ showAllComments() ? i18n.translate('dashboard.workshop.hide_comments') : i18n.translate('dashboard.workshop.show_comments') }}
          </button>
        </div>
      </div>

      @if (reviews.length === 0) {
        <div class="ds-card p-8 text-center">
          <p class="text-xs font-medium" style="color:var(--ds-subtext)">
            {{ i18n.translate('dashboard.workshop.no_reviews') }}
          </p>
        </div>
      } @else {
        <div class="space-y-3">
          @for (review of reviews; track review.id) {
            <div class="ds-card p-4 transition-all duration-300 hover:translate-x-1" 
                 style="background:var(--ds-card-hi); border-left: 3px solid var(--ds-blue)">
              <div class="flex justify-between items-start gap-3">
                <div class="min-w-0 flex-1">
                  <div class="flex items-center gap-2 flex-wrap">
                    <span class="text-xs font-black" style="color:var(--ds-text)">{{ review.client_name }}</span>
                    <span class="text-[10px] font-bold" style="color:var(--ds-overlay0)">{{ review.created_at | date:'short' }}</span>
                  </div>
                  
                  <div class="flex items-center gap-0.5 my-1.5">
                    @for (star of [1,2,3,4,5]; track star) {
                      <svg class="w-3.5 h-3.5" [style.fill]="star <= review.score ? '#FBBF24' : 'var(--ds-surface0)'" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                      </svg>
                    }
                  </div>

                  @if (review.comment && showAllComments()) {
                    <p class="text-xs leading-relaxed mt-2 p-2.5 rounded-lg italic" 
                       style="background:var(--ds-mantle); color:var(--ds-subtext); border-left: 2px solid var(--ds-surface1)">
                      "{{ review.comment }}"
                    </p>
                  }

                  <div class="mt-3 flex gap-3 flex-wrap">
                    <div class="flex items-center gap-1.5">
                      <span class="text-[10px] font-bold uppercase tracking-tight" style="color:var(--ds-overlay0)">
                        {{ i18n.translate('dashboard.workshop.time_label') }}
                      </span>
                      <span class="text-[10px] font-black px-1.5 py-0.5 rounded" 
                            style="background:var(--ds-surface0); color:var(--ds-blue)">
                        {{ review.response_time_score }}/5
                      </span>
                    </div>
                    <div class="flex items-center gap-1.5">
                      <span class="text-[10px] font-bold uppercase tracking-tight" style="color:var(--ds-overlay0)">
                        {{ i18n.translate('dashboard.workshop.quality_label') }}
                      </span>
                      <span class="text-[10px] font-black px-1.5 py-0.5 rounded" 
                            style="background:var(--ds-surface0); color:var(--ds-green)">
                        {{ review.quality_score }}/5
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          }
        </div>
      }
    </div>
  `,
  styles: [`
    :host { display: block; }
  `]
})
export class WorkshopReviewsComponent {
  @Input() reviews: any[] = [];
  public i18n = inject(TranslationService);
  public showAllComments = signal(true);

  toggleAllComments() {
    this.showAllComments.update(v => !v);
  }
}
