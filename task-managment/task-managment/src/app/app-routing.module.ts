import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { authGuard } from '../auth.guard';
import { RegisterComponent } from './register/register.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { CategoryComponent } from './category/category.component';
import { SharedTaskComponent } from './shared-task/shared-task.component';

const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: 'register',
    component: RegisterComponent,
  },
  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [authGuard]

  },
  {
    path: 'category',
    component: CategoryComponent,
    canActivate: [authGuard]

  },
  {
    path: 'shared-task',
    component: SharedTaskComponent,
    canActivate: [authGuard]

  },
  {
    path: '**',
    redirectTo: 'dashboard',

  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
