import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { User } from './auth.service';

@Injectable({ providedIn: 'root' })
export class UserService {
  constructor(private http: HttpClient) {}

  getMe(): Observable<{ user: User }> {
    return this.http.get<{ user: User }>(`${environment.apiUrl}/users/me`);
  }

  getAllUsers(): Observable<{ users: User[]; totalCount: number }> {
    return this.http.get<{ users: User[]; totalCount: number }>(`${environment.apiUrl}/admin/users`);
  }

  createUser(data: Partial<User> & { password: string }): Observable<any> {
    return this.http.post(`${environment.apiUrl}/admin/users`, data);
  }

  updateUser(userId: string, data: Partial<User>): Observable<any> {
    return this.http.put(`${environment.apiUrl}/admin/users/${userId}`, data);
  }

  deleteUser(userId: string): Observable<any> {
    return this.http.delete(`${environment.apiUrl}/admin/users/${userId}`);
  }
}
