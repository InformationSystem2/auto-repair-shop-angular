import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Specialty, SpecialtyCreate, SpecialtyUpdate } from '../../../../models/specialty.model';
import { ButtonComponent } from '@ui/button/button.component';
import { TranslationService } from '@core/services/translation.service';

@Component({
  selector: 'app-specialty-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, ButtonComponent],
  template: `
    <form [formGroup]="form" (ngSubmit)="onSubmit()" class="space-y-6 text-left">
      <div class="space-y-2">
        <label class="text-[0.65rem] font-black uppercase tracking-widest text-slate-500 dark:text-slate-300 ml-1">
          {{ i18n.translate('workshops.form.specialty_name') }}
        </label>
        <input 
          type="text" 
          formControlName="name"
          [placeholder]="i18n.translate('workshops.form.specialty_name_placeholder')"
          class="w-full px-5 py-4 rounded-2xl bg-white dark:bg-slate-800 border-2 border-slate-300 dark:border-slate-600 text-slate-900 dark:text-white focus:ring-4 focus:ring-indigo-500/15 focus:border-indigo-500 dark:focus:border-indigo-400 transition-all outline-none font-medium placeholder:text-slate-400 dark:placeholder:text-slate-500"
        >
        <p *ngIf="form.get('name')?.touched && form.get('name')?.invalid" class="text-[10px] text-rose-500 font-bold ml-1">
          {{ i18n.translate('workshops.form.specialty_name_error') }}
        </p>
      </div>

      <div class="space-y-2">
        <label class="text-[0.65rem] font-black uppercase tracking-widest text-slate-500 dark:text-slate-300 ml-1">
          {{ i18n.translate('workshops.form.specialty_desc_label') }}
        </label>
        <textarea 
          formControlName="description"
          rows="4"
          [placeholder]="i18n.translate('workshops.form.specialty_desc_placeholder')"
          class="w-full px-5 py-4 rounded-2xl bg-white dark:bg-slate-800 border-2 border-slate-300 dark:border-slate-600 text-slate-900 dark:text-white focus:ring-4 focus:ring-indigo-500/15 focus:border-indigo-500 dark:focus:border-indigo-400 transition-all outline-none font-medium resize-none placeholder:text-slate-400 dark:placeholder:text-slate-500"
        ></textarea>
      </div>

      <div class="flex items-center gap-3 pt-4">
        <button 
          appButton
          type="button" 
          variant="ghost" 
          class="flex-1"
          (click)="cancel.emit()"
          [disabled]="saving"
        >
          {{ i18n.translate('common.cancel') }}
        </button>
        <button 
          appButton
          type="submit" 
          variant="default" 
          class="flex-1" 
          [disabled]="form.invalid || saving"
        >
          {{ saving ? i18n.translate('common.saving') : (specialty ? i18n.translate('common.update') : i18n.translate('common.create')) }}
        </button>
      </div>
    </form>
  `
})
export class SpecialtyFormComponent implements OnChanges {
  private readonly fb = inject(FormBuilder);
  readonly i18n = inject(TranslationService);

  @Input() specialty: Specialty | null = null;
  @Input() saving = false;
  
  @Output() save = new EventEmitter<SpecialtyCreate | SpecialtyUpdate>();
  @Output() cancel = new EventEmitter<void>();

  readonly form = this.fb.group({
    name: ['', [Validators.required, Validators.maxLength(100)]],
    description: [''],
  });

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['specialty'] && this.specialty) {
      this.form.patchValue({
        name: this.specialty.name,
        description: this.specialty.description || ''
      });
    } else if (changes['specialty']) {
      this.form.reset();
    }
  }

  onSubmit(): void {
    if (this.form.valid) {
      this.save.emit(this.form.value as SpecialtyCreate);
    }
  }
}
