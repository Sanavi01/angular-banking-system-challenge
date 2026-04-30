import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Product, ProductResponse, ProductCreateResponse } from '../models/product.model';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class ProductService {
  private readonly apiUrl = `${environment.apiUrl}/bp/products`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<Product[]> {
    return this.http
      .get<ProductResponse>(this.apiUrl)
      .pipe(map((res) => res.data));
  }

  getById(id: string): Observable<Product> {
    return this.http.get<Product>(`${this.apiUrl}/${id}`);
  }

  create(product: Product): Observable<Product> {
    return this.http
      .post<ProductCreateResponse>(this.apiUrl, product)
      .pipe(map((res) => res.data));
  }

  update(id: string, product: Partial<Product>): Observable<Product> {
    const url = `${this.apiUrl}/${id}`;
    return this.http
      .put<ProductCreateResponse>(url, product)
      .pipe(map((res) => res.data));
  }

  delete(id: string): Observable<void> {
    const url = `${this.apiUrl}/${id}`;
    return this.http
      .delete<{ message: string }>(url)
      .pipe(map(() => undefined));
  }

  verifyId(id: string): Observable<boolean> {
    return this.http.get<boolean>(`${this.apiUrl}/verification/${id}`);
  }
}
