import {Component, EventEmitter, Input, Output} from '@angular/core';
import {Student} from "../../../models/student.model";
import {FormArray, FormControl, FormGroup, Validators} from "@angular/forms";
import {User} from "../../../models/user.model";
import {UserService} from "../../../_services/user.service";
import {StudentService} from "../../../_services/student.service";
import {StorageService} from "../../../_services/storage.service";

@Component({
  selector: 'app-user-details',
  templateUrl: './user-details.component.html',
  styleUrls: ['./user-details.component.css']
})
export class UserDetailsComponent {

  @Input() operation: string;
  @Input() index: any = -1;

  roleNames : string[] = ["ROLE_Visitor", "ROLE_Parent", "ROLE_Teacher", "ROLE_ClassHead", "ROLE_Admin"];

  sclassNames: string[] = [];
  currentSclassName: string;

  studentNames: string[] = [];
  searchStudentRequest: string = '';
  currentStudentName: string = '';



  user: User = {
    id : -1,
    firstname: '',
    lastname: '',
    email: '',
    birth: new Date(),
    password: '',
    userrole: '',
    sclass: '',
    children: [],
    teacherRegistries: []
  };

  @Output()
  formClose: EventEmitter<null> = new EventEmitter();

  @Output()
  crudDone: EventEmitter<string> = new EventEmitter<string>();

  userForm: FormGroup;
  formStatus;
  isProcessing: boolean = false;
  crudError: boolean = false;
  errorMessage = '';

  constructor(private userService: UserService, private studentService: StudentService,
              private storageService: StorageService) {
  }

  ngOnInit(): void {
    console.log("Crud:", this.operation);

    this.userForm = new FormGroup({
        lastname : new FormControl('', [Validators.required, this.isValidName]),
        firstname : new FormControl('', [Validators.required, this.isValidName]),
        email: new FormControl('', [Validators.required, Validators.email]),
        name : new FormControl('default', [Validators.required, this.isValidName]),
        birth : new FormControl(new Date(), [Validators.required, this.dateTimeValidator]),
      }
    )

    if(this.index != -1){
      this.getUser(this.index)
    }

    this.getAllClasses();
    this.getStudents();

  }



  onSubmit(): void {
    let message = "";

    switch (this.operation) {
      case "update":
        this.updateUser("A felhasználó adatai módosultak: ");
        break;
      default:
        message = "Hiba történt!";
    }
  }

  close(): void {
    this.formClose.emit();
  }

  getUser(id:any){
    this.userService.get(this.index).subscribe({
      next: (data) => {
        this.user = {id: data.id, firstname: data.firstname, lastname: data.lastname, email: data.email,
        name: data.name, birth: data.birth, password: data.password, userrole: data.userrole,
          sclass: data.sclass, children: data.children, teacherRegistries: data.teacherRegistries};

        console.log(this.user)

        this.userForm.patchValue({
            lastname: this.user.lastname,
            firstname: this.user.firstname,
            email: this.user.email,
            name : this.user.name,
            birth: this.user.birth,
          }
        );

        this.currentSclassName = this.user.sclass

      },
      error: (err) => {
        console.log(err.errors)
      }
    });
  }

