import { Component, computed, input } from '@angular/core';
import { cn } from '@lib/utils';

export type BadgeVariant = 'default' | 'secondary' | 'destructive' | 'outline' | 'success';

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
      'inline-flex items-center rounded-full border border-slate-200 px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-slate-950 focus:ring-offset-2 dark:border-slate-800 dark:focus:ring-slate-300',
      {
        'border-transparent bg-slate-900 text-slate-50 hover:bg-slate-900/80 dark:bg-slate-50 dark:text-slate-900 dark:hover:bg-slate-50/80': this.variant() === 'default',
        'border-transparent bg-slate-100 text-slate-900 hover:bg-slate-100/80 dark:bg-slate-800 dark:text-slate-50 dark:hover:bg-slate-800/80': this.variant() === 'secondary',
        'border-transparent bg-red-500 text-slate-50 hover:bg-red-500/80 dark:bg-red-900 dark:text-slate-50 dark:hover:bg-red-900/80': this.variant() === 'destructive',
        'border-transparent bg-emerald-500 text-white hover:bg-emerald-500/80 dark:bg-emerald-600 dark:text-white dark:hover:bg-emerald-600/80': this.variant() === 'success',
        'text-slate-950 dark:text-slate-50': this.variant() === 'outline',
      },
      this.userClass()
    );
  });
}
