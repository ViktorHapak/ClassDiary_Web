import { Component, OnInit } from '@angular/core';
import { AuthService } from '../_services/auth.service';
import { StorageService } from '../_services/storage.service';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {Router} from "@angular/router";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  isLoggedIn = false;
  isLoginFailed = false;
  errorMessage = '';
  username: string;
  role: string;
  reactiveForm: FormGroup;
  formStatus;

  constructor(private authService: AuthService, private storageService: StorageService, private router: Router) { }

  ngOnInit(): void {
    this.reactiveForm = new FormGroup({
      username : new FormControl('',[Validators.required]),
      password: new FormControl('',[Validators.required]),
    })
  }

  isProcessing = false;

  onSubmit(): void {

    this.isProcessing = true;
    this.authService.login(this.reactiveForm.get('username')?.value,
      this.reactiveForm.get('password')?.value).subscribe({
      next: res => {
        this.storageService.makeLogin(res.token);
        this.storageService.makeCurrentLogin(`Bejelentkezve, mint: \n${this.reactiveForm.get('username')?.value}`)
        console.log("Token:", res.token);

        this.isProcessing = false;
        this.isLoginFailed = false;
        this.isLoggedIn = true;



        this.authService.get().subscribe({
          next: (user) => {
            this.storageService.saveUser(user);
            console.log("Bejelentkezve, mint: " +user);
            console.log(this.storageService.isLoggedIn());
            this.router.navigate(['home']);
          },
          error: (err) => {
            console.log(err.error);
          }
        })
        //this.router.navigate(['home']);
      },
      error: err => {
        this.errorMessage = err.error;
        this.isProcessing = false;

        this.isLoginFailed = true;
        console.log(err);
      }
    });
  }

  reloadPage(): void {
    window.location.reload();
  }
}
