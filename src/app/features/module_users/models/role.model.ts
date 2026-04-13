import { Permission } from './permission.model';

/** Reflects RoleResponseDto from FastAPI */
export interface Role {
  id: number;
  name: string;
  description: string | null;
  create_at: string;
  updated_at: string;
}

/** Reflects RoleDetailDto from FastAPI (includes permissions) */
export interface RoleDetail extends Role {
  permissions: Permission[];
}

/** Payload for POST /roles */
export interface RoleCreate {
  name: string;
  description?: string | null;
  permission_ids?: number[];
}

/** Payload for PUT /roles/:id */
export interface RoleUpdate {
  name?: string | null;
  description?: string | null;
  permission_ids?: number[] | null;
}
