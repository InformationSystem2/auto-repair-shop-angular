import {
  Component,
  inject,
  Input,
  OnDestroy,
  OnInit,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslationService } from '@core/services/translation.service';
import { ToastService, Toast } from '@core/services/toast.service';

// ─── Individual Toast Item ────────────────────────────────────────────────────

@Component({
  selector: 'app-toast-item',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div
      class="overflow-hidden rounded-2xl border border-white/60 dark:border-slate-700/80 bg-white/70 backdrop-blur-2xl shadow-xl hover:shadow-2xl dark:shadow-[0_0_30px_-15px_rgba(0,0,0,0.5)] dark:bg-slate-900/60 w-full transition-all duration-300"
      [ngClass]="borderClass"
      (mouseenter)="pause()"
      (mouseleave)="resume()"
    >
      <!-- Content -->
      <div class="flex items-start gap-3 p-4">
        <!-- Icon -->
        <div class="shrink-0 pt-0.5" [ngClass]="iconClass">
          @switch (toast.type) {
            @case ('success') {
              <svg class="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
              </svg>
            }
            @case ('error') {
              <svg class="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd"/>
              </svg>
            }
            @case ('warning') {
              <svg class="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd"/>
              </svg>
            }
            @case ('info') {
              <svg class="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd"/>
              </svg>
            }
          }
        </div>

        <!-- Text -->
        <div class="min-w-0 flex-1">
          <h4 class="text-sm font-semibold text-slate-900 dark:text-slate-100">{{ toast.title }}</h4>
          @if (toast.message) {
            <p class="mt-1 text-sm text-slate-600 dark:text-slate-300">{{ toast.message }}</p>
          }
        </div>

        <!-- Close button -->
        <button
          class="shrink-0 rounded p-1 text-slate-500 transition hover:bg-slate-100 hover:text-slate-800 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-200"
          (click)="toastSvc.remove(toast.id)"
          [attr.aria-label]="i18n.translate('common_ui.close_notification')"
        >
          <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/>
          </svg>
        </button>
      </div>

      <!-- Progress bar -->
      <div class="h-0.5 bg-slate-100 dark:bg-slate-800">
        <div
          class="h-full transition-[width] duration-100 ease-linear"
          [ngClass]="progressClass"
          [style.width.%]="progress()"
        ></div>
      </div>
    </div>
  `,
})
export class ToastItemComponent implements OnInit, OnDestroy {
  @Input({ required: true }) toast!: Toast;

  public readonly toastSvc = inject(ToastService);
  protected readonly i18n = inject(TranslationService);
  readonly progress = signal(100);

  private intervalId: ReturnType<typeof setInterval> | null = null;
  private paused = false;

  get borderClass(): string {
    const map: Record<string, string> = {
      success: 'border-l-4 border-l-emerald-500',
      error:   'border-l-4 border-l-rose-500',
      warning: 'border-l-4 border-l-amber-500',
      info:    'border-l-4 border-l-sky-500',
    };
    return map[this.toast.type] ?? '';
  }

  get iconClass(): string {
    const map: Record<string, string> = {
      success: 'text-emerald-500',
      error:   'text-rose-500',
      warning: 'text-amber-500',
      info:    'text-sky-500',
    };
    return map[this.toast.type] ?? '';
  }

  get progressClass(): string {
    const map: Record<string, string> = {
      success: 'bg-emerald-500',
      error:   'bg-rose-500',
      warning: 'bg-amber-500',
      info:    'bg-sky-500',
    };
    return map[this.toast.type] ?? 'bg-slate-500';
  }

  ngOnInit(): void {
    const step = 100 / (this.toast.duration / 100);
    this.intervalId = setInterval(() => {
      if (this.paused) return;
      const next = this.progress() - step;
      if (next <= 0) {
        this.toastSvc.remove(this.toast.id);
        return;
      }
      this.progress.set(next);
    }, 100);
  }

  ngOnDestroy(): void {
    if (this.intervalId) clearInterval(this.intervalId);
  }

  pause():  void { this.paused = true; }
  resume(): void { this.paused = false; }
}

// ─── Toaster Container ────────────────────────────────────────────────────────

@Component({
  selector: 'app-toaster',
  standalone: true,
  imports: [CommonModule, ToastItemComponent],
  template: `
    <div class="fixed right-2 top-2 z-[9999] flex w-[calc(100%-1rem)] max-w-sm flex-col gap-3 sm:right-4 sm:top-4 sm:w-full pointer-events-none">
      @for (toast of toastSvc.toasts(); track toast.id) {
        <div class="pointer-events-auto">
          <app-toast-item [toast]="toast" />
        </div>
      }
    </div>
  `,
})
export class ToasterComponent {
  public readonly toastSvc = inject(ToastService);
}
