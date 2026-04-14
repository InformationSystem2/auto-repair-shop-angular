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
    'fixed inset-0 z-[70] bg-slate-950/60 backdrop-blur-md data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0',
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
    'fixed left-[50%] top-[48%] z-[80] grid w-[calc(100%-2rem)] max-h-[calc(100vh-4rem)] max-w-lg translate-x-[-50%] translate-y-[-50%] overflow-y-auto duration-300 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 bg-white/90 dark:bg-slate-900/80 backdrop-blur-3xl rounded-[2rem] border border-white/60 dark:border-slate-700/80 shadow-2xl shadow-slate-900/50 dark:shadow-[0_0_50px_-15px_rgba(0,0,0,0.7)] p-6 sm:w-full custom-scrollbar',
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
