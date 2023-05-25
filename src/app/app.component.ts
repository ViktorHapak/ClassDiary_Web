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
  isLoggedIn;
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
    if (this.storageService.isLoggedIn()) {
      const user = this.storageService.getUser();
      this.username = user?.username;
      this.role = user?.role.toString();
      this.isLoggedIn = true;
    }

    this.eventBusSub = this.eventBusService.on('logout', () => {
      this.logout();
    });

  }

  ngAfterViewInit(): void {
    // Check if the user just registered
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
    this.authService.logout().subscribe({
      next: () => {
        this.storageService.clean();
        this.storageService.count = -1;
        window.location.reload();
      }, error: (err) => {
        console.log(err.error);
      }

    })
  }
}
