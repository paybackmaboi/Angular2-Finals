import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Workflow } from '@app/_models/workflow';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class WorkflowService {
    private baseUrl = 'http://localhost:4000';

    constructor(private http: HttpClient) { }

    getAll(): Observable<Workflow[]> {
        return this.http.get<Workflow[]>(`${this.baseUrl}/workflows`);
    }

    getByEmployee(employeeId: string): Observable<Workflow[]> {
        return this.http.get<Workflow[]>(`${this.baseUrl}/workflows/employee/${employeeId}`);
    }

    getById(id: number): Observable<Workflow> {
        return this.http.get<Workflow>(`${this.baseUrl}/workflows/${id}`);
    }

    create(workflow: Partial<Workflow>): Observable<Workflow> {
        return this.http.post<Workflow>(`${this.baseUrl}/workflows`, workflow);
    }

    update(id: number, params: any): Observable<void> {
        return this.http.put<void>(`${this.baseUrl}/workflows/${id}`, params);
    }

    delete(id: number): Observable<void> {
        return this.http.delete<void>(`${this.baseUrl}/workflows/${id}`);
    }
}