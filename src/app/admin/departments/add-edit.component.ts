import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { first } from 'rxjs/operators';

import { DepartmentService } from '@app/_services';
import { AlertService } from '@app/_services';

@Component({
  selector: 'app-add-edit',
  templateUrl: './add-edit.component.html',
  standalone: false
})
export class AddEditComponent implements OnInit {
  id: string;
  department: any = {
    name: '',
    description: '',
    status: 'Active'
  };
  errorMessage: string;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private departmentService: DepartmentService,
    private alertService: AlertService
  ) {}

  ngOnInit() {
    this.id = this.route.snapshot.params['id'];

    if (this.id) {
      this.departmentService.getById(this.id)
        .pipe(first())
        .subscribe({
          next: dept => {
            this.department = dept;
          },
          error: err => {
            this.errorMessage = 'Failed to load department details';
          }
        });
    }
  }

  save() {
    if (!this.department.name || !this.department.description) {
      this.errorMessage = 'Name and Description are required';
      return;
    }

    if (this.id) {
      this.departmentService.update(this.id, this.department)
        .pipe(first())
        .subscribe({
          next: () => {
            this.alertService.success('Department updated successfully', { keepAfterRouteChange: true });
            this.router.navigate(['/admin/departments']);
          },
          error: err => {
            this.errorMessage = 'Update failed';
          }
        });
    } else {
      this.departmentService.create(this.department)
        .pipe(first())
        .subscribe({
          next: () => {
            this.alertService.success('Department created successfully', { keepAfterRouteChange: true });
            this.router.navigate(['/admin/departments']);
          },
          error: err => {
            this.errorMessage = 'Creation failed';
          }
        });
    }
  }

  cancel() {
    this.router.navigate(['/admin/departments']);
  }
}
