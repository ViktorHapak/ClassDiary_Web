import {Component, OnInit} from '@angular/core';
import {Student} from "../../models/student.model";
import {TeacherRegistry} from "../../models/teacherregistry.model";
import {User} from "../../models/user.model";
import {Sclass} from "../../models/sclass.model";
import {Subject} from "../../models/subject.model";
import {TeacherService} from "../../_services/teacher.service";
import {StudentService} from "../../_services/student.service";
import {UserService} from "../../_services/user.service";
import {HttpErrorResponse, HttpResponse, HttpStatusCode} from "@angular/common/http";
import {StorageService} from "../../_services/storage.service";

@Component({
  selector: 'app-lecturing',
  templateUrl: './lecturing.component.html',
  styleUrls: ['./lecturing.component.css']
})
export class LecturingComponent implements OnInit{

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

  messageText = '';
  messageMode = false
  crudMode = false

  subjectCrudMode = false;
  subjectOperation = 'add';

  filterValue: string = "";
  sortValue: string = "subject";
  sorDirection: string = "asc";
  page = 1;
  size = 5;


  teacherRegistries: TeacherRegistry[] = [];
  currentRegistry: TeacherRegistry = {};
  currentIndex = -1;
  emptyRegistry: TeacherRegistry = {};
  emptyIndex = -1;
  count = 0;

  constructor(private teacherService: TeacherService, private studentService: StudentService,
              private userService: UserService, private storageService: StorageService) {
  }

  ngOnInit() {
    this.getAllRegistries()
    this.getAllClasses()
  }

  protected getAllRegistries(){
    let params = {'sortField': this.sortValue, 'sortDirection': this.sorDirection,
    'page': this.page-1, 'size': this.size};

    this.teacherService.getAll(params).subscribe({
      next: (data) => {
        const { registries, totalItems }: any = data;
        this.teacherRegistries = registries;
        this.count = totalItems;
        this.storageService.writeCountValue(this.count);
        console.log(this.teacherRegistries);
      }, error: (err) => {
        console.log(err)
      }
    })
  }

  private getRegistriesBySubject(subjectName: string){
    let params = {'sortField': this.sortValue, 'sortDirection': this.sorDirection,
      'subjectName': this.currentSubjectName,
      'page': this.page-1, 'size': this.size};

    this.teacherService.getBySubject(params).subscribe({
      next: (response: HttpResponse<any>) => {

        if( response.status === HttpStatusCode.NoContent) {
          this.teacherRegistries = [];
        } else {
          this.teacherRegistries = response.body.registries;
          this.count = response.body.totalItems;
          console.log(this.teacherRegistries);
        }
      }, error: (err: HttpErrorResponse) => {
        if (err.status === HttpStatusCode.NoContent) this.teacherRegistries = [];
        else this.getAllRegistries()
      }
    })
  }

  private getRegistriesByTeacher(teacherName: string){
    let params = {'sortField': this.sortValue, 'sortDirection': this.sorDirection,
      'teacherName': this.currentTeacherName,
      'page': this.page-1, 'size': this.size};

    this.teacherService.getByTeacher(params).subscribe({
      next: (response: HttpResponse<any>) => {
        if( response.status === HttpStatusCode.NoContent) {
          this.teacherRegistries = [];
        } else {
          this.teacherRegistries = response.body.registries;
          this.count = response.body.totalItems;
          console.log(this.teacherRegistries);
        }
      }, error: (err: HttpErrorResponse) => {
        if (err.status === HttpStatusCode.NoContent) this.teacherRegistries = [];
        else this.getAllRegistries()
      }
    })
  }

  private getRegistriesBySclass(sclassName: string){
    let params = {'sortField': this.sortValue, 'sortDirection': this.sorDirection,
      'className': this.currentSclassName,
      'page': this.page-1, 'size': this.size};

    this.teacherService.getByClass(params).subscribe({
      next: (response: HttpResponse<any>) => {
        if( response.status === HttpStatusCode.NoContent) {
          this.teacherRegistries = [];
        } else {
          this.teacherRegistries = response.body.registries;
          this.count = response.body.totalItems;
          console.log(this.teacherRegistries);
        }
        }, error: (err: HttpErrorResponse) => {
        if (err.status === HttpStatusCode.NoContent) this.teacherRegistries = [];
        else this.getAllRegistries()
      }
    })
  }

  public removeRegistry(id: any){

    if(!this.adminAccess()) return;

    this.teacherService.deleteRegistry(id).subscribe({
      next: (data) => {
        console.log(data)
        this.refreshList()
      }, error: (err) => {
        console.log(err)
      }
    })
  }

