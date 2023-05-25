import {
  AfterViewInit,
  Component,
  ComponentRef,
  ElementRef,
  OnInit,
  Renderer2,
  ViewChild,
  ViewContainerRef
} from '@angular/core';
import { UserService } from '../_services/user.service';
import {StorageService} from "../_services/storage.service";
import {StudentsComponent} from "./students/students.component";
import {LecturingComponent} from "./lecturing/lecturing.component";
import {UsersComponent} from "./users/users.component";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit, AfterViewInit {
  pulledDown = false;
  isLoggedIn = false;
  content?: string;
  subCompType?: string;


  @ViewChild('submenu') submenu!: ElementRef;
  @ViewChild('subComponentContainer', { read: ViewContainerRef }) container!: ViewContainerRef;
  private currentComponent!: ComponentRef<any>;


  constructor(private userService: UserService, protected storageService: StorageService,
              private renderer: Renderer2) { }

  ngOnInit(): void {
    this.isLoggedIn = this.storageService.isLoggedIn();
    this.subCompType = this.storageService.getDataType();

  }

  ngAfterViewInit(): void {
    if(this.storageService.isLoggedIn())
    this.loadComponent(this.subCompType)
    }



  /*pulldown(): void {
    this.pulledDown = !this.pulledDown; // Toggle state

    if (this.pulledDown) {
      this.renderer.setStyle(this.submenu.nativeElement, 'margin-top', 'auto'); // Expand
    } else {
      this.renderer.setStyle(this.submenu.nativeElement, 'margin-top', '-120px'); // Collapse
    }
  }*/

  pulldown(): void {
    this.pulledDown = !this.pulledDown;
  }

  loadComponent(componentName: string): void {
    if (this.currentComponent) {
      this.currentComponent.destroy();
    }

    switch (componentName) {
      case 'students':
        this.storageService.saveDataType('students');
        this.currentComponent = this.container.createComponent(StudentsComponent);
        break;
      case 'lecturing':
        this.storageService.saveDataType('lecturing');
        this.currentComponent = this.container.createComponent(LecturingComponent);
        break;
      case 'users':
        this.storageService.saveDataType('users');
        this.currentComponent = this.container.createComponent(UsersComponent);
        break;
    }
  }


}
