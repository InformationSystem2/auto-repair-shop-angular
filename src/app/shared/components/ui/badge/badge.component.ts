import { Component, computed, input } from '@angular/core';
import { cn } from '@lib/utils';

export type BadgeVariant = 'default' | 'secondary' | 'destructive' | 'outline' | 'success' | 'warning';

@Component({
  selector: 'app-badge, [appBadge]',
  standalone: true,
  template: `<ng-content></ng-content>`,
  host: {
    '[class]': 'classes()'
  }
})
export class BadgeComponent {
  variant = input<BadgeVariant>('default');
  userClass = input<string>('', { alias: 'class' });

  classes = computed(() => {
    return cn(
      'inline-flex items-center px-3 py-1 rounded-full text-[0.65rem] font-bold uppercase tracking-widest transition-colors focus:outline-none focus:ring-4 focus:ring-slate-900/10 dark:focus:ring-slate-50/10',
      {
        'bg-slate-900 text-white dark:bg-white dark:text-slate-900 border border-slate-900 dark:border-white shadow': this.variant() === 'default',
        'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700/80': this.variant() === 'secondary',
        'bg-rose-50 dark:bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-500/20': this.variant() === 'destructive',
        'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/20': this.variant() === 'success',
        'bg-white/50 dark:bg-slate-900/50 backdrop-blur border border-slate-200/50 dark:border-slate-700/50 text-slate-900 dark:text-slate-100 shadow-sm': this.variant() === 'outline',
        'bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-amber-500/20': this.variant() === 'warning',
      },
      this.userClass()
    );
  });
}
