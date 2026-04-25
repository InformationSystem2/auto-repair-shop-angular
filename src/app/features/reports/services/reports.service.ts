import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '@env/environment';
import {
  ReportTypeDefinition,
  ReportRunRequest,
  ReportResult,
  ReportTemplate,
  ReportTemplateCreate,
} from '../models/report.models';

@Injectable({ providedIn: 'root' })
export class ReportsService {
  private readonly http = inject(HttpClient);
  private readonly base = `${environment.apiUrl}/reports`;

  getCatalog(): Observable<ReportTypeDefinition[]> {
    return this.http.get<ReportTypeDefinition[]>(`${this.base}/catalog`);
  }

  runReport(req: ReportRunRequest): Observable<ReportResult> {
    return this.http.post<ReportResult>(`${this.base}/run`, req);
  }

  exportReport(req: ReportRunRequest, format: string, title: string, lang: string): Observable<Blob> {
    const params = new HttpParams().set('format', format).set('title', title).set('lang', lang);
    return this.http.post(`${this.base}/export`, req, {
      params,
      responseType: 'blob',
    });
  }

  getTemplates(): Observable<ReportTemplate[]> {
    return this.http.get<ReportTemplate[]>(`${this.base}/templates`);
  }

  saveTemplate(data: ReportTemplateCreate): Observable<ReportTemplate> {
    return this.http.post<ReportTemplate>(`${this.base}/templates`, data);
  }

  updateTemplate(id: string, data: Partial<ReportTemplateCreate>): Observable<ReportTemplate> {
    return this.http.put<ReportTemplate>(`${this.base}/templates/${id}`, data);
  }

  deleteTemplate(id: string): Observable<void> {
    return this.http.delete<void>(`${this.base}/templates/${id}`);
  }
}
