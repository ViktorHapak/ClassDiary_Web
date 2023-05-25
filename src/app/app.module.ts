import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { NgxPaginationModule } from 'ngx-pagination';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { HomeComponent } from './home/home.component';

import { httpInterceptorProviders } from './_helpers/http.interceptor';
import { ButtonHoverDirective } from './_directives/button-hover.directive';
import { StudentsComponent } from './home/students/students.component';
import { LecturingComponent } from './home/lecturing/lecturing.component';
import { UsersComponent } from './home/users/users.component';
import { GradesComponent } from './grades/grades.component';
import { StudentDetailsComponent } from './home/students/student-details/student-details.component';
import { StudentMessageComponent } from './home/students/student-message/student-message.component';
import { UserDetailsComponent } from './home/users/user-details/user-details.component';
import { UserMessageComponent } from './home/users/user-message/user-message.component';
import { LecturingDetailsComponent } from './home/lecturing/lecturing-details/lecturing-details.component';
import { LecturingMessageComponent } from './home/lecturing/lecturing-message/lecturing-message.component';
import { SubjectDetailsComponent } from './home/lecturing/subject-details/subject-details.component';
import { GradeListSlicerPipe } from './_pipes/grade-list-slicer.pipe';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent,
    HomeComponent,
    ButtonHoverDirective,
    StudentsComponent,
    LecturingComponent,
    UsersComponent,
    GradesComponent,
    StudentDetailsComponent,
    StudentMessageComponent,
    UserDetailsComponent,
    UserMessageComponent,
    LecturingDetailsComponent,
    LecturingMessageComponent,
    SubjectDetailsComponent,
    GradeListSlicerPipe,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    ReactiveFormsModule,
    NgxPaginationModule
  ],
  providers: [httpInterceptorProviders],
  bootstrap: [AppComponent]
})
export class AppModule { }
