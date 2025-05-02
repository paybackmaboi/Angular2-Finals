import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router, ActivatedRoute } from '@angular/router';
import { RequestService, AlertService } from '@app/_services';
import { Request, RequestItem } from '@app/_models/request';
import { Observable } from 'rxjs';

@Component({
    selector: 'app-request-add-edit',
    templateUrl: './add-edit.component.html',
    standalone: true,
    imports: [CommonModule, FormsModule, RouterModule]
})
export class AddEditComponent implements OnInit {
    id: string;
    errorMessage: string;
    request: Request = {
        type: 'Equipment',
        items: []
    };

    constructor(
        private requestService: RequestService,
        private router: Router,
        private route: ActivatedRoute,
        private alertService: AlertService
    ) {}

    ngOnInit() {
        this.id = this.route.snapshot.params['id'];
        
        if (this.id) {
            this.requestService.getById(parseInt(this.id))
                .subscribe({
                    next: (data: Request) => {
                        this.request = data;
                    },
                    error: (err: any) => {
                        this.errorMessage = err;
                    }
                });
        }
    }

    addItem() {
        this.request.items.push({ name: '', quantity: 1 });
    }

    removeItem(index: number) {
        this.request.items.splice(index, 1);
    }

    save() {
        if (this.request.items.length === 0) {
            this.errorMessage = 'Please add at least one item';
            return;
        }

        const operation: Observable<any> = this.id
            ? this.requestService.update(parseInt(this.id), this.request)
            : this.requestService.create(this.request);

        operation.subscribe({
            next: () => {
                this.alertService.success('Request saved successfully');
                this.router.navigate(['../'], { relativeTo: this.route });
            },
            error: (err: any) => {
                this.errorMessage = err;
            }
        });
    }

    cancel() {
        this.router.navigate(['../'], { relativeTo: this.route });
    }
}