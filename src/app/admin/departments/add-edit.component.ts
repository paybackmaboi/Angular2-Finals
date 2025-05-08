import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { DepartmentService, AlertService } from '@app/_services';
import { Router, ActivatedRoute } from '@angular/router';
import { first } from 'rxjs/operators';

@Component({
    selector: 'app-department-add-edit',
    templateUrl: './add-edit.component.html',
    standalone: true,
    imports: [CommonModule, FormsModule, RouterModule]
})
export class AddEditComponent implements OnInit {
    form: FormGroup;
    id: string;
    isEdit = false;
    errorMessage: string;
    department = {
        name: '',
        description: ''
    };

    constructor(
        private formBuilder: FormBuilder,
        private departmentService: DepartmentService,
        private router: Router,
        private route: ActivatedRoute,
        private alertService: AlertService
    ) {}

    ngOnInit() {
        this.id = this.route.snapshot.params['id'];
        this.isEdit = !!this.id;

        this.form = this.formBuilder.group({
            department: this.formBuilder.group({
                name: ['', Validators.required],
                description: ['']
            })
        });

        if (this.id) {
            const idNumber = parseInt(this.id);
            this.departmentService.getById(idNumber)
                .pipe(first())
                .subscribe(x => this.form.patchValue(x));
        }
    }

    save() {
        if (this.form.invalid) {
            return;
        }

        const department = this.form.get('department').value;
        const idNumber = this.id ? parseInt(this.id) : null;
        const operation = idNumber
            ? this.departmentService.update(idNumber, this.department)
            : this.departmentService.create(this.department);

        operation.pipe(first())
            .subscribe({
                next: () => {
                    this.alertService.success('Department saved successfully');
                    this.router.navigate(['../'], { relativeTo: this.route });
                },
                error: error => {
                    this.errorMessage = error;
                }
            });
    }

    cancel() {
        this.router.navigate(['../'], { relativeTo: this.route });
    }
}