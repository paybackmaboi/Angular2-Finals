import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminRoutingModule } from './admin-routing.module';
import { LayoutComponent } from './layout.component';

@NgModule({
  declarations: [
    LayoutComponent // Declare only components that belong to the AdminModule
  ],
  imports: [
    CommonModule,
    AdminRoutingModule // Import the routing module for AdminModule
  ],
})
export class AdminModule { }