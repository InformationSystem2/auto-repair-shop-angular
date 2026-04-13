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
      'inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 dark:ring-offset-slate-950 dark:focus-visible:ring-slate-300',
      {
        'bg-indigo-600 text-white hover:bg-indigo-600/90 dark:bg-indigo-50 dark:text-indigo-900 dark:hover:bg-indigo-50/90': this.variant() === 'default',
        'bg-red-500 text-slate-50 hover:bg-red-500/90 dark:bg-red-900 dark:text-slate-50 dark:hover:bg-red-900/90': this.variant() === 'destructive',
        'border border-slate-200 bg-white hover:bg-slate-100 hover:text-slate-900 dark:border-slate-800 dark:bg-slate-950 dark:hover:bg-slate-800 dark:hover:text-slate-50': this.variant() === 'outline',
        'bg-slate-100 text-slate-900 hover:bg-slate-100/80 dark:bg-slate-800 dark:text-slate-50 dark:hover:bg-slate-800/80': this.variant() === 'secondary',
        'hover:bg-slate-100 hover:text-slate-900 dark:hover:bg-slate-800 dark:hover:text-slate-50': this.variant() === 'ghost',
        'text-indigo-600 underline-offset-4 hover:underline dark:text-indigo-50': this.variant() === 'link',
        'h-10 px-4 py-2': this.size() === 'default',
        'h-9 rounded-md px-3': this.size() === 'sm',
        'h-11 rounded-md px-8': this.size() === 'lg',
        'h-10 w-10': this.size() === 'icon'
      },
      this.userClass()
    );
  });
}
