import {Component, ElementRef, OnInit, Renderer2, ViewChild} from '@angular/core';
import {Student} from "../../models/student.model";
import {StudentService} from "../../_services/student.service";
import {Router} from "@angular/router";
import {StorageService} from "../../_services/storage.service";

@Component({
  selector: 'app-students',
  templateUrl: './students.component.html',
  styleUrls: ['./students.component.css']
})
export class StudentsComponent implements OnInit{

  sclassNames: string[] = [];
  currentYearSclassNames: string[] =[];
  currentYear:number;
  currentSclassName: string;

  students: Student[] = [];
  currentStudent: Student = {};
  currentIndex = -1;
  emptyStudent: Student = {};
  emptyIndex = -1;
  name = '';

  nullValue: string = 'null';

  messageText = '';
  messageMode = false
  crudOperation:string = "read";
  crudMode = false

  //@ViewChild("selectedYear") selectedYear! : ElementRef;

  page = 1;
  count = 0;
  size = 5;

  constructor(private studentService: StudentService, private storageService: StorageService) {
  }

  ngOnInit(): void {
    this.getStudents();
    this.getAllClasses()
    this.emptyStudent.id = -1
  }


  private getStudents() {
     let params =
       {'className': this.currentSclassName,'title':this.name, 'page': this.page-1, 'size': this.size};

     this.studentService.getAllByParams(params).subscribe({
       next: (data) => {
         const { students, totalItems }: any = data;
         this.students = students;
         this.count = totalItems;
         this.storageService.writeCountValue(this.count);
         console.log(this.students)
       },
       error: (err) => {
         console.log(err);
       }
     })
  }

  private getAllClasses(){
    this.studentService.getClasses().subscribe({
      next: (data) => {
        if (Array.isArray(data)) {
          this.sclassNames = data.map(e => e.name)
          this.currentYearSclassNames = data.map(e => e.name);
          console.log(this.sclassNames)
          this.sortClassNames()
        }

      },
      error: (err) => {
        console.log(err)
      }
    })
  }

  filterByClass() {
    let params = {'className': this.currentSclassName, 'title': name, 'page': 0, 'size': 5};
    this.getStudents();
  }

  addNewClass() {
    if (this.currentYear == null) {
      return;
    }

    let year = this.currentYear;

    this.studentService.createClass(this.currentYear).subscribe({
      next: (data) => {
        console.log("New class: ", data);
        this.refreshList();
        this.currentYear = year;
      },
      error: (err) => {
        console.log(err)
      }
    });

  }


  removeClass() {
    this.studentService.deleteClass(this.currentSclassName).subscribe({
      next: (data) => {
        console.log(data);
        this.refreshList()
      },
      error: (err) => {
        console.log(err)
      }
    });
  }

  filterClassesByYear() {
    this.currentYearSclassNames =
      this.sclassNames.filter(className => className.includes(String(this.currentYear)) ||
        className=="null"
      || className=="");
  }

  refreshList(): void {
    this.getStudents()
    this.getAllClasses()
    this.currentStudent = {};
    this.currentIndex = -1;
  }

  setActiveStudent(student: Student, index: number): void {
    this.currentStudent = student;
    this.currentIndex = index;
  }

  handlePageChange(event: number): void {
    this.page = event;
    this.getStudents();
  }

  handleSizeChange(event: number): void{
    this.size = event;
    this.getStudents()
  }

  searchByName(): void {
    this.page = 1;
    this.getStudents();
  }


  removeStudent(student: Student) {
    this.studentService.delete(student.id).subscribe({
      next: res => {
        console.log(res);
        this.refreshList();
      },
      error: err => {
        console.log(err);
      }
    });
  }

  removeAllStudents(): void {
    let params = {'className': this.currentSclassName};

    this.studentService.deleteAll(params)
      .subscribe({
        next: res => {
          console.log(res);
          this.refreshList();
        },
        error: err => {
          console.log(err);
        }
      });

  }

  protected readonly Array = Array;

  openForm(operation: string, student: Student) {
    this.currentIndex = student.id;
    this.currentStudent = student;
    this.crudOperation = operation;
    console.log(this.currentStudent)
    console.log(this.currentIndex)
    this.crudMode = true;
    console.log(this.crudMode)
  }

  sortClassNames(): void {
    this.currentYearSclassNames.sort((a: string, b: string) => {
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

  parentAccess(studentName: string){
    if (this.storageService.hasChild(studentName)) return true;

    if(this.storageService.hasTeacherRole() || this.storageService.hasAdminRole()) return true
    else return false;
  }

  classHeadAccess(className: string){
    if (this.storageService.hasClass(className) || this.storageService.hasAdminRole()) return true
    else return false;
  }

  adminAccess() {
    if (this.storageService.hasAdminRole()) return true
    else return false;
  }
}
