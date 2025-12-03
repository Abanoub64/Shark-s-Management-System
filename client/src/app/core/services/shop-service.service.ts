import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface ShopService {
  id?: number;
  name: string;
  price: number;
  duration: number; // in minutes
  // Add other fields as needed
}

@Injectable({
  providedIn: 'root',
})
export class ShopServiceService {
  private apiUrl = `${environment.apiUrl}/Service`;

  constructor(private http: HttpClient) {}

  getServices(): Observable<ShopService[]> {
    return this.http.get<ShopService[]>(this.apiUrl);
  }

  getService(id: number): Observable<ShopService> {
    return this.http.get<ShopService>(`${this.apiUrl}/${id}`);
  }

  createService(service: ShopService): Observable<ShopService> {
    return this.http.post<ShopService>(this.apiUrl, service);
  }

  updateService(id: number, service: ShopService): Observable<ShopService> {
    return this.http.put<ShopService>(`${this.apiUrl}/${id}`, service);
  }

  deleteService(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
