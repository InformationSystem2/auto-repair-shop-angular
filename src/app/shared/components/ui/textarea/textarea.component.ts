import { Directive, computed, input } from '@angular/core';
import { cn } from '@lib/utils';

@Directive({
  selector: 'textarea[appTextarea]',
  standalone: true,
  host: {
    '[class]': 'classes()',
    '[disabled]': 'disabled()'
  }
})
export class TextareaDirective {
  userClass = input<string>('', { alias: 'class' });
  disabled = input<boolean>(false);

  classes = computed(() => {
    return cn(
      'flex min-h-[80px] w-full rounded-2xl border-2 border-slate-200 dark:border-slate-700/80 bg-slate-50/80 dark:bg-slate-950/50 backdrop-blur-sm px-4 py-3 text-sm text-slate-900 dark:text-slate-50 font-medium ring-offset-white placeholder:text-slate-400 focus-visible:outline-none focus-visible:border-indigo-500 focus-visible:ring-4 focus-visible:ring-indigo-500/10 transition-all duration-300 shadow-inner disabled:cursor-not-allowed disabled:opacity-50',
      this.userClass()
    );
  });
}
