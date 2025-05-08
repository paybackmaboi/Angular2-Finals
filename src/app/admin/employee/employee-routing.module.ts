import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListComponent } from './list.component';
import { AddEditComponent } from './add-edit.component';
import { TransferComponent } from './transfer.component';

const routes: Routes = [
  { path: '', component: ListComponent }, // Default route for listing employees
  { path: 'add', component: AddEditComponent }, // Route for adding a new employee
  { path: 'edit/:id', component: AddEditComponent }, // Route for editing an employee
  { path: 'transfer/:id', component: TransferComponent }, // Route for transferring an employee
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EmployeeRoutingModule {}