import { Component, computed, input } from '@angular/core';
import { cn } from '@lib/utils';

export type ButtonVariant = 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
export type ButtonSize = 'default' | 'sm' | 'lg' | 'icon';

@Component({
  selector: 'button[appButton], a[appButton]',
  standalone: true,
  template: `<ng-content></ng-content>`,
  host: {
    '[class]': 'classes()',
    '[attr.disabled]': 'disabled() ? true : null'
  }
})
export class ButtonComponent {
  variant = input<ButtonVariant>('default');
  size = input<ButtonSize>('default');
  userClass = input<string>('', { alias: 'class' });
  disabled = input<boolean>(false);

  classes = computed(() => {
    return cn(
      'inline-flex items-center justify-center whitespace-nowrap rounded-2xl text-sm font-bold transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 active:scale-[0.98]',
      {
        'text-white hover:shadow-lg hover:-translate-y-0.5 border border-transparent': this.variant() === 'default',
        'shadow-indigo-500/20': this.variant() === 'default',
        'bg-red-500 text-white hover:bg-red-400 hover:shadow-lg hover:shadow-red-500/40 hover:-translate-y-0.5': this.variant() === 'destructive',
        'border border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/50 backdrop-blur hover:bg-slate-100 hover:text-slate-900 dark:hover:bg-slate-800 dark:hover:text-slate-50 shadow-sm': this.variant() === 'outline',
        'bg-slate-100/80 dark:bg-slate-800/80 text-slate-900 dark:text-slate-50 hover:bg-slate-200/80 dark:hover:bg-slate-700/80 backdrop-blur': this.variant() === 'secondary',
        'hover:bg-slate-100/50 hover:text-slate-900 dark:hover:bg-slate-800/50 dark:hover:text-slate-50': this.variant() === 'ghost',
        'text-indigo-600 underline-offset-4 hover:underline dark:text-indigo-400': this.variant() === 'link',
        'h-12 px-6 py-3': this.size() === 'default',
        'h-10 rounded-xl px-4 text-xs': this.size() === 'sm',
        'h-14 rounded-2xl px-8 text-base': this.size() === 'lg',
        'h-12 w-12': this.size() === 'icon'
      },
      this.variant() === 'default' ? 'bg-[var(--ds-mauve)] hover:bg-[var(--ds-blue)]' : '',
      this.userClass()
    );
  });
}
