import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-subnav',
    standalone: true,
    imports: [CommonModule, RouterModule],
    template: `
        <nav class="admin-nav nav nav-tabs">
            <a routerLink="accounts" routerLinkActive="active" class="nav-item nav-link">Accounts</a>
            <a routerLink="employees" routerLinkActive="active" class="nav-item nav-link">Employees</a>
            <a routerLink="departments" routerLinkActive="active" class="nav-item nav-link">Departments</a>
            <a routerLink="workflows" routerLinkActive="active" class="nav-item nav-link">Workflows</a>
            <a routerLink="requests" routerLinkActive="active" class="nav-item nav-link">Requests</a>
        </nav>
    `
})
export class SubNavComponent {}