import {Component, ElementRef, HostListener, OnInit, Renderer2, ViewChild} from '@angular/core';
import {GradesService} from "../_services/grades.service";
import {Sclass} from "../models/sclass.model";
import {Grades1} from "../models/grades1.model";
import {Grades2} from "../models/grades2.model";
import {FinalGrades} from "../models/finalgrades.model";
import {Subject} from "../models/subject.model";
import {StudentService} from "../_services/student.service";
import {TeacherService} from "../_services/teacher.service";
import {User} from "../models/user.model";
import {StorageService} from "../_services/storage.service";


@Component({
  selector: 'app-grades',
  templateUrl: './grades.component.html',
  styleUrls: ['./grades.component.css']
})
export class GradesComponent implements OnInit{

  grades1: Grades1[] = [];
  grades2: Grades2[] = [];
  finalgrades: FinalGrades[] = [];

  grades1ToDisplay: Grades1[] = [];
  grades2ToDisplay: Grades2[] = [];
  finalgradesToDisplay: FinalGrades[] = [];

  sclasses: string[] = [];
  sclassNames: string[] = [];
  subjects: Subject[] = [];

  currentSemester: string = 'no';
  currentSclassName: string = '';
  currentSubjectName: string = '';
  currentModule: number = -1;
  currentGrade: number = -1;

  loadSemester: string = '';
  loadSclassName: string = '';
  loadSubjectName: string = '';

  searchSclassName: string ='';
  searchSubjectName: string='';

  name = '';

  operationError: boolean = false;
  errorMessage: string = '';

  protected readonly Array = Array;

  @ViewChild('classDropdown') classDropdown!: ElementRef;
  @ViewChild('subjectDropdown') subjectDropdown!: ElementRef;
  @ViewChild('classDiv') classDiv!: ElementRef;
  @ViewChild('subjectDiv') subjectDiv!: ElementRef;
  @ViewChild('errorMessageCon') errorContainer!: ElementRef;

  constructor(private gradesService: GradesService, private studentService: StudentService,
              private teacherService: TeacherService, private storageService: StorageService,
              private renderer: Renderer2) {
  }

  ngOnInit() {
    this.getAllClasses();
    this.loadSemester = this.storageService.getSemester();
    this.loadSclassName =this.storageService.getSclass();
    this.loadSubjectName = this.storageService.getSubject();
    this.searchSclassName = this.loadSclassName;
    this.searchSubjectName = this.loadSubjectName;
    this.loadTable();
  }

  loadTable() {

    if (!this.isFilledToLoad()){
      this.currentSemester = '';
      return;
    }

    let params = {'subjectName': this.loadSubjectName, 'className': this.loadSclassName}

    switch (this.loadSemester){
      case ('I.'):{
        this.gradesService.getGrades1(params)
          .subscribe({
            next:(data) => {
              this.grades1 = data.grades1;
              this.grades1ToDisplay = data.grades1;
              this.currentSemester = 'I.'
              this.saveNewDatas()
            }, error:(err) => {
              console.log(err.error);
            }
          })
        break;
      }
      case ('II.'):{
        this.gradesService.getGrades2(params)
          .subscribe({
            next:(data) => {
              this.grades2 = data.grades2;
              this.grades2ToDisplay = data.grades2;
              this.currentSemester = 'II.'
              this.saveNewDatas()
            }, error:(err) => {
              console.log(err.error);
            }
          })
        break;
      }
      case('final'):{
        this.gradesService.getFinalGrades(params)
          .subscribe({
            next:(data) => {
              this.finalgrades = data.finalgrades;
              this.finalgradesToDisplay = data.finalgrades;
              this.currentSemester = 'final'
              this.saveNewDatas()
            }, error:(err) => {
              console.log(err.error);
            }
          })
        break;
      }
      default:{
        this.operationError = true;
        this.errorMessage = "Betöltés sikertelen!"
      }
    }
  }

