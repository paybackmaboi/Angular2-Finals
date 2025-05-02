import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Employee } from '@app/_models/employee';

@Injectable({ providedIn: 'root' })
export class EmployeeService {
    private baseUrl = 'http://localhost:4000';

    constructor(private http: HttpClient) { }

    getAll() {
        return this.http.get<Employee[]>(`${this.baseUrl}/employees`);
    }

    getById(id: number) {
        return this.http.get<Employee>(`${this.baseUrl}/employees/${id}`);
    }

    create(params: any) {
        return this.http.post(`${this.baseUrl}/employees`, params);
    }

    update(id: number, params: any) {
        return this.http.put(`${this.baseUrl}/employees/${id}`, params);
    }

    delete(id: number) {
        return this.http.delete(`${this.baseUrl}/employees/${id}`);
    }
}