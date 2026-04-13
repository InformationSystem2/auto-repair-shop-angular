/** Reflects LoginResponseDto from FastAPI */
export interface LoginResponse {
  access_token: string;
  token_type: string;
  redirect_to: string;
  user_id: string;
  user_name: string;
  roles: RoleRef[];
}

/** Minimal role reference included in login response */
export interface RoleRef {
  id: number;
  name: string;
}

/** Session stored in memory via Signals */
export interface AuthSession {
  token: string;
  userId: string;
  userName: string;
  roles: RoleRef[];
}
