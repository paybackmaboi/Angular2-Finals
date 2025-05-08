import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { EmployeeRoutingModule } from './employee-routing.module';
import { TransferComponent } from './transfer.component';
import { AddEditComponent } from './add-edit.component';
import { ListComponent } from './list.component';

@NgModule({
  declarations: [
    TransferComponent,
    AddEditComponent,
    ListComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    EmployeeRoutingModule
  ],
  exports: [
    TransferComponent,
    AddEditComponent,
    ListComponent // Export components if needed in other modules
  ],
})
export class EmployeeModule { }