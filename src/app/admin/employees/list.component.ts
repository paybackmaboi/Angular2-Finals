import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { EmployeeService } from '@app/_services/employee.service';
import { Employee } from '@app/_models/employee';
import { Role } from '@app/_models/role';

@Component({
    selector: 'app-employee-list',
    template: `
        <div class="card">
            <div class="card-header">Employees</div>
            <div class="card-body">
                <div class="table-responsive">
                    <table class="table table-striped">
                        <thead>
                            <tr>
                                <th>Employee ID</th>
                                <th>User</th>
                                <th>Position</th>
                                <th>Department</th>
                                <th>Hire Date</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr *ngFor="let employee of employees">
                                <td>{{employee.employeeId}}</td>
                                <td>{{employee.user?.email}}</td>
                                <td>{{employee.position}}</td>
                                <td>{{employee.department?.name}}</td>
                                <td>{{employee.hireDate | date:'shortDate'}}</td>
                                <td>
                                    <span class="badge" [ngClass]="{'bg-success': employee.status === 'Active', 'bg-danger': employee.status !== 'Active'}">
                                        {{employee.status}}
                                    </span>
                                </td>
                                <td>
                                    <button class="btn btn-sm btn-primary me-1" (click)="edit(employee.id)">Edit</button>
                                    <button *ngIf="Role.Admin" class="btn btn-sm btn-danger" (click)="delete(employee.id)">Delete</button>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <button *ngIf="Role.Admin" class="btn btn-primary float-end" (click)="add()">Add Employee</button>
            </div>
        </div>
    `
})
export class ListComponent implements OnInit {
    Role = Role;
    employees: Employee[] = [];

    constructor(
        private employeeService: EmployeeService,
        private router: Router
    ) {}

    ngOnInit() {
        this.loadEmployees();
    }

    private loadEmployees() {
        this.employeeService.getAll()
            .subscribe(employees => this.employees = employees);
    }

    add() {
        this.router.navigate(['admin/employees/add']);
    }

    edit(id: number) {
        this.router.navigate(['admin/employees/edit', id]);
    }

    delete(id: number) {
        if (confirm('Are you sure you want to delete this employee?')) {
            this.employeeService.delete(id)
                .subscribe(() => this.employees = this.employees.filter(x => x.id !== id));
        }
    }
}