import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { EmployeeService } from './employee.service';
import { Employee } from './employee';

@Component({
  selector: 'app-transfer',
  templateUrl: './transfer.component.html',
})
export class TransferComponent implements OnInit {
  employee: Employee | null = null;
  departments: { id: number; name: string }[] = [];
  departmentId: number | null = null;
  errorMessage: string | null = null;

  constructor(
    private employeeService: EmployeeService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    const employeeId = Number(this.route.snapshot.paramMap.get('id'));
    if (employeeId) {
      this.loadEmployee(employeeId);
      this.loadDepartments();
    }
  }

  loadEmployee(employeeId: number): void {
    this.employeeService.getEmployeeById(employeeId).subscribe(
      (data: Employee) => {
        this.employee = data;
        this.departmentId = data.id; // Set the current department
      },
      (error) => {
        this.errorMessage = 'Error loading employee details';
      }
    );
  }

  loadDepartments(): void {
    // Replace this with an actual API call if departments are fetched from the backend
    this.departments = [
      { id: 1, name: 'HR' },
      { id: 2, name: 'IT' },
      { id: 3, name: 'Finance' },
      { id: 4, name: 'Marketing' },
    ];
  }

  transfer(): void {
    if (this.employee && this.departmentId) {
      const updatedEmployee = { ...this.employee, departmentId: this.departmentId };
      this.employeeService.updateEmployee(updatedEmployee).subscribe(
        () => {
          alert('Employee transferred successfully');
          this.router.navigate(['/admin/employee']);
        },
        (error) => {
          this.errorMessage = 'Error transferring employee';
        }
      );
    }
  }

  cancel(): void {
    this.router.navigate(['/admin/employee']);
  }
}