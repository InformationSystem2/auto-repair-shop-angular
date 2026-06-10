/** Refleja NotificationDto del backend FastAPI (GET /api/notifications). */
export interface AppNotification {
  id: string;
  user_id: string;
  incident_id: string | null;
  type: string;
  title: string;
  body: string;
  is_read: boolean;
  sent_at: string;
  read_at: string | null;
  payment_status?: string | null;
}
