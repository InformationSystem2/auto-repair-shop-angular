import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '@env/environment';
import { 
  Workshop, WorkshopRegisterPublic, WorkshopUpdate, WorkshopAdminUpdate 
} from '../models/workshop.model';

@Injectable({ providedIn: 'root' })
export class WorkshopService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiUrl}/workshops/`;

  registerPublic(payload: WorkshopRegisterPublic): Observable<Workshop> {
    return this.http.post<Workshop>(`${this.apiUrl}register`, payload);
  }

  getAll(verified?: boolean): Observable<Workshop[]> {
    let params = new HttpParams();
    if (verified !== undefined) {
      params = params.set('verified', verified.toString());
    }
    return this.http.get<Workshop[]>(this.apiUrl, { params });
  }

  getMyWorkshop(): Observable<Workshop> {
    return this.http.get<Workshop>(`${this.apiUrl}me`);
  }

  getById(id: string): Observable<Workshop> {
    return this.http.get<Workshop>(`${this.apiUrl}${id}`);
  }

  updateMyWorkshop(payload: WorkshopUpdate): Observable<Workshop> {
    return this.http.put<Workshop>(`${this.apiUrl}me`, payload);
  }

  adminUpdate(id: string, payload: WorkshopAdminUpdate): Observable<Workshop> {
    return this.http.put<Workshop>(`${this.apiUrl}${id}`, payload);
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}${id}`);
  }
}
