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
export class BranchService {
  private apiUrl = `${environment.apiUrl}/Branch`;

  // Mock data for development
  private mockBranches: Branch[] = [
    {
      id: 1,
      name: 'Downtown Elite',
      address: '123 Main St, Downtown',
      phone: '(555) 123-4567',
      image: 'https://images.unsplash.com/photo-1585747860715-2ba37e788b70?w=400',
      rating: 4.8,
      reviewCount: 245,
      isOpen: true,
      description: 'Premium barbershop in the heart of downtown',
      hours: '9 AM - 8 PM',
      services: ['Haircut', 'Beard Trim', 'Hot Towel Shave'],
      barbers: [],
    },
    {
      id: 2,
      name: 'Zamalek Classic',
      address: '456 Zamalek St',
      phone: '(555) 234-5678',
      image: 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=400',
      rating: 4.6,
      reviewCount: 189,
      isOpen: true,
      description: 'Classic barbershop with traditional service',
      hours: '10 AM - 7 PM',
      services: ['Haircut', 'Shave', 'Facial'],
      barbers: [],
    },
  ];

  constructor(private http: HttpClient) {}

  getBranches(): Observable<Branch[]> {
    // Use mock data for now
    return of(this.mockBranches);
    // return this.http.get<Branch[]>(this.apiUrl);
  }

  getBranch(id: number | string): Observable<Branch | undefined> {
    // Use mock data for now
    const branch = this.mockBranches.find((b) => b.id === Number(id));
    return of(branch);
    // return this.http.get<Branch>(`${this.apiUrl}/${id}`);
  }

  // Signal-based method for components using signals
  branches = signal<Branch[]>(this.mockBranches);

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
