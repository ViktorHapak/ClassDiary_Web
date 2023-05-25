import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import { AuthService } from '../_services/auth.service';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {StorageService} from "../_services/storage.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit{
  isSuccessful = false;
  isSignUpFailed = false;
  errorMessage = '';
  reactiveForm: FormGroup;
  formStatus;

  //@ViewChild('submitRef', {static: true}) submitButton: ElementRef

  constructor(private authService: AuthService,
              private storageService: StorageService,
              private router: Router) { }

  ngOnInit() {
    this.reactiveForm = new FormGroup({
      firstname: new FormControl('', [Validators.required,this.isValidName]),
      lastname: new FormControl('', [Validators.required,this.isValidName]),
      email: new FormControl('', [Validators.required,Validators.email]),
      name: new FormControl('', [Validators.required,this.isValidName]),
      birth: new FormControl(null, [Validators.required, this.dateTimeValidator]),
      password: new FormControl('', [Validators.required, this.passwordValidator])
    })

    this.reactiveForm.statusChanges.subscribe((value) => {
      console.log(value);
      this.formStatus = value;
    })

  }



  dateTimeValidator(control: FormControl) {
    const dateValue: Date = new Date(control.value);
    const current: Date = new Date();
    const diffTime: number = current.getTime() - dateValue.getTime();
    const year: number = Math.floor(diffTime / (1000 * 60 * 60 * 24 * 365.25)); // Calculate age

    // If age is between 20 and 90, it's invalid
    if (year < 20 || year > 90) {
      return { dateTimeValidator: true }; // Validation failed
    }

    return null; // No error if the age is within the valid range
  }

  isValidName(control: FormControl) {
    const value = control.value;

    if (control.value == null || control.value === "") return null;

    if (value != null && value.indexOf(' ') === -1 && value.length >= 3 && value.length <= 21) {
      return null; // No validation errors
    }

    return { isValidName: true }; // Validation failed
  }

  passwordValidator(control: FormControl) {
    let bigLetters: number = 0;
    let smallLetters: number = 0;
    let numbers: number = 0;

    for (let i = 0; i < control.value.length; i++) {
      const charCode = control.value.charCodeAt(i);

      if (charCode >= 65 && charCode <= 90) bigLetters++; // Uppercase letters
      if (charCode >= 97 && charCode <= 122) smallLetters++; // Lowercase letters
      if (charCode >= 48 && charCode <= 57) numbers++; // Numbers
    }

    if (control.value == null || control.value === "") return null;

    // Check password validity
    if (bigLetters === 0 || smallLetters === 0 || numbers === 0 || control.value.length < 6 || control.value.length > 36) {
      return { passwordValidator: true }; // Invalid password
    }

    return null; // Valid password
  }

  isProcessing = false;

  onSubmit(): void {

    this.isProcessing = true;

    this.authService.register(this.reactiveForm?.get('firstname').value,
      this.reactiveForm?.get('lastname').value,
      this.reactiveForm?.get('email').value,
      this.reactiveForm?.get('name').value,
      this.reactiveForm?.get('birth').value,
      this.reactiveForm?.get('password').value
    ).subscribe({
      next: data => {
        this.isProcessing = false;
        console.log(data);
        this.isSuccessful = true;
        this.isSignUpFailed = false;
        const successMessage = `${data.message}`;
        this.storageService.makeCurrentSignup(successMessage);
        this.router.navigate(['home']);
      },
      error: err => {
        console.log(err);
        this.isProcessing = false;
        this.errorMessage = err.error;
        this.isSignUpFailed = true;
      }
    });
  }
}
