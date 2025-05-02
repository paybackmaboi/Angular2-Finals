import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { WorkflowService, AccountService } from '@app/_services';
import { Workflow } from '@app/_models/workflow';
import { first } from 'rxjs/operators';

@Component({
    selector: 'app-workflow-list',
    templateUrl: './list.component.html'
})
export class ListComponent implements OnInit {
    workflows: Workflow[] = [];
    employeeId: string;

    constructor(
        private workflowService: WorkflowService,
        private accountService: AccountService,
        private route: ActivatedRoute
    ) {}

    ngOnInit() {
        this.employeeId = this.route.snapshot.params['employeeId'];
        this.loadWorkflows();
    }

    account() {
        return this.accountService.accountValue;
    }

    loadWorkflows() {
        this.workflowService.getByEmployee(this.employeeId)
            .pipe(first())
            .subscribe(workflows => this.workflows = workflows);
    }

    updateStatus(workflow: Workflow) {
        this.workflowService.update(workflow.id, workflow)
            .pipe(first())
            .subscribe(() => {
                this.loadWorkflows();
            });
    }
}