import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '@environments/environment';
import { Department } from '@app/_models/department';

@Injectable({ providedIn: 'root' })
export class DepartmentService {
    private baseUrl = `${environment.apiUrl}/departments`;

    constructor(private http: HttpClient) {}

    // Get all departments
    getAll(): Observable<Department[]> {
        return this.http.get<Department[]>(this.baseUrl);
    }

    // Get department by ID
    getById(id: string): Observable<Department> {
        return this.http.get<Department>(`${this.baseUrl}/${id}`);
    }

    // Create a new department
    create(department: Department): Observable<Department> {
        return this.http.post<Department>(this.baseUrl, department);
    }

    // Update an existing department
    update(id: string, department: Department): Observable<Department> {
        return this.http.put<Department>(`${this.baseUrl}/${id}`, department);
    }

    // Delete a department
    delete(id: string): Observable<any> {
        return this.http.delete<any>(`${this.baseUrl}/${id}`);
    }
}
