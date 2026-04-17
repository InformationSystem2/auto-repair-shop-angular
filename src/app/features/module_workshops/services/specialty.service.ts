import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '@env/environment';
import { Specialty, SpecialtyCreate, SpecialtyUpdate } from '../models/specialty.model';

@Injectable({ providedIn: 'root' })
export class SpecialtyService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiUrl}/specialties/`;

  getAll(): Observable<Specialty[]> {
    return this.http.get<Specialty[]>(this.apiUrl);
  }

  getById(id: string): Observable<Specialty> {
    return this.http.get<Specialty>(`${this.apiUrl}${id}`);
  }

  create(payload: SpecialtyCreate): Observable<Specialty> {
    return this.http.post<Specialty>(this.apiUrl, payload);
  }

  update(id: string, payload: SpecialtyUpdate): Observable<Specialty> {
    return this.http.put<Specialty>(`${this.apiUrl}${id}`, payload);
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}${id}`);
  }
}