  isFilledToLoad() : boolean{
    if(this.loadSemester == '' || this.loadSclassName == '' || this.loadSubjectName == ''){
      return false
    } else return true;
  }

  filterByName():void{
    switch (this.currentSemester){
      case ('I.'):{
        this.grades1ToDisplay = this.grades1.filter(e =>
          (e.studentName.toLowerCase().trim().includes(this.name.toLowerCase())))
        break
      }
      case ('II.'):{
        this.grades2ToDisplay = this.grades2.filter(e =>
          e.studentName.toLowerCase().trim().includes(this.name.toLowerCase()))
        break
      }
      case ('final'):{
        this.finalgradesToDisplay = this.finalgrades.filter(e =>
          e.studentName.toLowerCase().trim().includes(this.name.toLowerCase()))
        break
      }
      default:{}
    }
  }

  addGrade(id: number):void {
    if(this.currentModule==-1 || this.currentGrade==-1){
      this.errorMessage = `Hiányzó adat a művelethez!\n(érdemjegy,modul)`;
      this.operationError = true;
      return;
    }

    let params = {'subjectName': this.currentSubjectName,
      'grade': this.currentGrade,'module': this.currentModule};

    switch (this.currentSemester){
      case 'I.': {
        this.gradesService.addGrade1(id,params).subscribe({
          next: (data) => {
            this.loadTable();
            this.operationError = false;
          }, error: (err) => {
            this.operationError = true;
            this.errorMessage = err.error;
          }
        })
        break;
      }
      case  'II.': {
        this.gradesService.addGrade2(id,params).subscribe({
          next: (data) => {
            this.loadTable();
            this.operationError = false;
          }, error: (err) => {
            this.operationError = true;
            this.errorMessage = err.error;
          }
        })
        break;
      }
      default: return;
    }

  }

  removeGrade(id: number):void {
    if(this.currentModule==-1){
      this.errorMessage = `Hiányzó adat a művelethez!\n(modul)`;
      this.operationError = true;
      return;
    }

    let params = {'subjectName': this.currentSubjectName, 'module': this.currentModule};

    switch (this.currentSemester){
      case 'I.': {
        this.gradesService.deleteGrade1(id,params).subscribe({
          next: (data) => {
            this.loadTable();
            this.operationError = false;
          }, error: (err) => {
            this.operationError = true;
            this.errorMessage = err.error;
          }
        })
        break;
      }
      case  'II.': {
        this.gradesService.deleteGrade2(id,params).subscribe({
          next: (data) => {
            this.loadTable();
            this.operationError = false;
          }, error: (err) => {
            this.operationError = true;
            this.errorMessage = err.error;
          }
        })
        break;
      }
      default: return;
    }

  }

  calculateModule(id: number) {
    if(this.currentModule==-1){
      this.errorMessage = `Hiányzó adat a művelethez!\n(modul)`;
      this.operationError = true;
      return;
    }

    let params = {'subjectName': this.currentSubjectName, 'module': this.currentModule};

    switch (this.currentSemester){
      case 'I.': {
        this.gradesService.calculateModule1(id,params).subscribe({
          next: (data) => {
            this.loadTable();
            this.operationError = false;
          }, error: (err) => {
            this.operationError = true;
            this.errorMessage = err.error;
          }
        })
        break;
      }
      case  'II.': {
        this.gradesService.calculateModule2(id,params).subscribe({
          next: (data) => {
            this.loadTable();
            this.operationError = false;
          }, error: (err) => {
            this.operationError = true;
            this.errorMessage = err.error;
          }
        })
        break;
      }
      default: return;
    }

  }

