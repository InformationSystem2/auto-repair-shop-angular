import { Component, computed, input } from '@angular/core';
import { cn } from '@lib/utils';

@Component({
  selector: 'label[appLabel]',
  standalone: true,
  template: `<ng-content></ng-content>`,
  host: { '[class]': 'classes()' }
})
export class LabelComponent {
  userClass = input<string>('', { alias: 'class' });
  classes = computed(() => cn('text-[0.75rem] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider ml-1 transition-colors peer-disabled:cursor-not-allowed peer-disabled:opacity-70', this.userClass()));
}
