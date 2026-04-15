import { Component, computed, inject, input, output, OnInit, signal, ChangeDetectionStrategy } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators, FormGroup } from '@angular/forms';
import { RoleCreate, RoleDetail, RoleUpdate } from '@users/models/role.model';
import { Permission } from '@users/models/permission.model';
import { CheckboxComponent } from '@ui/checkbox/checkbox.component';
import { groupPermissions } from '../../../../utils/permission-groups';
import { InputDirective } from '@ui/input/input.component';
import { TranslationService } from '@core/services/translation.service';

@Component({
  selector: 'app-role-form',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CheckboxComponent,
    InputDirective,
  ],
  templateUrl: './role-form.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RoleFormComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  readonly i18n = inject(TranslationService);

  editingRole = input<RoleDetail | null>(null);
  allPermissions = input<Permission[]>([]);
  saving = input<boolean>(false);

  save = output<RoleCreate | RoleUpdate>();
  close = output<void>();

  readonly selectedPermIds = signal<number[]>([]);
  readonly permissionGroups = computed(() => groupPermissions(this.allPermissions()));

  readonly form: FormGroup = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(3)]],
    description: [''],
  });

  hasError(controlName: string, errorName: string): boolean {
    const control = this.form.get(controlName);
    return !!control && control.hasError(errorName) && (control.touched || control.dirty);
  }

  ngOnInit(): void {
    const role = this.editingRole();
    if (role) {
      this.form.patchValue({
        name: role.name,
        description: role.description
      });
      this.selectedPermIds.set(role.permissions.map(p => p.id));
    }
  }

  togglePerm(id: number): void {
    const current = this.selectedPermIds();
    this.selectedPermIds.set(
      current.includes(id) ? current.filter(p => p !== id) : [...current, id]
    );
  }

  isSelected(permissionId: number): boolean {
    return this.selectedPermIds().includes(permissionId);
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const v = this.form.value;
    const role = this.editingRole();

    if (role) {
      const payload: RoleUpdate = {
        name: v.name ?? undefined,
        description: v.description ?? undefined,
        permission_ids: this.selectedPermIds(),
      };
      this.save.emit(payload);
    } else {
      const payload: RoleCreate = {
        name: v.name!,
        description: v.description ?? null,
        permission_ids: this.selectedPermIds(),
      };
      this.save.emit(payload);
    }
  }
}