  calculateSemester(id: number) {
    let params = {'subjectName': this.currentSubjectName};

    switch (this.currentSemester){
      case 'I.': {
        this.gradesService.calculateSemester1(id,params).subscribe({
          next: (data) => {
            this.loadTable();
            this.operationError = false;
          }, error: (err) => {
            this.operationError = true;
            this.errorMessage = err.error;
          }
        })
        break;
      }
      case  'II.': {
        this.gradesService.calculateSemester2(id,params).subscribe({
          next: (data) => {
            this.loadTable();
            this.operationError = false;
          }, error: (err) => {
            this.operationError = true;
            this.errorMessage = err.error;
          }
        })
        break;
      }
      default: return;
    }

  }

  evaluateExam(id: number) {

    if(this.currentGrade==-1){
      this.errorMessage = `Hiányzó adat a művelethez!\n(érdemjegy)`;
      this.operationError = true;
      return;
    }

    let params = {'subjectName': this.currentSubjectName,
      'grade': this.currentGrade};

    this.gradesService.giveExamGrade(id,params).subscribe({
      next: (data) => {
        this.loadTable();
        this.operationError = false;
      }, error: (err) => {
        this.operationError = true;
        this.errorMessage = err.error;
      }
    })

  }

  calculateSchoolYear(id: number) {
    let params = {'subjectName': this.currentSubjectName};

    this.gradesService.calculateYear(id,params).subscribe({
      next: (data) => {
        this.loadTable();
        this.operationError = false;
      }, error: (err) => {
        this.operationError = true;
        this.errorMessage = err.error;
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
    {params = {'className':this.loadSclassName,'subjectName': this.searchSubjectName, 'size': 10};}
    else params = {'className':this.loadSclassName,'subjectName': this.searchSubjectName.trim(), 'size': 10}

    this.teacherService.getSubjects(params).subscribe({
      next: (data) => {
        this.subjects = data.subjects;
        console.log(this.subjects)
      }, error: (err) => {
        console.log(err.errors);
      }
    })
  }

  public getClassNames() {
    console.log(this.sclasses)
    this.sclassNames = this.sclasses.filter(e =>
      e.toLowerCase().includes(this.searchSclassName.toLowerCase().trim()))
    console.log(this.sclassNames)
  }

  changeSubjectNameToLoad(subject: Subject) {
    this.searchSubjectName = subject.name;
    this.loadSubjectName = subject.name;

    let params ={'subjectName': this.loadSubjectName}

    this.studentService.getClassesBySubject(params).subscribe({
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

    console.log(this.searchSubjectName)
    console.log(this.loadSubjectName)
    console.log(this.loadSclassName)
  }

  changeSclassNameToLoad(sclassName: string) {
    this.searchSclassName = sclassName;
    this.loadSclassName = sclassName;

    console.log(this.searchSclassName)
    console.log(this.loadSclassName)
    console.log(this.searchSubjectName)
  }

  saveNewDatas(): void{
    this.currentSubjectName = this.loadSubjectName;
    this.currentSclassName = this.loadSclassName;
    this.storageService.saveSemester(this.currentSemester);
    this.storageService.saveSclass(this.currentSclassName);
    this.storageService.saveSubject(this.currentSubjectName);
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

  hideClassDropdown(){
    this.renderer.setStyle(this.classDropdown.nativeElement,'display','none');
  }

  hideSubjectDropdown(){
    this.renderer.setStyle(this.subjectDropdown.nativeElement,'display','none');
  }

  @HostListener('document:click', ['$event'])
  onOutsideClick(event: MouseEvent) {
    const clickedInside = this.classDiv.nativeElement.contains(event.target);
    const clickedInside1 = this.subjectDiv.nativeElement.contains(event.target);

    if(this.operationError && this.errorMessage !=''){
      setTimeout( () => {this.operationError = false
      this.errorMessage=''},2000)
    }

    if (!clickedInside) {
      this.hideClassDropdown();
    }

    if (!clickedInside1) {
      this.hideSubjectDropdown();
    }

  }


  teacherAccess(){
    if (this.storageService.hasTeacherRegistry(this.currentSubjectName, this.currentSclassName)
      || this.storageService.hasAdminRole()) return true
    else return false;
  }
}
