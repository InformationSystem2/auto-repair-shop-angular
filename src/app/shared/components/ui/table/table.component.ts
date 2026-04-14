import { Component, computed, input } from '@angular/core';
import { cn } from '@lib/utils';

@Component({
  selector: 'app-table',
  standalone: true,
  template: `
    <div class="relative w-full overflow-x-auto overflow-y-visible">
      <table [class]="classes()">
        <ng-content></ng-content>
      </table>
    </div>
  `
})
export class TableComponent {
  userClass = input<string>('', { alias: 'class' });
  classes = computed(() => cn('w-full caption-bottom text-sm', this.userClass()));
}

@Component({
  selector: 'thead[appTableHeader]',
  standalone: true,
  template: `<ng-content></ng-content>`,
  host: { '[class]': 'classes()' }
})
export class TableHeaderComponent {
  userClass = input<string>('', { alias: 'class' });
  classes = computed(() => cn('bg-slate-50/50 dark:bg-slate-800/30', this.userClass()));
}

@Component({
  selector: 'tbody[appTableBody]',
  standalone: true,
  template: `<ng-content></ng-content>`,
  host: { '[class]': 'classes()' }
})
export class TableBodyComponent {
  userClass = input<string>('', { alias: 'class' });
  classes = computed(() => cn('[&_tr:last-child]:border-0', this.userClass()));
}

@Component({
  selector: 'tr[appTableRow]',
  standalone: true,
  template: `<ng-content></ng-content>`,
  host: { '[class]': 'classes()' }
})
export class TableRowComponent {
  userClass = input<string>('', { alias: 'class' });
  classes = computed(() => cn('border-b border-slate-100 transition-all duration-300 hover:bg-white data-[state=selected]:bg-slate-50 dark:border-slate-800/50 dark:hover:bg-slate-800/80 dark:data-[state=selected]:bg-slate-800/80 align-middle group', this.userClass()));
}

@Component({
  selector: 'th[appTableHead]',
  standalone: true,
  template: `<ng-content></ng-content>`,
  host: { '[class]': 'classes()' }
})
export class TableHeadComponent {
  userClass = input<string>('', { alias: 'class' });
  classes = computed(() => cn('h-12 px-6 text-left align-middle font-black uppercase tracking-widest text-[0.70rem] text-slate-400 [&:has([role=checkbox])]:pr-0 dark:text-slate-500', this.userClass()));
}

@Component({
  selector: 'td[appTableCell]',
  standalone: true,
  template: `<ng-content></ng-content>`,
  host: { '[class]': 'classes()' }
})
export class TableCellComponent {
  userClass = input<string>('', { alias: 'class' });
  classes = computed(() => cn('p-4 align-middle [&:has([role=checkbox])]:pr-0', this.userClass()));
}
