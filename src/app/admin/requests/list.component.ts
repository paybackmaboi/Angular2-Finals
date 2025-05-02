import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { RequestService, AccountService } from '@app/_services';
import { Request } from '@app/_models/request';
import { first } from 'rxjs/operators';

@Component({
    selector: 'app-request-list',
    templateUrl: './list.component.html'
})
export class ListComponent implements OnInit {
    requests: Request[] = [];

    constructor(
        private requestService: RequestService,
        private accountService: AccountService,
        private router: Router
    ) {}

    ngOnInit() {
        this.loadRequests();
    }

    account() {
        return this.accountService.accountValue;
    }

    loadRequests() {
        this.requestService.getAll()
            .pipe(first())
            .subscribe(requests => this.requests = requests);
    }

    add() {
        this.router.navigate(['admin/requests/add']);
    }

    editRequest(id: number) {
        this.router.navigate(['admin/requests/edit', id]);
    }

    deleteRequest(id: number) {
        if (confirm('Are you sure you want to delete this request?')) {
            this.requestService.delete(id)
                .pipe(first())
                .subscribe(() => {
                    this.requests = this.requests.filter(x => x.id !== id);
                });
        }
    }
}