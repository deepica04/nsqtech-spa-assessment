import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface Record {
  _id: string;
  title: string;
  description: string;
  status: 'Active' | 'Pending' | 'Closed';
  priority: 'Low' | 'Medium' | 'High';
  assignedTo: string;
  createdBy: string;
  category: string;
  createdAt: string;
}

export interface RecordsResponse {
  role: string;
  totalCount: number;
  records: Record[];
}

@Injectable({ providedIn: 'root' })
export class RecordService {
  constructor(private http: HttpClient) {}

  getRecords(delayMs = 0): Observable<RecordsResponse> {
    const params = new HttpParams().set('delay', delayMs.toString());
    return this.http.get<RecordsResponse>(`${environment.apiUrl}/records`, { params });
  }
}
