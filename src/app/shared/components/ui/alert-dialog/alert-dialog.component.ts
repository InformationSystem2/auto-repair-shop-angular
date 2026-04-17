import { Component, input, output, inject } from '@angular/core';
import { TranslationService } from '@core/services/translation.service';
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
  private i18n = inject(TranslationService);

  title = input<string>(this.i18n.translate('common_ui.confirm_title'));
  description = input<string>(this.i18n.translate('common_ui.confirm_description'));
  cancelText = input<string>(this.i18n.translate('common.cancel'));
  confirmText = input<string>(this.i18n.translate('common.confirm'));

  confirm = output<void>();
  cancel = output<void>();
}
