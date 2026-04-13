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
  classes = computed(() => cn('text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70', this.userClass()));
}
