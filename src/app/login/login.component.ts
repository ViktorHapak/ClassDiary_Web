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
      next: data => {
        this.storageService.saveUser(data);
        this.isProcessing = false;

        this.isLoginFailed = false;
        this.isLoggedIn = true;

        const user = this.storageService.getUser();
        this.username = user.username;
        this.role = user.role.toString();
        console.log(user);
        console.log(this.username)
        console.log(this.role)

        this.storageService.makeCurrentLogin('Bejelentkezve, mint: ');
        this.router.navigate(['home']);
      },
      error: err => {
        this.errorMessage = err.error;
        this.isProcessing = false;

        this.isLoginFailed = true;
      }
    });
  }

  reloadPage(): void {
    window.location.reload();
  }
}
