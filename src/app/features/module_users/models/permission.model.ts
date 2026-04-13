/** Reflects PermissionResponseDto from FastAPI */
export interface Permission {
  id: number;
  name: string;
  description: string | null;
  action: string;
  created_at: string;
}
