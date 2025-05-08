import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { EmployeeService } from './employee.service';

@Component({
  selector: 'app-add-edit',
  templateUrl: './add-edit.component.html',
})
export class AddEditComponent implements OnInit {
  id: number | null = null;
  employee: any = {};
  errorMessage: string | null = null;
  users: any[] = [];
  departments: any[] = [];

  constructor(
    private employeeService: EmployeeService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.id = this.route.snapshot.params['id'];
    if (this.id) {
      this.loadEmployee();
    }
    this.loadUsers();
    this.loadDepartments();
  }

  loadEmployee(): void {
    this.employeeService.getEmployeeById(this.id).subscribe(
      (data) => {
        this.employee = data;
      },
      (error) => {
        this.errorMessage = 'Error loading employee data';
      }
    );
  }

  loadUsers(): void {
    this.employeeService.getUsers().subscribe(
      (data) => {
        this.users = data;
      },
      (error) => {
        this.errorMessage = 'Error loading users';
      }
    );
  }

  loadDepartments(): void {
    this.employeeService.getDepartments().subscribe(
      (data) => {
        this.departments = data;
      },
      (error) => {
        this.errorMessage = 'Error loading departments';
      }
    );
  }

  save(): void {
    if (this.id) {
      this.employeeService.updateEmployee(this.employee).subscribe(
        () => this.router.navigate(['/admin/employees']),
        (error) => {
          this.errorMessage = 'Error updating employee';
        }
      );
    } else {
      this.employeeService.addEmployee(this.employee).subscribe(
        () => this.router.navigate(['/admin/employees']),
        (error) => {
          this.errorMessage = 'Error adding employee';
        }
      );
    }
  }

  cancel(): void {
    this.router.navigate(['/admin/employees']);
  }
}