import { Component, computed, input } from '@angular/core';
import { cn } from '@lib/utils';

@Component({
  selector: 'app-card, [appCard]',
  standalone: true,
  template: `<ng-content></ng-content>`,
  host: {
    '[class]': 'classes()'
  }
})
export class CardComponent {
  userClass = input<string>('', { alias: 'class' });
  classes = computed(() => cn('block rounded-xl border border-slate-200 bg-white text-slate-950 shadow dark:border-slate-800 dark:bg-slate-950 dark:text-slate-50', this.userClass()));
}

@Component({
  selector: 'app-card-header, [appCardHeader]',
  standalone: true,
  template: `<ng-content></ng-content>`,
  host: { '[class]': 'classes()' }
})
export class CardHeaderComponent {
  userClass = input<string>('', { alias: 'class' });
  classes = computed(() => cn('flex flex-col space-y-1.5 p-6', this.userClass()));
}

@Component({
  selector: 'app-card-title, [appCardTitle]',
  standalone: true,
  template: `<ng-content></ng-content>`,
  host: { '[class]': 'classes()' }
})
export class CardTitleComponent {
  userClass = input<string>('', { alias: 'class' });
  classes = computed(() => cn('font-semibold leading-none tracking-tight', this.userClass()));
}

@Component({
  selector: 'app-card-description, [appCardDescription]',
  standalone: true,
  template: `<ng-content></ng-content>`,
  host: { '[class]': 'classes()' }
})
export class CardDescriptionComponent {
  userClass = input<string>('', { alias: 'class' });
  classes = computed(() => cn('text-sm text-slate-500 dark:text-slate-400', this.userClass()));
}

@Component({
  selector: 'app-card-content, [appCardContent]',
  standalone: true,
  template: `<ng-content></ng-content>`,
  host: { '[class]': 'classes()' }
})
export class CardContentComponent {
  userClass = input<string>('', { alias: 'class' });
  classes = computed(() => cn('p-6 pt-0', this.userClass()));
}
