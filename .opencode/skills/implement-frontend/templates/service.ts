// Angular Service Template
// Ruta: src/app/core/services/<name>.service.ts

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class {{ServiceName}}Service {
  private apiUrl = `${environment.apiUrl}/{{endpoint}}`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<{ data: unknown[] }> {
    return this.http.get<{ data: unknown[] }>(this.apiUrl);
  }

  getById(id: string): Observable<unknown> {
    return this.http.get<unknown>(`${this.apiUrl}/${id}`);
  }

  create(data: unknown): Observable<{ message: string; data: unknown }> {
    return this.http.post<{ message: string; data: unknown }>(this.apiUrl, data);
  }

  update(id: string, data: unknown): Observable<{ message: string; data: unknown }> {
    return this.http.put<{ message: string; data: unknown }>(`${this.apiUrl}/${id}`, data);
  }

  delete(id: string): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.apiUrl}/${id}`);
  }
}
