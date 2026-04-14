import { Component, computed, forwardRef, input, model, signal, output } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { cn } from '@lib/utils';

@Component({
  selector: 'app-checkbox',
  standalone: true,
  template: `
    <button
      type="button"
      role="checkbox"
      [attr.aria-checked]="checked()"
      [attr.aria-label]="label()"
      [disabled]="disabled()"
      (click)="toggle()"
      [class]="classes()"
    >
      @if (checked()) {
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="3"
          stroke-linecap="round"
          stroke-linejoin="round"
          class="h-4 w-4 text-white dark:text-slate-900"
        >
          <polyline points="20 6 9 17 4 12"></polyline>
        </svg>
      }
    </button>
  `,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CheckboxComponent),
      multi: true
    }
  ],
  host: {
    'class': 'inline-block'
  }
})
export class CheckboxComponent implements ControlValueAccessor {
  checked = model(false);
  disabled = signal(false);
  label = input<string>('');
  userClass = input<string>('', { alias: 'class' });
  change = output<boolean>();

  classes = computed(() =>
    cn(
      'peer h-5 w-5 shrink-0 rounded-[0.4rem] border-2 ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/50 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:ring-offset-slate-950 transition-all duration-300',
      this.checked() 
        ? 'bg-indigo-600 border-indigo-600 dark:bg-indigo-500 dark:border-indigo-500 text-white shadow-md shadow-indigo-500/40' 
        : 'bg-white/80 dark:bg-slate-900/50 backdrop-blur hover:bg-slate-50 dark:hover:bg-slate-800 border-slate-300 dark:border-slate-600',
      this.userClass()
    )
  );

  private onChange: (value: boolean) => void = () => {};
  private onTouched: () => void = () => {};

  toggle() {
    if (this.disabled()) return;
    const newValue = !this.checked();
    this.checked.set(newValue);
    this.change.emit(newValue);
    this.onChange(newValue);
    this.onTouched();
  }

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
