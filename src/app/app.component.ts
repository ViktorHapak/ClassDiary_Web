import {AfterViewInit, Component, OnInit} from '@angular/core';
import { Subscription } from 'rxjs';
import { StorageService } from './_services/storage.service';
import { AuthService } from './_services/auth.service';
import { EventBusService } from './_shared/event-bus.service';
import {TeacherService} from "./_services/teacher.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit,AfterViewInit{
  isLoggedIn = false;
  showAdminBoard = false;
  showModeratorBoard = false;
  username?: string;
  role?: string;

  isRightMenuOpen: boolean = false;

  eventBusSub?: Subscription;

  constructor(
    protected storageService: StorageService,
    private teacherService: TeacherService,
    private authService: AuthService,
    private eventBusService: EventBusService
  ) {}

  ngOnInit(): void {
    this.defineSchoolYear();
    this.isLoggedIn = this.storageService.isLoggedIn();
    if (this.isLoggedIn) {
      console.log('Logged in!')
      const user = this.storageService.getUser();
      this.username = user?.username;
      this.role = user?.role.toString();

      console.log(user);
      console.log(this.username);
      console.log(this.role)

    }

    this.eventBusSub = this.eventBusService.on('logout', () => {
      this.logout();
    });

  }

  ngAfterViewInit(): void {
    // Check if the user just registered
    if (this.storageService.justRegistered) {
      setTimeout(() => {
        this.storageService.confirmSignup();  // Reset the flag
        window.location.reload();  // Reload the page after 5 seconds
      }, 5000); // Wait for 3 seconds
    }

    if (this.storageService.justLogged) {
      setTimeout(() => {
        this.storageService.confirmLogin();  // Reset the flag
        window.location.reload();  // Reload the page after 5 seconds
      }, 5000); // Wait for 3 seconds
    }
  }

  defineSchoolYear(){
    this.teacherService.getSchoolYear().subscribe({
      next: (data) => {
        console.log(data.schoolYear);
        this.storageService.saveSchoolYear(data.schoolYear);
      }, error: (err) => {
        console.log(err.error);
    }
    })
  }

  closeMessage(): void{
    this.storageService.confirmSignup();
    this.storageService.confirmLogin();
    window.location.reload();
  }

  logout(): void {
    if (this.isLoggedIn) {
      this.storageService.clean();
      window.location.reload();
      this.storageService.count = -1;
    }
  }
}
