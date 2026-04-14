import { Component, computed, input, signal } from '@angular/core';
import { cn } from '@lib/utils';

@Component({
  selector: 'app-avatar',
  standalone: true,
  template: `<ng-content></ng-content>`,
  host: {
    '[class]': 'classes()'
  }
})
export class AvatarComponent {
  userClass = input<string>('', { alias: 'class' });
  classes = computed(() => cn('relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full', this.userClass()));
}

@Component({
  selector: 'img[appAvatarImage]',
  standalone: true,
  template: ``,
  host: {
    '[class]': 'classes()',
    '(error)': 'onImageError()'
  }
})
export class AvatarImageDirective {
  userClass = input<string>('', { alias: 'class' });
  classes = computed(() => cn('aspect-square h-full w-full', this.userClass()));
  
  error = signal(false);
  onImageError() {
    this.error.set(true);
  }
}

@Component({
  selector: 'app-avatar-fallback',
  standalone: true,
  template: `<ng-content></ng-content>`,
  host: {
    '[class]': 'classes()'
  }
})
export class AvatarFallbackComponent {
  userClass = input<string>('', { alias: 'class' });
  classes = computed(() => cn('flex h-full w-full items-center justify-center rounded-full bg-slate-100/80 dark:bg-slate-800/80 text-sm font-bold uppercase tracking-wider', this.userClass()));
}
