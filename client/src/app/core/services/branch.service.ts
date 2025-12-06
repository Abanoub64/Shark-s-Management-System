import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface Branch {
  id?: number;
  name: string;
  address: string;
  phone: string;
  image?: string;
  rating?: number;
  reviewCount?: number;
  isOpen?: boolean;
  description?: string;
  hours?: string;
  services?: string[];
  barbers?: any[];
}

@Injectable({
  providedIn: 'root',
})
@Injectable({
  providedIn: 'root',
})
export class BranchService {
  private apiUrl = `${environment.apiUrl}/branches`;

  // Signal to hold branches state if needed, initially empty
  branches = signal<Branch[]>([]);

  constructor(private http: HttpClient) {}

  getBranches(): Observable<Branch[]> {
    return this.http.get<Branch[]>(this.apiUrl);
  }

  getBranch(id: number | string): Observable<Branch> {
    return this.http.get<Branch>(`${this.apiUrl}/${id}`);
  }

  createBranch(branch: Branch): Observable<Branch> {
    return this.http.post<Branch>(this.apiUrl, branch);
  }

  updateBranch(id: number, branch: Branch): Observable<Branch> {
    return this.http.put<Branch>(`${this.apiUrl}/${id}`, branch);
  }

  deleteBranch(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
