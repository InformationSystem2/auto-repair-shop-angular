import { Component, input, output } from '@angular/core';
import { ButtonComponent } from '@ui/button/button.component';

@Component({
  selector: 'app-table-row-actions',
  standalone: true,
  imports: [ButtonComponent],
  template: `
    <div class="flex items-center justify-end gap-2">
      @if (showView()) {
        <button
          type="button"
          appButton
          variant="ghost"
          size="icon"
          class="h-9 w-9 min-h-9 rounded-xl px-0 border border-transparent shadow-sm text-slate-500 hover:border-indigo-400 hover:bg-indigo-50/80 hover:scale-110 hover:shadow-md hover:text-indigo-600 dark:text-slate-400 dark:hover:border-indigo-500/50 dark:hover:bg-indigo-500/10 dark:hover:text-indigo-300 transition-all duration-300"
          [title]="viewTitle()"
          [attr.aria-label]="viewTitle()"
          (click)="view.emit()">
          <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            <path stroke-linecap="round" stroke-linejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
          </svg>
        </button>
      }

      @if (showEdit()) {
        <button
          type="button"
          appButton
          variant="ghost"
          size="icon"
          class="h-9 w-9 min-h-9 rounded-xl px-0 border border-transparent shadow-sm text-slate-500 hover:border-indigo-400 hover:bg-indigo-50/80 hover:scale-110 hover:shadow-md hover:text-indigo-600 dark:text-slate-400 dark:hover:border-indigo-500/50 dark:hover:bg-indigo-500/10 dark:hover:text-indigo-300 transition-all duration-300"
          [title]="editTitle()"
          [attr.aria-label]="editTitle()"
          (click)="edit.emit()">
          <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5" />
            <path stroke-linecap="round" stroke-linejoin="round" d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" />
          </svg>
        </button>
      }

      @if (showDelete()) {
        <button
          type="button"
          appButton
          variant="ghost"
          size="icon"
          class="h-9 w-9 min-h-9 rounded-xl px-0 border border-transparent shadow-sm text-slate-500 hover:border-rose-400 hover:bg-rose-50/80 hover:scale-110 hover:shadow-md hover:text-rose-600 dark:text-slate-400 dark:hover:border-rose-500/50 dark:hover:bg-rose-500/10 dark:hover:text-rose-300 transition-all duration-300"
          [title]="deleteTitle()"
          [attr.aria-label]="deleteTitle()"
          (click)="delete.emit()">
          <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7" />
            <path stroke-linecap="round" stroke-linejoin="round" d="M10 11v6m4-6v6" />
            <path stroke-linecap="round" stroke-linejoin="round" d="M9 7V4a1 1 0 011-1h4a1 1 0 011 1v3M4 7h16" />
          </svg>
        </button>
      }
    </div>
  `
})
export class TableRowActionsComponent {
  showView = input(true);
  showEdit = input(true);
  showDelete = input(true);

  viewTitle = input('Ver');
  editTitle = input('Editar');
  deleteTitle = input('Eliminar');

  view = output<void>();
  edit = output<void>();
  delete = output<void>();
}
