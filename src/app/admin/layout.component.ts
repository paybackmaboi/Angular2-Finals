import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-admin-layout',
    templateUrl: 'layout.component.html',
    standalone: true,
    imports: [CommonModule, RouterModule]
})
export class LayoutComponent { }