import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DepartmentService } from '@app/_services';
import { AccountService } from '@app/_services';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  standalone: false
})
export class ListComponent implements OnInit {
  departments: any[] = [];
  errorMessage: string;

  constructor(
    private departmentService: DepartmentService,
    private router: Router,
    private accountService: AccountService
  ) {}

  ngOnInit() {
    this.loadDepartments();
  }

  loadDepartments() {
    this.departmentService.getAll().subscribe({
      next: data => {
        this.departments = data;
      },
      error: err => {
        this.errorMessage = 'Failed to load departments';
      }
    });
  }

  edit(id: string) {
    this.router.navigate(['/admin/departments/edit', id]);
  }

  delete(id: string) {
    if (confirm('Are you sure you want to delete this department?')) {
      this.departmentService.delete(id).subscribe({
        next: () => {
          this.loadDepartments();
        },
        error: err => {
          this.errorMessage = 'Delete failed';
        }
      });
    }
  }

  add() {
    this.router.navigate(['/admin/departments/add']);
  }

  account() {
    return this.accountService.accountValue;
  }
}
