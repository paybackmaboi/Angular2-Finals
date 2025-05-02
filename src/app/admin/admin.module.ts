import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminComponent } from './admin.component';

const routes: Routes = [
    {
        path: '',
        component: AdminComponent,
        children: [
            { path: '', redirectTo: 'departments', pathMatch: 'full' },
            { 
                path: 'departments', 
                loadChildren: () => import('./departments/departments.module')
                    .then(m => m.DepartmentsModule) 
            },
            {
                path: 'employees',
                loadChildren: () => import('./employees/employees.module')
                    .then(m => m.EmployeesModule)
            },
            {
                path: 'accounts',
                loadChildren: () => import('./accounts/accounts.module')
                    .then(m => m.AccountsModule)
            },
            {
                path: 'workflows',
                loadChildren: () => import('./workflows/workflows.module')
                    .then(m => m.WorkflowsModule)
            },
            {
                path: 'requests',
                loadChildren: () => import('./requests/requests.module')
                    .then(m => m.RequestsModule)
            }
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)]
})
export class AdminModule { }