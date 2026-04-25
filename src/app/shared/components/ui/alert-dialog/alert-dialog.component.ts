import { Component, input, output, inject } from '@angular/core';
import { TranslationService } from '@core/services/translation.service';

@Component({
  selector: 'app-alert-dialog',
  standalone: true,
  imports: [],
  template: `
    <div class="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm transition-all animate-in fade-in duration-300" (click)="cancel.emit()"></div>
    
    <div class="fixed left-1/2 top-1/2 z-[110] w-[calc(100%-2rem)] max-w-[380px] -translate-x-1/2 -translate-y-1/2 animate-in zoom-in-95 duration-300">
      <div class="ds-card overflow-hidden shadow-2xl shadow-black/50 border-white/10">
        <!-- Accent line -->
        <div class="h-1 bg-gradient-to-r from-rose-500 via-pink-500 to-orange-500 opacity-80"></div>
        
        <div class="p-8 text-center">
          <!-- Icon -->
          <div class="w-16 h-16 rounded-[1.5rem] bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-500 mx-auto mb-6">
            <svg class="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          
          <h2 class="text-xl font-black tracking-tight mb-2" style="color:var(--ds-text)">
            {{ title() }}
          </h2>
          <p class="text-[11px] font-bold leading-relaxed opacity-50 uppercase tracking-wide" style="color:var(--ds-subtext)">
            {{ description() }}
          </p>
        </div>

        <div class="p-6 pt-0 flex gap-3">
          <button (click)="cancel.emit()" class="ds-btn-ghost flex-1 h-11 rounded-xl">
            {{ cancelText() }}
          </button>
          <button (click)="confirm.emit()" class="ds-btn-primary !bg-rose-500 flex-1 h-11 rounded-xl shadow-lg shadow-rose-500/20">
            <span class="uppercase tracking-widest text-[10px] font-black">{{ confirmText() }}</span>
          </button>
        </div>
      </div>
    </div>
  `
})
export class AlertDialogComponent {
  private i18n = inject(TranslationService);

  title = input<string>(this.i18n.translate('common_ui.confirm_title'));
  description = input<string>(this.i18n.translate('common_ui.confirm_description'));
  cancelText = input<string>(this.i18n.translate('common.cancel'));
  confirmText = input<string>(this.i18n.translate('common.confirm'));

  confirm = output<void>();
  cancel = output<void>();
}
