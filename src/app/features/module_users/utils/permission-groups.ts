import { Permission } from '../models/permission.model';

export interface PermissionGroup {
  packageName: string;
  label: string;
  permissions: Permission[];
}

export function groupPermissions(permissions: Permission[]): PermissionGroup[] {
  const grouped = new Map<string, Permission[]>();

  for (const permission of permissions) {
    const packageName = getPackageName(permission);
    const current = grouped.get(packageName) ?? [];
    current.push(permission);
    grouped.set(packageName, current);
  }

  return Array.from(grouped.entries())
    .sort(([left], [right]) => left.localeCompare(right))
    .map(([packageName, items]) => ({
      packageName,
      label: formatPackageLabel(packageName),
      permissions: items.sort((left, right) => left.action.localeCompare(right.action)),
    }));
}

function getPackageName(permission: Permission): string {
  return permission.action?.split(':')[0] ?? permission.name?.split(':')[0] ?? 'general';
}

function formatPackageLabel(packageName: string): string {
  return packageName
    .split(/[_-]/g)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');
}