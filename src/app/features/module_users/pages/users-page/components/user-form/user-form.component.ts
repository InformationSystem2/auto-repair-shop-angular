import { Component, inject, input, output, OnInit, signal, ChangeDetectionStrategy } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators, FormGroup } from '@angular/forms';
import { User, UserCreate, UserUpdate } from '@users/models/user.model';
import { RoleDetail } from '@users/models/role.model';
import { AuthService } from '@core/auth/auth.service';
import { CheckboxComponent } from '@ui/checkbox/checkbox.component';
import { SwitchComponent } from '@ui/switch/switch.component';
import { InputDirective } from '@ui/input/input.component';
import { TranslationService } from '@core/services/translation.service';

@Component({
  selector: 'app-user-form',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CheckboxComponent,
    SwitchComponent,
    InputDirective
  ],
  templateUrl: './user-form.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserFormComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly auth = inject(AuthService);
  readonly i18n = inject(TranslationService);

  editingUser = input<User | null>(null);
  availableRoles = input<RoleDetail[]>([]);
  saving = input<boolean>(false);

  save = output<UserCreate | UserUpdate>();
  close = output<void>();

  readonly isWorkshopOwner = this.auth.isWorkshopOwner;
  readonly selectedRoleIds = signal<number[]>([]);

  readonly form: FormGroup = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(2)]],
    last_name: ['', [Validators.required, Validators.minLength(2)]],
    email: [''],
    password: [''],
    phone: [''],
    is_active: [true],
  });

  ngOnInit(): void {
    this.configureValidators();

    const user = this.editingUser();
    if (user) {
      this.form.patchValue({
        name: user.name,
        last_name: user.last_name,
        phone: user.phone,
        is_active: user.is_active
      });
      this.selectedRoleIds.set(user.roles.map(r => r.id));
    }
  }

  hasError(controlName: string, errorName: string): boolean {
    const control = this.form.get(controlName);
    return !!control && control.hasError(errorName) && (control.touched || control.dirty);
  }

  private configureValidators(): void {
    const editing = !!this.editingUser();
    const email = this.form.get('email');
    const password = this.form.get('password');
    const phone = this.form.get('phone');

    phone?.setValidators([
      Validators.pattern(/^$|^\+?[0-9\s()-]{7,20}$/),
    ]);

    if (editing) {
      email?.clearValidators();
      email?.disable({ emitEvent: false });

      password?.setValidators([
        Validators.minLength(6),
      ]);
      password?.enable({ emitEvent: false });
    } else {
      email?.setValidators([
        Validators.required,
        Validators.email,
      ]);
      email?.enable({ emitEvent: false });

      password?.setValidators([
        Validators.required,
        Validators.minLength(6),
      ]);
      password?.enable({ emitEvent: false });
    }

    email?.updateValueAndValidity({ emitEvent: false });
    password?.updateValueAndValidity({ emitEvent: false });
    phone?.updateValueAndValidity({ emitEvent: false });
  }

  toggleRole(id: number): void {
    const current = this.selectedRoleIds();
    this.selectedRoleIds.set(
      current.includes(id) ? current.filter(r => r !== id) : [...current, id]
    );
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const v = this.form.value;
    const user = this.editingUser();

    let roleIds = this.selectedRoleIds();

    // If workshop_owner is creating a new user, auto-assign 'technician' role
    if (!user && this.isWorkshopOwner()) {
      const techRole = this.availableRoles().find(r => r.name === 'technician');
      roleIds = techRole ? [techRole.id] : [3]; // Fallback to ID 3 if list is empty
    }

    if (user) {
      const payload: UserUpdate = {
        name: v.name ?? undefined,
        last_name: v.last_name ?? undefined,
        phone: v.phone ?? undefined,
        password: v.password ? v.password : undefined,
        is_active: v.is_active ?? undefined,
        role_ids: roleIds,
      };
      this.save.emit(payload);
    } else {
      const payload: UserCreate = {
        name: v.name!,
        last_name: v.last_name!,
        email: v.email!,
        password: v.password!,
        phone: v.phone ?? null,
        role_ids: roleIds,
      };
      this.save.emit(payload);
    }
  }
}