  private updateUser(message: string) {
    this.isProcessing = true;
    let updateUser = {
      'firstname': this.userForm?.get('firstname').value,
      'lastname': this.userForm?.get('lastname').value,
      'email': this.userForm?.get('email').value,
      'name': this.userForm?.get('name').value,
      'birth': this.userForm?.get('birth').value
    }

    this.userService.update(this.user.id,updateUser).subscribe({
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

  private getAllClasses(){
    this.isProcessing=true
    this.studentService.getClasses().subscribe({
      next: (data) => {
        this.isProcessing = false;
        if (Array.isArray(data)) {
          this.sclassNames = data.map(e => e.name)
          console.log(this.sclassNames)
          this.sortClassNames()
        }

      },
      error: (err) => {
        this.isProcessing = false;
        console.log(err)
      }
    })
  }

  protected getStudents() {
    this.isProcessing = true;
    let params =
      {'className': this.currentSclassName,'title':this.searchStudentRequest.trim(), 'page': 0, 'size': 5};

    this.studentService.getAllByParams(params).subscribe({
      next: (data) => {
        this.isProcessing = false;
        const { students, totalItems }: any = data;
        this.studentNames = students.map(student => student.name)
          .filter(studentName => !this.user.children.includes(studentName));

        console.log(students);
      },
      error: (err) => {
        this.isProcessing = false;
        console.log(err);
      }
    })
  }

  dateTimeValidator(control: FormControl) {
    const dateValue: Date = new Date(control.value);
    const current: Date = new Date();
    const diffTime: number = current.getTime() - dateValue.getTime();
    const year: number = Math.floor(diffTime / (1000 * 60 * 60 * 24 * 365.25)); // Calculate age

    // If age is between 20 and 90, it's invalid
    if (year < 20 || year > 90) {
      return { dateTimeValidator: true };
    }

    return null; // No error if the age is within the valid range
  }

  isValidName(control: FormControl) {
    const value = control.value;

    if (control.value == null || control.value === "") return null;

    if (value != null && value.indexOf(' ') === -1 && value.length >= 3 && value.length <= 21) {
      return null; // No validation errors
    }

    return { isValidName: true };
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
    if (this.userForm.get('name').touched || this.userForm.get('birth').touched
      || this.userForm.get('firstname').touched || this.userForm.get('lastname').touched){
      return true;
    } else return false
  }

  addToClass(currentSclassName: string) {

    this.isProcessing = true;
    let params = {'className': currentSclassName};

    this.userService.addClass(this.user.id, params).subscribe({
      next: (data) => {

        let message = "Új osztályfőnöki viszony: "
        this.isProcessing = false;
        this.crudDone.emit(`${message}\n${data.classhead}\nOsztály: ${currentSclassName}`);

      }, error: (err) => {
        this.isProcessing = false;
        this.crudError = true;
        this.errorMessage = err.error;
      }
    });


  }

  addClassHeadRole(currentSclassName: string) {

    this.isProcessing = true;
    let params = {'className': currentSclassName};

    this.userService.addClassheadRole(this.user.id, params).subscribe({
      next: (data) => {

        let message = "Új osztályfőnök: "
        this.isProcessing = false;
        this.crudDone.emit(`${message}\n${data.classhead}\nOsztály: ${currentSclassName}`);

      }, error: (err) => {
        this.isProcessing = false;
        this.crudError = true;
        this.errorMessage = err.error;
      }
    });
  }

  changeCurrentStudentName(student: string) {
    this.searchStudentRequest = student;
    this.currentStudentName = student;

    console.log(this.searchStudentRequest)
    console.log(this.currentStudentName)
  }

  addParentRole(currentStudentName: string) {

    this.isProcessing = true;
    let params = {'childName': currentStudentName};
    this.userService.addParentRole(this.user.id,params).subscribe({
      next: (data) => {

        let message = "Új szülő: "
        this.isProcessing = false;
        this.crudDone.emit(`${message}\n${data.parent}\nTanuló:\n ${data.children}`);

      }, error: (err) => {
        this.isProcessing = false;
        this.crudError = true;
        this.errorMessage = err.error;
      }
    });

  }

  addChild(currentStudentName: string) {
    this.isProcessing = true;
    let params = {'childName': currentStudentName};
    this.userService.addChildren(this.user.id,params).subscribe({
      next: (data) => {

        let message = "Új szülői viszony: "
        this.isProcessing = false;
        this.crudDone.emit(`${message}\n${data.parent}\nTanuló:\n ${data.children}`);

      }, error: (err) => {
        this.isProcessing = false;
        this.crudError = true;
        this.errorMessage = err.error;
      }
    });

  }

  addVisitorRole() {
    this.isProcessing = true;

    this.userService.addVisitorRole(this.user.id).subscribe({
      next: (data) => {
        this.isProcessing = false;

        let message = "A köv. felhasználó elveszítette jogosultságát: "
        this.crudDone.emit(`${message}\n${data.visitor}`);

      }, error: (err) => {
        this.isProcessing = false;
        this.crudError = true;
        this.errorMessage = err.error;
      }
    });

  }

  addTeacherRole() {
    this.isProcessing = true;

    this.userService.addTeacherRole(this.user.id).subscribe({
      next: (data) => {
        this.isProcessing = false;
        let message = "Új tanár: "
        this.crudDone.emit(`${message}\n${data.teacher}`);

      }, error: (err) => {
        this.isProcessing = false;
        this.crudError = true;
        this.errorMessage = err.error;
      }
    });

  }

  addAdminRole() {
    this.isProcessing = true;

    this.userService.addAdminRole(this.user.id).subscribe({
      next: (data) => {
        this.isProcessing = false;
        let message = "Új adminisztrátor: "
        this.crudDone.emit(`${message}\n${data.admin}`);

      }, error: (err) => {
        this.isProcessing = false;
        this.crudError = true;
        this.errorMessage = err.error;
      }
    });

  }

  isVisitorRole(): boolean {
    if(this.user.userrole.includes('Visitor')) return false;
    else return true
  }

  isParentRole():boolean{
    if(this.user.userrole.includes('Parent')) return true
    else return false;
  }

  isTeacherRole():boolean{
    if(this.user.userrole.includes('Visitor') || this.user.userrole.includes('ClassHead')) return true
    else return false;
  }

  isClassHeadRole():boolean{
    if(this.user.userrole.includes('Visitor') || this.user.userrole.includes('Teacher')) return true
    else return false;
  }

  isAdminRole():boolean{
    if(this.user.userrole.includes('Visitor')) return true
    else return false;
  }

  isAuthenticated():boolean{
    if(this.storageService.getUser().username == this.user.name) return true;
    else return false
  }
}
