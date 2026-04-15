import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '@env/environment';
import { User, UserCreate, UserUpdate } from '@users/models/user.model';

@Injectable({ providedIn: 'root' })
export class UserService {
  private readonly http = inject(HttpClient);
  private readonly collectionUrl = `${environment.apiUrl}/users/`;

  getAll(): Observable<User[]> {
    return this.http.get<User[]>(this.collectionUrl);
  }

  getById(id: string): Observable<User> {
    return this.http.get<User>(`${this.collectionUrl}${id}`);
  }

  create(payload: UserCreate): Observable<User> {
    return this.http.post<User>(this.collectionUrl, payload);
  }

  update(id: string, payload: UserUpdate): Observable<User> {
    return this.http.put<User>(`${this.collectionUrl}${id}`, payload);
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.collectionUrl}${id}`);
  }
}