  private getAllClasses(){
    this.studentService.getClasses().subscribe({
      next: (data) => {
        if (Array.isArray(data)) {
          this.sclasses = data.map(e => e.name)
          this.sortClassNames()
        }
      },
      error: (err) => {
        console.log(err)
      }
    })
  }

  protected getSubjects(){

    let params;

    if(this.searchSubjectName.length == 1)
    {params = {'subjectName': this.searchSubjectName, 'size': 10};}
    else params = {'subjectName': this.searchSubjectName.trim(), 'size': 10}

    this.teacherService.getSubjects(params).subscribe({
      next: (data) => {
        this.subjects = data.subjects;
        console.log(this.subjects)
      }, error: (err) => {
        console.log(err.errors);
      }
    })
  }

  protected getTeachers() {
    let params;

    if(this.searchTeacherName.length == 1){
      params = {'roleName': "teachers", 'title':this.searchTeacherName}
    } else params = {'roleName': "teachers", 'title':this.searchTeacherName.trim()}

    this.userService.getAllByPage(params).subscribe({
      next: (data) => {
        this.teachers = data.users;
        console.log(this.teachers)
      }, error: (err) => {
        console.log(err.errors);
      }
    })
  }

  public getClassNames() {
    console.log(this.sclasses)
    this.sclassNames = this.sclasses.filter(e => e.includes(this.searchSclassName.trim()))
    console.log(this.sclassNames)
  }

  refreshList(): void {
    switch (this.filterValue){
      case "subject": {this.getRegistriesBySubject(this.currentSubjectName); break; }
      case "teacher": {this.getRegistriesByTeacher(this.currentTeacherName); break; }
      case "sclass": {this.getRegistriesBySclass(this.currentSclassName); break; }
      default: this.getAllRegistries()
    }

    this.currentRegistry = {};
    this.currentIndex = -1;
  }

  handlePageChange(event: number): void {
    this.page = event;
    this.refreshList();
  }

  handleSizeChange(event: number): void{
    this.size = event;
    this.refreshList()
  }

  changeCurrentSubjectName(subject: Subject) {
    this.searchSubjectName = subject.name;
    this.currentSubjectName = subject.name;

    this.getRegistriesBySubject(subject.name)

    console.log(this.searchSubjectName)
    console.log(this.currentSubjectName)
  }

  changeCurrentTeacherName(teacher: User) {
    this.searchTeacherName = teacher.name;
    this.currentTeacherName = teacher.name;

    this.getRegistriesByTeacher(teacher.name)

    console.log(this.searchTeacherName)
    console.log(this.currentTeacherName)
  }

  changeCurrentSclassName(sclassName: string) {
    this.searchSclassName = sclassName;
    this.currentSclassName = sclassName;

    this.getRegistriesBySclass(sclassName)

    console.log(this.searchTeacherName)
    console.log(this.currentTeacherName)
  }

  openForm() {
    this.crudMode = true;
  }

  openSubjectForm(operation: string) {
    this.subjectOperation = operation;
    this.subjectCrudMode = true
  }

  changeSorting(sortValue: string, direction: string) {
    this.sortValue=sortValue;
    this.sorDirection=direction;
    this.refreshList()
  }

  deleteAll() {
    this.teacherService.deleteAllRegistries().subscribe({
      next : (data) => {
        console.log(data)
      }, error: (err) => {
        console.log(err.error)
      }
    })
  }

  beginNewYear() {
    this.teacherService.beginNewSchoolYear().subscribe({
      next : (data) => {
        const {NewSchoolYear, changed}:any = data;
        if(changed=='no') this.messageText = `Nem történt változás!\n${NewSchoolYear}`;
        else {
          this.messageText = `Új tanév\n${NewSchoolYear}`;
          this.storageService.saveSchoolYear(NewSchoolYear);
        }
        this.messageMode = true;

      }, error: (err) => {
        console.log(err.error)
      }
    })

  }

  sortClassNames(): void {
    this.sclasses.sort((a: string, b: string) => {
      const numA = parseInt(a.match(/\d+/)?.[0] || "0", 10);
      const letterA = a.match(/[A-Z]/)?.[0] || "";

      const numB = parseInt(b.match(/\d+/)?.[0] || "0", 10);
      const letterB = b.match(/[A-Z]/)?.[0] || "";

      if (numA === numB) {
        return letterA.localeCompare(letterB);
      }
      return numA - numB;
    });
  }

  parentAccess(){
    if (this.storageService.hasParentRole()) return true;

    if(this.storageService.hasTeacherRole() || this.storageService.hasAdminRole()) return true
    else return false;
  }

  adminAccess() {
    if (this.storageService.hasAdminRole()) return true
    else return false;
  }
}
