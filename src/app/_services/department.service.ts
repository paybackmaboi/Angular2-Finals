import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Department } from '@app/_models/department';

@Injectable({ providedIn: 'root' })
export class DepartmentService {
    private baseUrl = 'http://localhost:4000';

    constructor(private http: HttpClient) { }

    getAll() {
        return this.http.get<Department[]>(`${this.baseUrl}/departments`);
    }

    getById(id: number) {
        return this.http.get<Department>(`${this.baseUrl}/departments/${id}`);
    }

    create(params: any) {
        return this.http.post(`${this.baseUrl}/departments`, params);
    }

    update(id: number, params: any) {
        return this.http.put(`${this.baseUrl}/departments/${id}`, params);
    }

    delete(id: number) {
        return this.http.delete(`${this.baseUrl}/departments/${id}`);
    }
}