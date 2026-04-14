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
  classes = computed(() => cn('block rounded-[2rem] border border-white/60 dark:border-slate-800/80 bg-white/70 dark:bg-slate-900/60 backdrop-blur-2xl text-slate-950 dark:text-slate-50 shadow-xl shadow-slate-200/40 dark:shadow-[0_0_40px_-15px_rgba(0,0,0,0.5)] transition-all overflow-hidden relative', this.userClass()));
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
