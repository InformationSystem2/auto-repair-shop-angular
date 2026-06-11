import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '@env/environment';
import { AuditLog, AuditPage, AuditFilters, IntegrityCheckResult } from '../models/audit.models';

@Injectable({ providedIn: 'root' })
export class AuditService {

  private http = inject(HttpClient);
  private readonly BASE = `${environment.apiUrl}/audit`;

  list(filters: AuditFilters): Observable<AuditPage> {
    let params = new HttpParams()
      .set('page', filters.page)
      .set('size', filters.size);

    if (filters.workshop_id) params = params.set('workshop_id', filters.workshop_id);
    if (filters.user_identifier) params = params.set('user_identifier', filters.user_identifier);
    if (filters.action_type) params = params.set('action_type', filters.action_type);
    if (filters.resource_type) params = params.set('resource_type', filters.resource_type);
    if (filters.date_from) params = params.set('date_from', filters.date_from);
    if (filters.date_to) params = params.set('date_to', filters.date_to);

    return this.http.get<AuditPage>(this.BASE, { params });
  }

  getById(id: string): Observable<AuditLog> {
    return this.http.get<AuditLog>(`${this.BASE}/${id}`);
  }

  verifyIntegrity(id: string): Observable<IntegrityCheckResult> {
    return this.http.get<IntegrityCheckResult>(`${this.BASE}/${id}/verify`);
  }

  verifyAll(limit: number = 100): Observable<IntegrityCheckResult[]> {
    const params = new HttpParams().set('limit', limit);
    return this.http.post<IntegrityCheckResult[]>(
      `${this.BASE}/verify-all`, {}, { params }
    );
  }

  exportCsv(filters: AuditFilters): Observable<Blob> {
    let params = new HttpParams();

    if (filters.workshop_id) params = params.set('workshop_id', filters.workshop_id);
    if (filters.user_identifier) params = params.set('user_identifier', filters.user_identifier);
    if (filters.action_type) params = params.set('action_type', filters.action_type);
    if (filters.resource_type) params = params.set('resource_type', filters.resource_type);
    if (filters.date_from) params = params.set('date_from', filters.date_from);
    if (filters.date_to) params = params.set('date_to', filters.date_to);

    return this.http.get(`${this.BASE}/export`, {
      params,
      responseType: 'blob',
    });
  }
}
