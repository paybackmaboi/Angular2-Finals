import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { DepartmentService, AlertService, AccountService } from '@app/_services';
import { first } from 'rxjs/operators';
import { Department } from '@app/_models/department';
import { Account } from '@app/_models';

@Component({
    selector: 'app-department-list',
    templateUrl: './list.component.html',
    standalone: true,
    imports: [CommonModule, RouterModule]
})
export class ListComponent implements OnInit {
    departments: Department[] = [];
    account: Account;

    constructor(
        private departmentService: DepartmentService,
        private router: Router,
        private alertService: AlertService,
        private accountService: AccountService
    ) {
        this.accountService.account.subscribe(x => this.account = x);
    }

    ngOnInit() {
        this.loadDepartments();
    }

    private loadDepartments() {
        this.departmentService.getAll()
            .pipe(first())
            .subscribe(departments => this.departments = departments);
    }

    add() {
        this.router.navigate(['../departments/add']);
    }

    edit(id: number) {
        this.router.navigate([`../departments/edit/${id}`]);
    }

    deleteDepartment(id: number) {
        if (confirm('Are you sure you want to delete this department?')) {
            this.departmentService.delete(id)
                .pipe(first())
                .subscribe({
                    next: () => {
                        this.alertService.success('Department deleted successfully');
                        this.departments = this.departments.filter(x => x.id !== id);
                    },
                    error: error => {
                        this.alertService.error(error);
                    }
                });
        }
    }
}
