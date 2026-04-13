import { Component, computed, input, Output, EventEmitter } from '@angular/core';
import { cn } from '@lib/utils';

@Component({
  selector: 'app-dialog',
  standalone: true,
  template: `<ng-content></ng-content>`,
})
export class DialogComponent {}

@Component({
  selector: 'app-dialog-overlay',
  standalone: true,
  template: ``,
  host: {
    '[class]': 'classes()',
  }
})
export class DialogOverlayComponent {
  userClass = input<string>('', { alias: 'class' });
  classes = computed(() => cn(
    'fixed inset-0 z-[70] bg-black/80 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0',
    this.userClass()
  ));
}

@Component({
  selector: 'app-dialog-content',
  standalone: true,
  template: `
    <ng-content></ng-content>
    <button
      (click)="close.emit()"
      class="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-white transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-slate-950 focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-slate-100 data-[state=open]:text-slate-500 dark:ring-offset-slate-950 dark:focus:ring-slate-300 dark:data-[state=open]:bg-slate-800 dark:data-[state=open]:text-slate-400"
    >
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="h-4 w-4"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
      <span class="sr-only">Cerrar</span>
    </button>
  `,
  host: {
    '[class]': 'classes()',
  }
})
export class DialogContentComponent {
  @Output() close = new EventEmitter<void>();
  userClass = input<string>('', { alias: 'class' });
  classes = computed(() => cn(
    'fixed left-[50%] top-[50%] z-[80] grid w-[calc(100%-2rem)] max-h-[calc(100vh-2rem)] max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 overflow-y-auto border border-slate-200 bg-white p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] sm:w-full sm:rounded-lg dark:border-slate-800 dark:bg-slate-950',
    this.userClass()
  ));
}

@Component({
  selector: 'app-dialog-header',
  standalone: true,
  template: `<ng-content></ng-content>`,
  host: {
    '[class]': 'classes()',
  }
})
export class DialogHeaderComponent {
  userClass = input<string>('', { alias: 'class' });
  classes = computed(() => cn('flex flex-col space-y-1.5 text-center sm:text-left', this.userClass()));
}

@Component({
  selector: 'app-dialog-footer',
  standalone: true,
  template: `<ng-content></ng-content>`,
  host: {
    '[class]': 'classes()',
  }
})
export class DialogFooterComponent {
  userClass = input<string>('', { alias: 'class' });
  classes = computed(() => cn('flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2', this.userClass()));
}

@Component({
  selector: 'app-dialog-title, [appDialogTitle]',
  standalone: true,
  template: `<ng-content></ng-content>`,
  host: {
    '[class]': 'classes()',
  }
})
export class DialogTitleComponent {
  userClass = input<string>('', { alias: 'class' });
  classes = computed(() => cn('text-lg font-semibold leading-none tracking-tight', this.userClass()));
}

@Component({
  selector: 'app-dialog-description, [appDialogDescription]',
  standalone: true,
  template: `<ng-content></ng-content>`,
  host: {
    '[class]': 'classes()',
  }
})
export class DialogDescriptionComponent {
  userClass = input<string>('', { alias: 'class' });
  classes = computed(() => cn('text-sm text-slate-500 dark:text-slate-400', this.userClass()));
}
