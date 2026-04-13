import { Component, computed, input } from '@angular/core';
import { cn } from '@lib/utils';

@Component({
  selector: 'app-separator',
  standalone: true,
  template: ``,
  host: {
    '[class]': 'classes()',
    '[attr.role]': '"separator"',
    '[attr.aria-orientation]': 'orientation()'
  }
})
export class SeparatorComponent {
  orientation = input<'horizontal' | 'vertical'>('horizontal');
  decorative = input<boolean>(true);
  userClass = input<string>('', { alias: 'class' });

  classes = computed(() => 
    cn(
      'shrink-0 bg-slate-200 dark:bg-slate-800',
      this.orientation() === 'horizontal' ? 'h-[1px] w-full' : 'h-full w-[1px]',
      this.userClass()
    )
  );
}
