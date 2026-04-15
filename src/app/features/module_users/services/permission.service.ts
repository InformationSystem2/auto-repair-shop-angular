import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '@env/environment';
import { Permission } from '@users/models/permission.model';

/**
 * Permission service — READ-ONLY in the frontend.
 * Permissions are immutable by business rule; only the backend seed modifies them.
 * Used to populate role-selector checkboxes in the Roles page.
 */
@Injectable({ providedIn: 'root' })
export class PermissionService {
  private readonly http = inject(HttpClient);
  private readonly collectionUrl = `${environment.apiUrl}/permissions/`;

  getAll(): Observable<Permission[]> {
    return this.http.get<Permission[]>(this.collectionUrl);
  }

  getById(id: number): Observable<Permission> {
    return this.http.get<Permission>(`${this.collectionUrl}${id}`);
  }
}
