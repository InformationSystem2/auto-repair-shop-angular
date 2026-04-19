import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '@env/environment';

export interface AdminDashboardData {
  total_revenue: number;
  platform_profit: number;
  active_users: number;
  active_workshops: number;
  ai_success_rate: number;
  incident_distribution: Record<string, number>;
  monthly_growth: { month: string; workshops: number; clients: number }[];
  pending_workshops: { id: string; name: string; owner_name: string; city: string; created_at: string }[];
  cancelled_services: { client_name: string; workshop_name: string; ai_category: string | null; created_at: string }[];
}

export interface WorkshopDashboardData {
  completed_services: number;
  gross_revenue: number;
  commission_due: number;
  avg_rating: number;
  avg_response_min: number;
  technician_performance: { id: string; name: string; incidents_completed: number; revenue: number }[];
  daily_revenue: { day: string; revenue: number }[];
  emergency_inbox: { id: string; client_name: string; ai_category: string | null; ai_priority: string | null; incident_lat: number | null; incident_lng: number | null; created_at: string }[];
  technician_locations: { id: string; name: string; is_available: boolean; latitude: number | null; longitude: number | null }[];
}

export interface ClientDashboardData {
  total_spent: number;
  service_count: number;
  vehicle_count: number;
  spending_by_vehicle: { vehicle_id: string; make: string; model: string; plate: string; amount: number }[];
  spending_by_category: { category: string; amount: number }[];
  service_history: { id: string; created_at: string; workshop_name: string; ai_category: string | null; amount: number; rating_score: number | null }[];
}

@Injectable({ providedIn: 'root' })
export class DashboardService {
  private readonly http = inject(HttpClient);
  private readonly base = `${environment.apiUrl}/dashboard`;

  getAdminStats(): Observable<AdminDashboardData> {
    return this.http.get<AdminDashboardData>(`${this.base}/admin`);
  }

  getWorkshopStats(): Observable<WorkshopDashboardData> {
    return this.http.get<WorkshopDashboardData>(`${this.base}/workshop`);
  }

  getClientStats(): Observable<ClientDashboardData> {
    return this.http.get<ClientDashboardData>(`${this.base}/client`);
  }
}
