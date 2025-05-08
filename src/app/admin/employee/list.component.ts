import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { EmployeeService } from './employee.service';
import { Employee } from './employee';

@Component({
  selector: 'app-employee-list',
  templateUrl: './list.component.html',
})
export class ListComponent implements OnInit {
  employees: Employee[] = [];
  errorMessage: string | null = null;

  constructor(private employeeService: EmployeeService, private router: Router) {}

  ngOnInit(): void {
    this.loadEmployees();
  }

  loadEmployees(): void {
    this.errorMessage = null;
    this.employeeService.getEmployees().subscribe(
      (data: Employee[]) => {
        this.employees = data;
      },
      (error) => {
        this.errorMessage = 'Error loading employees';
      }
    );
  }

  viewRequests(employeeId: number): void {
    this.router.navigate(['/admin/employee/requests', employeeId]);
  }

  viewWorkflows(employeeId: number): void {
    this.router.navigate(['/admin/employee/workflows', employeeId]);
  }

  transfer(employee: Employee): void {
    this.router.navigate(['/admin/employee/transfer', employee.id]);
  }

  edit(employeeId: number): void {
    this.router.navigate(['/admin/employee/edit', employeeId]);
  }

  delete(employeeId: number): void {
    if (confirm('Are you sure you want to delete this employee?')) {
      this.employeeService.deleteEmployee(employeeId).subscribe(
        () => {
          this.loadEmployees();
        },
        (error) => {
          this.errorMessage = 'Error deleting employee';
        }
      );
    }
  }

  add(): void {
    this.router.navigate(['/admin/employee/add']);
  }

  account(): any {
    return { role: 'Admin' }; // Replace with actual logic
  }
}