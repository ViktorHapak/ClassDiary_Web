import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Student} from "../../../models/student.model";
import {FormArray, FormControl, FormGroup, Validators} from "@angular/forms";
import {AuthService} from "../../../_services/auth.service";
import {StorageService} from "../../../_services/storage.service";
import {Router} from "@angular/router";
import {StudentService} from "../../../_services/student.service";
import {UserService} from "../../../_services/user.service";
import {analyticsDisabled} from "@angular/cli/src/utilities/environment-options";

@Component({
  selector: 'app-student-details',
  templateUrl: './student-details.component.html',
  styleUrls: ['./student-details.component.css']
})
export class StudentDetailsComponent implements OnInit{

  @Input() operation: string;
  @Input() index: any = -1;

  sclassNames: string[] = [];
  currentSclassName: string;

  student: Student = {
    id : -1,
    name :'',
    birth :new Date(),
    address :'',
    info:'',
    sclass:'',
    parents: []
  };

  @Output()
  formClose: EventEmitter<null> = new EventEmitter();

  @Output()
  crudDone: EventEmitter<string> = new EventEmitter<string>();

  studentForm: FormGroup;
  formStatus;
  isProcessing: boolean = false;
  crudError: boolean = false;
  errorMessage = '';


  constructor(private studentService: StudentService) {
  }

  ngOnInit(): void {
    console.log("Crud:", this.operation);
    this.getAllClasses()

    this.studentForm= new FormGroup({
        name : new FormControl('default', [Validators.required, this.isValidName]),
        birth : new FormControl(null, [Validators.required, this.dateTimeValidator]),
        address : new FormControl('', [Validators.required, this.isValidValue]),
        info : new FormControl(''),
        sclass: new FormControl(''),
        }
    )

    if(this.index != -1){
      this.getStudent(this.index)
    }

  }

  onSubmit(): void {
    let message = "";

    switch (this.operation) {
      case "add":
        this.addStudent("Új tanuló hozzáadva: ");
        break;
      case "update":
        this.updateStudent("A tanuló adatai módosultak: ");
        break;
      case "read":
        message = "";
        break;
      default:
        message = "Hiba történt!";
    }
  }

  close(): void {
  this.formClose.emit();
  }

  getStudent(id:any){
    this.studentService.get(this.index).subscribe({
      next: (data) => {
        this.student = {id: data.id, name: data.name, birth: data.birth, address: data.address,
        info: data.info, sclass: data.sclass, parents: data.parents}

        console.log(this.student)

        this.studentForm.patchValue({
          name : this.student.name,
          birth: this.student.birth,
          address: this.student.address,
          info: this.student.info,
          sclass: this.student.sclass,
          }
        );

        /*const parentsArray = this.studentForm.get('parents') as FormArray;
        parentsArray.clear();
        data.parents.forEach(parent => {
          parentsArray.push(new FormControl(parent));
        });*/

      },
      error: (err) => {
        console.log(err.errors)
      }
    });
  }

  private getAllClasses(){
    this.studentService.getClasses().subscribe({
      next: (data) => {
        if (Array.isArray(data)) {
          this.sclassNames = data.map(e => e.name)
          console.log(this.sclassNames)
          this.sortClassNames()
        }

      },
      error: (err) => {
        console.log(err)
      }
    })
  }

  dateTimeValidator(control: FormControl) {
    const dateValue: Date = new Date(control.value);
    const current: Date = new Date();
    const diffTime: number = current.getTime() - dateValue.getTime();
    const year: number = Math.floor(diffTime / (1000 * 60 * 60 * 24 * 365.25)); // évek száma


    if (year < 9 || year > 18) {
      return { dateTimeValidator: true };
    }

    return null;
  }

  isValidName(control: FormControl) {
    const value = control.value;

    if (control.value == null || control.value === "") return null;

    if (value != null && value.split(" ").length >= 2 && value.split(" ").length <= 3
      && value.length >= 4 && value.length <= 21) {
      return null;
    }

    return { isValidName: true };
  }

  isValidValue(control: FormControl) {
    const value = control.value;

    if (control.value == null || control.value === "") return null;

    if (value != null && value.length >= 3 && value.length <= 40) {
      return null;
    }

    return { isValidValue: true };
  }

  sortClassNames(): void {
    this.sclassNames.sort((a: string, b: string) => {
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

  isFormTouched(): boolean {
    if (this.studentForm.get('name').touched || this.studentForm.get('birth').touched
    || this.studentForm.get('address').touched || this.studentForm.get('info').touched){
      return true;
    } else return false
  }


  private addStudent(message: string) {
    this.isProcessing = true;
    let newStudent = {'name': this.studentForm?.get('name').value,
    'birth': this.studentForm?.get('birth').value,
    'address': this.studentForm?.get('address').value}

    this.studentService.create(newStudent).subscribe({
      next : (data) => {
        this.isProcessing = false;
        this.crudDone.emit(`${message}\n${data.name}`);
      }, error : (err) => {
        console.log(err.error)
        this.isProcessing = false;
        this.crudError = true;
        this.errorMessage = err.error;
    }
    })
  }


  private updateStudent(message: string) {
    this.isProcessing = true;
    let updateStudent = {'name': this.studentForm?.get('name').value,
      'birth': this.studentForm?.get('birth').value,
      'address': this.studentForm?.get('address').value,
    'info': this.studentForm?.get('info').value}

    this.studentService.update(this.student.id,updateStudent).subscribe({
      next : (data) => {
        this.isProcessing = false;
        this.crudDone.emit(`${message}\n${data.name}`);
      }, error : (err) => {
        console.log(err.error)
        this.isProcessing = false;
        this.crudError = true;
        this.errorMessage = err.error;
      }
    })
  }


  addToClass(currentSclassName: string) {
    this.isProcessing = true;
    let params = {'className': this.currentSclassName}

    this.studentService.addToClass(this.student.id,params).subscribe({
      next : (data) => {
        this.isProcessing = false;
        this.crudDone.emit(`${data.name} hozzáadva a köv. osztályhoz: \n${data.sclass}`);
      }, error : ( err) => {
        this.isProcessing = false;
        this.crudError = true;
        this.errorMessage = err.error;
      }
    })
  }

  removeFromClass() {
    this.isProcessing = true;
    let fromClass = this.student.sclass

    this.studentService.removeFromClass(this.student.id).subscribe({
      next : (data) => {
        this.isProcessing = false;
        this.crudDone.emit(`${data.name} eltávolítva a köv. osztályból: \n${fromClass}`)

      }, error : ( err) => {
        this.isProcessing = false;
        this.crudError = true;
        this.errorMessage = err.error;
      }
    })

  }
}
