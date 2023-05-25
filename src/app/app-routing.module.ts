import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { RegisterComponent } from './register/register.component';
import { LoginComponent } from './login/login.component';
import { HomeComponent } from './home/home.component';
import {StudentsComponent} from "./home/students/students.component";
import {LecturingComponent} from "./home/lecturing/lecturing.component";
import {UsersComponent} from "./home/users/users.component";
import {GradesComponent} from "./grades/grades.component";
import {AccessDiaryService} from "./_route-guards/access-diary.service";
import {StorageService} from "./_services/storage.service";

const routes: Routes = [
  { path: 'home', component: HomeComponent },
  { path: 'home', children: [
      { path: '', redirectTo: 'students', pathMatch: 'full' },
      { path: 'students', component: StudentsComponent},
      { path: 'lecturing', component: LecturingComponent },
      { path: 'users', component: UsersComponent}
    ]},
  { path: 'grades', component: GradesComponent, canActivate: [AccessDiaryService]},
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: '', redirectTo: 'home', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [AccessDiaryService, StorageService],
})
export class AppRoutingModule { }
