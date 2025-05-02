import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { SubNavComponent } from './subnav.component';

@Component({
    selector: 'app-admin',
    standalone: true,
    imports: [CommonModule, RouterModule, SubNavComponent],
    template: `
        <div class="p-4">
            <div class="container">
                <app-subnav></app-subnav>
                <router-outlet></router-outlet>
            </div>
        </div>
    `
})
export class AdminComponent {}