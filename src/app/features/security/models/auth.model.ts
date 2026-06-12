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

export interface ForgotPasswordRequest {
  email: string;
}

export interface VerifyRecoveryCodeRequest {
  email: string;
  code: string;
  new_password: string;
}

export interface SendCodeRequest {
  email: string;
}

export interface SendCodeResponse {
  message: string;
  code?: string | null;
}

export interface VerifyCodeRequest {
  email: string;
  code: string;
}

export interface VerifyCodeResponse {
  valid: boolean;
  message: string;
}
