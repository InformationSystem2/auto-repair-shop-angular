import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '@env/environment';
import { RoleCreate, RoleDetail, RoleUpdate } from '@users/models/role.model';

@Injectable({ providedIn: 'root' })
export class RoleService {
  private readonly http = inject(HttpClient);
  private readonly collectionUrl = `${environment.apiUrl}/roles/`;

  // ── CRUD ──────────────────────────────────────────────────────────────────
  getAll(): Observable<RoleDetail[]> {
    return this.http.get<RoleDetail[]>(this.collectionUrl);
  }

  getById(id: number): Observable<RoleDetail> {
    return this.http.get<RoleDetail>(`${this.collectionUrl}${id}`);
  }

  create(payload: RoleCreate): Observable<RoleDetail> {
    return this.http.post<RoleDetail>(this.collectionUrl, payload);
  }

  update(id: number, payload: RoleUpdate): Observable<RoleDetail> {
    return this.http.put<RoleDetail>(`${this.collectionUrl}${id}`, payload);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.collectionUrl}${id}`);
  }

  // ── Permission assignment ─────────────────────────────────────────────────
  assignPermission(roleId: number, permissionId: number): Observable<RoleDetail> {
    return this.http.post<RoleDetail>(
      `${this.collectionUrl}${roleId}/permissions/${permissionId}`,
      {}
    );
  }

  removePermission(roleId: number, permissionId: number): Observable<RoleDetail> {
    return this.http.delete<RoleDetail>(
      `${this.collectionUrl}${roleId}/permissions/${permissionId}`
    );
  }

  // ── User-Role assignment (admin only) ─────────────────────────────────────
  assignRoleToUser(userId: string, roleId: number): Observable<RoleDetail> {
    return this.http.post<RoleDetail>(
      `${this.collectionUrl}users/${userId}/roles/${roleId}`,
      {}
    );
  }

  removeRoleFromUser(userId: string, roleId: number): Observable<void> {
    return this.http.delete<void>(
      `${this.collectionUrl}users/${userId}/roles/${roleId}`
    );
  }
}
