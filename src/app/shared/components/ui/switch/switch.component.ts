import { Component, computed, forwardRef, input, signal, booleanAttribute } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { cn } from '@lib/utils';

@Component({
  selector: 'app-switch',
  standalone: true,
  template: `
    <button
      type="button"
      [attr.role]="'switch'"
      [attr.aria-checked]="checked()"
      [attr.aria-label]="label()"
      [disabled]="disabled()"
      (click)="toggle()"
      [class]="classes()"
    >
      <span [class]="thumbClasses()"></span>
    </button>
  `,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SwitchComponent),
      multi: true
    }
  ],
  host: {
    'class': 'inline-block'
  }
})
export class SwitchComponent implements ControlValueAccessor {
  checked = signal(false);
  disabled = signal(false);
  label = input<string>('');
  userClass = input<string>('', { alias: 'class' });

  classes = computed(() =>
    cn(
      'peer inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2 focus-visible:ring-offset-white disabled:cursor-not-allowed disabled:opacity-50 dark:focus-visible:ring-slate-300 dark:focus-visible:ring-offset-slate-950',
      this.checked() 
        ? 'bg-indigo-600 dark:bg-slate-50' 
        : 'bg-slate-200 dark:bg-slate-800',
      this.userClass()
    )
  );

  thumbClasses = computed(() =>
    cn(
      'pointer-events-none block h-5 w-5 rounded-full bg-white shadow-lg ring-0 transition-transform dark:bg-slate-950',
      this.checked() ? 'translate-x-5' : 'translate-x-0'
    )
  );

  private onChange: (value: boolean) => void = () => {};
  private onTouched: () => void = () => {};

  toggle() {
    if (this.disabled()) return;
    const newValue = !this.checked();
    this.checked.set(newValue);
    this.onChange(newValue);
    this.onTouched();
  }

  // ControlValueAccessor methods
  writeValue(value: any): void {
    this.checked.set(!!value);
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState?(isDisabled: boolean): void {
    this.disabled.set(isDisabled);
  }
}
