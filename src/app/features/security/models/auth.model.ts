/** Reflects LoginResponseDto from FastAPI */
export interface LoginResponse {
  access_token: string;
  token_type: string;
  redirect_to: string;
  user_id: string;
  user_name: string;
  roles: RoleRef[];
}

/** Minimal permission reference */
export interface PermissionRef {
  id: number;
  name: string;
  action: string;
}

/** Minimal role reference included in login response */
export interface RoleRef {
  id: number;
  name: string;
  permissions?: PermissionRef[];
}

/** Session stored in memory via Signals */
export interface AuthSession {
  token: string;
  userId: string;
  userName: string;
  roles: RoleRef[];
  permissions: string[]; // List of permission actions extracted from JWT payload or roles
}
