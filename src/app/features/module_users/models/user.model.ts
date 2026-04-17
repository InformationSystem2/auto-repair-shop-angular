import { Role } from './role.model';

/** Reflects UserResponseDto from FastAPI */
export interface User {
  id: string;
  username: string;
  name: string;
  last_name: string;
  email: string;
  phone: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  roles: Role[];
  created_by_id: string | null;
}

/** Payload for POST /users */
export interface UserCreate {
  name: string;
  last_name: string;
  email: string;
  password: string;
  phone?: string | null;
  role_ids?: number[];
}

/** Payload for PUT /users/:id */
export interface UserUpdate {
  name?: string | null;
  last_name?: string | null;
  phone?: string | null;
  password?: string | null;
  is_active?: boolean | null;
  role_ids?: number[] | null;
}
