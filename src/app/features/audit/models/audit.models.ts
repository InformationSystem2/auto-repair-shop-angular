export interface AuditLog {
  id: string;
  workshop_id: string | null;
  user_id?: string;
  user_email?: string;
  user_name?: string;
  action_type: string;
  resource_type: string;
  resource_id?: string;
  resource_name?: string;
  ip_address?: string;
  user_agent?: string;
  request_method?: string;
  request_path?: string;
  request_body?: Record<string, unknown>;
  changes_before?: Record<string, unknown>;
  changes_after?: Record<string, unknown>;
  response_status?: number;
  error_message?: string;
  integrity_hash?: string;
  created_at: string;
  client_time?: string;
  session_id?: string;
  severity?: string;
  execution_time_ms?: number;
  valid: boolean;
}

export interface AuditPage {
  content: AuditLog[];
  total_elements: number;
  total_pages: number;
  number: number;
  size: number;
}

export interface AuditFilters {
  workshop_id?: string;
  user_identifier?: string;
  action_type?: string;
  resource_type?: string;
  date_from?: string;
  date_to?: string;
  page: number;
  size: number;
}

export interface IntegrityCheckResult {
  id: string;
  valid: boolean;
  message: string;
}
