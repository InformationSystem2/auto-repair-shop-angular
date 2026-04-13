import { Component, input, output } from '@angular/core';
import { ButtonComponent } from '../button/button.component';
import { DialogComponent, DialogOverlayComponent, DialogContentComponent, DialogHeaderComponent, DialogFooterComponent, DialogTitleComponent, DialogDescriptionComponent } from '../dialog/dialog.component';

@Component({
  selector: 'app-alert-dialog',
  standalone: true,
  imports: [
    ButtonComponent,
    DialogComponent,
    DialogOverlayComponent,
    DialogContentComponent,
    DialogHeaderComponent,
    DialogFooterComponent,
    DialogTitleComponent,
    DialogDescriptionComponent
  ],
  template: `
    <app-dialog>
      <app-dialog-overlay (click)="cancel.emit()" />
      <app-dialog-content (close)="cancel.emit()" class="max-w-[400px]">
        <app-dialog-header>
          <app-dialog-title>{{ title() }}</app-dialog-title>
          <app-dialog-description>
            {{ description() }}
          </app-dialog-description>
        </app-dialog-header>
        
        <app-dialog-footer class="gap-2 sm:gap-0">
          <button appButton variant="outline" (click)="cancel.emit()" class="sm:mr-2">
            {{ cancelText() }}
          </button>
          <button appButton variant="destructive" (click)="confirm.emit()">
            {{ confirmText() }}
          </button>
        </app-dialog-footer>
      </app-dialog-content>
    </app-dialog>
  `
})
export class AlertDialogComponent {
  title = input<string>('¿Estás seguro?');
  description = input<string>('Esta acción no se puede deshacer.');
  cancelText = input<string>('Cancelar');
  confirmText = input<string>('Confirmar');

  confirm = output<void>();
  cancel = output<void>();
}
