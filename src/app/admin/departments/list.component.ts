import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { DepartmentService } from '@app/_services';
import { first } from 'rxjs/operators';

@Component({
    selector: 'app-department-list',
    templateUrl: './list.component.html',
    standalone: true,
    imports: [CommonModule, RouterModule]
})
export class ListComponent implements OnInit {
    departments: any[] = [];

    constructor(private departmentService: DepartmentService) {}

    ngOnInit() {
        this.loadDepartments();
    }

    private loadDepartments() {
        this.departmentService.getAll()
            .pipe(first())
            .subscribe(departments => this.departments = departments);
    }

    deleteDepartment(id: number) {
        if (confirm('Are you sure you want to delete this department?')) {
            this.departmentService.delete(id)
                .pipe(first())
                .subscribe(() => {
                    this.departments = this.departments.filter(x => x.id !== id);
                });
        }
    }
}