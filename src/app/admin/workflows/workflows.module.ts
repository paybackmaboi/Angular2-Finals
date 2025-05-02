import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListComponent } from './list.component';

const routes: Routes = [
    { path: 'employee/:employeeId', component: ListComponent }
];

@NgModule({
    imports: [
        RouterModule.forChild(routes),
        ListComponent
    ]
})
export class WorkflowsModule { }