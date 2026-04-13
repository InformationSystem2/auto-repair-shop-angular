import { Component, computed, input, signal, inject } from '@angular/core';
import { cn } from '@lib/utils';
import { ClickOutsideDirective } from '../../../directives/click-outside.directive';

@Component({
  selector: 'app-dropdown-menu',
  standalone: true,
  template: `<ng-content></ng-content>`,
})
export class DropdownMenuComponent {
  isOpen = signal(false);
  
  toggle() {
    this.isOpen.update(v => !v);
  }

  close() {
    this.isOpen.set(false);
  }
}

@Component({
  selector: 'app-dropdown-menu-trigger, [appDropdownMenuTrigger]',
  standalone: true,
  template: `<ng-content></ng-content>`,
  host: {
    '(click)': 'dropdown.toggle()',
    'class': 'cursor-pointer'
  }
})
export class DropdownMenuTriggerComponent {
  dropdown = inject(DropdownMenuComponent);
}

@Component({
  selector: 'app-dropdown-menu-content',
  standalone: true,
  imports: [ClickOutsideDirective],
  template: `
    @if (dropdown.isOpen()) {
      <div [class]="classes()" (appClickOutside)="dropdown.close()">
        <ng-content></ng-content>
      </div>
    }
  `,
  host: {
    'class': 'relative'
  }
})
export class DropdownMenuContentComponent {
  dropdown = inject(DropdownMenuComponent);

  userClass = input<string>('', { alias: 'class' });
  side = input<'top' | 'bottom' | 'left' | 'right'>('bottom');
  align = input<'start' | 'center' | 'end'>('start');

  classes = computed(() => cn(
    'absolute mt-2 z-[90] min-w-[10rem] overflow-hidden rounded-md border border-slate-200 bg-white p-1 text-slate-950 shadow-md animate-in fade-in-0 zoom-in-95 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-50',
    {
      'top-full left-0': this.side() === 'bottom' && this.align() === 'start',
      'top-full right-0': this.side() === 'bottom' && this.align() === 'end',
      // Simplified positioning for this implementation
    },
    this.userClass()
  ));


}

@Component({
  selector: 'app-dropdown-menu-item, [appDropdownMenuItem]',
  standalone: true,
  template: `<ng-content></ng-content>`,
  host: {
    '[class]': 'classes()',
    '(click)': 'dropdown.close()'
  }
})
export class DropdownMenuItemComponent {
  dropdown = inject(DropdownMenuComponent);
  userClass = input<string>('', { alias: 'class' });
  inset = input<boolean>(false);

  classes = computed(() => cn(
    'relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors hover:bg-slate-100 hover:text-slate-900 focus:bg-slate-100 focus:text-slate-900 data-[disabled]:pointer-events-none data-[disabled]:opacity-50 dark:hover:bg-slate-800 dark:hover:text-slate-50 dark:focus:bg-slate-800 dark:focus:text-slate-50',
    this.inset() && 'pl-8',
    this.userClass()
  ));
}

@Component({
  selector: 'app-dropdown-menu-label',
  standalone: true,
  template: `<ng-content></ng-content>`,
  host: {
    '[class]': 'classes()'
  }
})
export class DropdownMenuLabelComponent {
  userClass = input<string>('', { alias: 'class' });
  inset = input<boolean>(false);

  classes = computed(() => cn(
    'px-2 py-1.5 text-sm font-semibold',
    this.inset() && 'pl-8',
    this.userClass()
  ));
}

@Component({
  selector: 'app-dropdown-menu-separator',
  standalone: true,
  template: ``,
  host: {
    '[class]': 'classes()'
  }
})
export class DropdownMenuSeparatorComponent {
  userClass = input<string>('', { alias: 'class' });
  classes = computed(() => cn('-mx-1 my-1 h-px bg-slate-100 dark:bg-slate-800', this.userClass()));
}
