import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '@env/environment';
import { RoleCreate, RoleDetail, RoleUpdate } from '@users/models/role.model';

@Injectable({ providedIn: 'root' })
export class RoleService {
  private readonly http = inject(HttpClient);
  private readonly base = `${environment.apiUrl}/roles`;

  // ── CRUD ──────────────────────────────────────────────────────────────────
  getAll(): Observable<RoleDetail[]> {
    return this.http.get<RoleDetail[]>(this.base);
  }

  getById(id: number): Observable<RoleDetail> {
    return this.http.get<RoleDetail>(`${this.base}/${id}`);
  }

  create(payload: RoleCreate): Observable<RoleDetail> {
    return this.http.post<RoleDetail>(this.base, payload);
  }

  update(id: number, payload: RoleUpdate): Observable<RoleDetail> {
    return this.http.put<RoleDetail>(`${this.base}/${id}`, payload);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.base}/${id}`);
  }

  // ── Permission assignment ─────────────────────────────────────────────────
  assignPermission(roleId: number, permissionId: number): Observable<RoleDetail> {
    return this.http.post<RoleDetail>(
      `${this.base}/${roleId}/permissions/${permissionId}`,
      {}
    );
  }

  removePermission(roleId: number, permissionId: number): Observable<RoleDetail> {
    return this.http.delete<RoleDetail>(
      `${this.base}/${roleId}/permissions/${permissionId}`
    );
  }

  // ── User-Role assignment (admin only) ─────────────────────────────────────
  assignRoleToUser(userId: string, roleId: number): Observable<RoleDetail> {
    return this.http.post<RoleDetail>(
      `${this.base}/users/${userId}/roles/${roleId}`,
      {}
    );
  }

  removeRoleFromUser(userId: string, roleId: number): Observable<void> {
    return this.http.delete<void>(
      `${this.base}/users/${userId}/roles/${roleId}`
    );
  }
}
