import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {TeacherService} from "../../../_services/teacher.service";
import {HttpErrorResponse, HttpResponse, HttpStatusCode} from "@angular/common/http";
import {Subject} from "../../../models/subject.model";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {error} from "@angular/compiler-cli/src/transformers/util";

@Component({
  selector: 'app-subject-details',
  templateUrl: './subject-details.component.html',
  styleUrls: ['./subject-details.component.css']
})
export class SubjectDetailsComponent implements OnInit{

  @Input() operation: string;

  @Output()
  formClose: EventEmitter<null> = new EventEmitter();

  @Output()
  crudDone: EventEmitter<string> = new EventEmitter<string>();

  isProcessing: boolean = false;
  crudError: boolean = false;
  errorMessage = '';

  subjects: Subject[] = [];

  searchSubjectName: string = '';
  currentSubjectName: string = '';

  subjectForm: FormGroup;

  constructor(private teacherService: TeacherService) {
  }

  ngOnInit(): void {

    this.getSubjects()

    this.subjectForm = new FormGroup({
      name: new FormControl('', [Validators.required, this.isValidName])
    })

  }



  onSubmit(): void {
    let message = "";

    switch (this.operation) {
      case "add":
        this.addSubject("Új tantárgy: ");
        break;
      case "delete":
        this.deleteSubject("Tantárgy eltávolítva: ");
        break;
      default:
        message = "Hiba történt!";
    }
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

  private addSubject(message: string) {

    let data = {'name': this.subjectForm.get('name')?.value}

    this.teacherService.create(data).subscribe({
      next: (response) => {
        const {subject} : any = response;
        this.crudDone.emit(`${message}\n${response.subject}`)
      }, error: (err) => {
        this.crudError = true;
        this.errorMessage = err.error;
      }
    })

  }

  private deleteSubject(message: string) {

    let params = {'subjectName': this.currentSubjectName}

    this.teacherService.delete(params).subscribe({
      next:(repsonse: HttpResponse<any>)=>{
        if (repsonse.status == HttpStatusCode.NoContent)
          this.crudDone.emit(`${message}\n${this.currentSubjectName}`)
      }, error:(error: HttpErrorResponse) =>{
        this.crudError = false;
        this.errorMessage = error.message;
      }
    })

  }

  isValidName(control: FormControl) {
    const value = control.value;

    if (control.value == null || control.value === "") return null;

    if (value != null && value.indexOf(' ') === -1 && value.length > 3 && value.length < 21) {
      return null;
    }

    return { isValidName: true };
  }

  changeCurrentSubjectName(subject: Subject) {
    this.searchSubjectName = subject.name;
    this.currentSubjectName = subject.name;
  }

  close(): void {
    this.formClose.emit();
  }

  subjectFilled() {
    if (this.currentSubjectName == '') return false;
    else return true;

  }

}
