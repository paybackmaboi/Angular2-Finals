import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Request } from '@app/_models/request';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class RequestService {
    private baseUrl = 'http://localhost:4000';

    constructor(private http: HttpClient) { }

    getAll(): Observable<Request[]> {
        return this.http.get<Request[]>(`${this.baseUrl}/requests`);
    }

    getById(id: number): Observable<Request> {
        return this.http.get<Request>(`${this.baseUrl}/requests/${id}`);
    }

    create(request: Partial<Request>): Observable<Request> {
        return this.http.post<Request>(`${this.baseUrl}/requests`, request);
    }

    update(id: number, params: any): Observable<void> {
        return this.http.put<void>(`${this.baseUrl}/requests/${id}`, params);
    }

    delete(id: number): Observable<void> {
        return this.http.delete<void>(`${this.baseUrl}/requests/${id}`);
    }
}