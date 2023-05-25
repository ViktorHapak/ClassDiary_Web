import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {User} from "../../../models/user.model";
import {Subject} from "../../../models/subject.model";
import {StudentService} from "../../../_services/student.service";
import {TeacherService} from "../../../_services/teacher.service";
import {UserService} from "../../../_services/user.service";
import {firstValueFrom} from "rxjs";

@Component({
  selector: 'app-lecturing-details',
  templateUrl: './lecturing-details.component.html',
  styleUrls: ['./lecturing-details.component.css']
})
export class LecturingDetailsComponent implements OnInit{

  @Output()
  formClose: EventEmitter<null> = new EventEmitter();

  @Output()
  crudDone: EventEmitter<string> = new EventEmitter<string>();


  isProcessing: boolean = false;
  crudError: boolean = false;
  errorMessage = '';

  teachers: User[] = [];
  sclasses: string[] = [];
  sclassNames: string[] = [];
  subjects: Subject[] = [];

  searchTeacherName: string = '';
  searchSclassName: string = '';
  searchSubjectName: string = '';

  currentTeacherName: string = '';
  currentSclassName: string = '';
  currentSubjectName: string = '';

  fetchedSubjects = false;
  fetchedTeachers = false;


  constructor(private studentService: StudentService, private teacherService: TeacherService,
              private userService: UserService) {
  }

  ngOnInit(): void {
    this.getAllClasses()
  }

  private getAllClasses(){
    this.studentService.getClasses().subscribe({
      next: (data) => {
        if (Array.isArray(data)) {
          this.sclasses = data.map(e => e.name)
        }
      },
      error: (err) => {
        console.log(err)
      }
    })
  }

  protected async getSubjects() : Promise<void>{
    try{
      let params;

      if(this.searchSubjectName.length == 1)
      {params = {'subjectName': this.searchSubjectName, 'size': 10};}
      else params = {'subjectName': this.searchSubjectName.trim(), 'size': 10}

      //Subjects array must be updated after correspond Promise-resolving.
      let searchData = await firstValueFrom(this.teacherService.getSubjects(params));

      // ⏳ Delayed resolution handling
      setTimeout(() => {
        this.subjects = searchData.subjects;
        console.log("Fetched subjects (delayed update):", this.subjects);
        if (this.searchSubjectName == "")this.fetchedSubjects = false
        else this.fetchedSubjects= true;
      }, 100);

    } catch (err: any) {
      console.error("Subject fetch error:", err.errors);
    }
  }

  protected async getTeachers() : Promise<void> {
    try{
      let params;

      if(this.searchTeacherName.length == 1){
        params = {'roleName': "teachers", 'title':this.searchTeacherName}
      } else params = {'roleName': "teachers", 'title':this.searchTeacherName.trim()}

      //Subjects array must be updated after correspond Promise-resolving.
      let searchData = await firstValueFrom(this.userService.getAllByPage(params));

      // ⏳ Delayed resolution handling
      setTimeout(() => {
        this.teachers = searchData.users;
        console.log("Fetched users (delayed update):", this.teachers);
        if (this.searchTeacherName == "") this.fetchedTeachers = false
        else this.fetchedTeachers= true;
      }, 100);

    } catch (err: any){
      console.error("Teacher fetch error:", err.errors);
    }
  }

  public getClassNames() {
    this.sclassNames = this.sclasses.filter(e => e.includes(this.searchSclassName.trim()))
    console.log(this.sclassNames)
  }

  close(): void {
    this.formClose.emit();
  }

  onSubmit(): void{
    let params = {'teacherName': this.currentTeacherName,
    'subjectName': this.currentSubjectName,
    'className': this.currentSclassName};

    this.teacherService.createRegistry(params).subscribe({
      next: (data) => {
        let message = "Új tanári viszony: ";

        this.crudDone.emit(`${message}\n${data.teacher}\n${data.subject}\n${data.sclass}`);
      }, error: (err) => {
        this.crudError = true;
        this.errorMessage = err.error
      }
    })

  }

  changeCurrentSubjectName(subject: Subject) {
    this.searchSubjectName = subject.name;
    this.currentSubjectName = subject.name;
  }

  changeCurrentTeacherName(teacher: User) {
    this.searchTeacherName = teacher.username;
    this.currentTeacherName = teacher.username;
  }

  changeCurrentSclassName(sclassName: string) {
    this.searchSclassName = sclassName;
    this.currentSclassName = sclassName;
  }

  subjectFilled() {
    if (this.currentSubjectName == '') return false;
    else return true;

  }

  teacherFilled() {
    if (this.currentTeacherName == '') return false;
    else return true;

  }

  sclassFilled() {
    if (this.currentSclassName == '') return false;
    else return true;

  }



}
