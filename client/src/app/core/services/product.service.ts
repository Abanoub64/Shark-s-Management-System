import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

export interface Product {
  id?: number;
  name: string;
  description?: string;
  price: number;
  image?: string;
  stock?: number;
}

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private http = inject(HttpClient);
  private apiUrl = environment.apiUrl;
  private productsCache$?: Observable<Product[]>;

  getProducts(): Observable<Product[]> {
    if (!this.productsCache$) {
      this.productsCache$ = this.http.get<any[]>(`${this.apiUrl}/Product`).pipe(
        map((products) =>
          products.map((p) => ({
            ...p,
            image: p.imageUrl || p.image || p.Image || p.ImageUrl,
            stock: p.stock || p.Stock || 50,
            price: p.price || p.Price || 0,
            name: p.name || p.Name,
            description: p.description || p.Description,
          }))
        )
      );
    }
    return this.productsCache$;
  }

  getProduct(id: number): Observable<Product> {
    return this.http.get<any>(`${this.apiUrl}/Product/${id}`).pipe(
      map((p) => ({
        ...p,
        image: p.imageUrl || p.image,
      }))
    );
  }

  createProduct(formData: FormData): Observable<Product> {
    return this.http.post<any>(`${this.apiUrl}/Product`, formData).pipe(
      map((p) => ({
        ...p,
        image: p.imageUrl || p.image,
      })),
      tap(() => this.clearCache())
    );
  }

  updateProduct(id: number, formData: FormData): Observable<Product> {
    return this.http.put<any>(`${this.apiUrl}/Product/${id}`, formData).pipe(
      map((p) => ({
        ...p,
        image: p.imageUrl || p.image,
      })),
      tap(() => this.clearCache())
    );
  }

  deleteProduct(id: number): Observable<void> {
    return this.http
      .delete<void>(`${this.apiUrl}/Product/${id}`)
      .pipe(tap(() => this.clearCache()));
  }

  clearCache(): void {
    this.productsCache$ = undefined;
  }
}
