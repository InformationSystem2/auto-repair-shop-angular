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
  classes = computed(() => cn('[&_tr]:border-b dark:border-slate-800', this.userClass()));
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
  classes = computed(() => cn('border-b border-slate-200 transition-colors hover:bg-slate-100/50 data-[state=selected]:bg-slate-100 dark:border-slate-800 dark:hover:bg-slate-800/50 dark:data-[state=selected]:bg-slate-800', this.userClass()));
}

@Component({
  selector: 'th[appTableHead]',
  standalone: true,
  template: `<ng-content></ng-content>`,
  host: { '[class]': 'classes()' }
})
export class TableHeadComponent {
  userClass = input<string>('', { alias: 'class' });
  classes = computed(() => cn('h-10 px-4 text-left align-middle font-medium text-slate-500 [&:has([role=checkbox])]:pr-0 dark:text-slate-400', this.userClass()));
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
