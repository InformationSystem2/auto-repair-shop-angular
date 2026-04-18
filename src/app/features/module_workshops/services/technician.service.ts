import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '@env/environment';
import { Technician, TechnicianCreate, TechnicianUpdate } from '../models/technician.model';

@Injectable({ providedIn: 'root' })
export class TechnicianService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiUrl}/technicians/`;

  getAll(): Observable<Technician[]> {
    return this.http.get<Technician[]>(this.apiUrl);
  }

  getById(id: string): Observable<Technician> {
    return this.http.get<Technician>(`${this.apiUrl}${id}`);
  }

  create(payload: TechnicianCreate): Observable<Technician> {
    return this.http.post<Technician>(this.apiUrl, payload);
  }

  update(id: string, payload: TechnicianUpdate): Observable<Technician> {
    return this.http.put<Technician>(`${this.apiUrl}${id}`, payload);
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}${id}`);
  }
}
