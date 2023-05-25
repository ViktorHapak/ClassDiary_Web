import {Component, OnInit} from '@angular/core';
import {Student} from "../../models/student.model";
import {User} from "../../models/user.model";
import {StudentService} from "../../_services/student.service";
import {UserService} from "../../_services/user.service";
import {StorageService} from "../../_services/storage.service";

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit{

  roleNames : string[] = ["ROLE_Visitor", "ROLE_Parent", "ROLE_Teacher", "ROLE_ClassHead", "ROLE_Admin","all"];
  currentRoleName: string = "all";

  users: User[] = [];
  currentUser: User = {};
  currentIndex = -1;
  emptyUser: User = {};
  emptyIndex = -1;
  name = '';

  messageText = '';
  messageMode = false
  crudOperation:string = "add";
  crudMode = false

  page = 1;
  count = 0;
  size = 5;

  constructor(private userService: UserService, protected storageService: StorageService) {
  }

  ngOnInit(): void {
    this.getAllUsers();
    this.emptyUser.id = -1;

    console.log(this.storageService.getUser())
  }


  private getAllUsers() {
    let params =
      {'roleName': this.currentRoleName,'title':this.name, 'page': this.page-1, 'size': this.size};

    this.userService.getAllByPage(params).subscribe({
      next: (data) => {
        const { users, totalItems }: any = data;
        this.users = users;
        this.count = totalItems;
        this.storageService.writeCountValue(this.count);
        console.log(users, totalItems);
      },
      error: (err) => {
        console.log(err);
      }
    })
  }

  handlePageChange(event: number) {
    this.page = event;
    this.getAllUsers()

  }

  handleSizeChange(event: number) {
    this.size = event;
    this.getAllUsers()
  }

  refreshList(): void {
    this.getAllUsers()
    this.currentUser = {};
    this.currentIndex = -1;
  }


  removeUser(user: User) {
    const loggedInUser = this.storageService.getUser();

    if(loggedInUser && user.name !== loggedInUser.username){
      this.userService.delete(user.id).subscribe({
      next: (data) => {
        console.log(data)
        this.refreshList()
      }, error: (err) => {

      }
    })}

  }

  callInfo(user: User) {

    this.userService.get(user.id).subscribe({
      next: (data) => {
        console.log(data)
        this.currentUser = data
        this.currentIndex = data.id
        console.log(data.firstname)
      }, error: (err) => {

      }
    })

  }

  formatRoleName(radioValue: string) {
    switch (radioValue){case (this.roleNames[0]): return "Látogató";
      case (this.roleNames[1]): return "Szülő";
      case (this.roleNames[2]): return "Tanár";
      case (this.roleNames[3]): return "Osztályfőnök";
      case (this.roleNames[4]): return "Adminisztrátor";
      case (this.roleNames[5]): return "Összes";
      default: return "";}

  }

  searchByName() {
    this.page=1
    this.getAllUsers();

  }

  searchByRole() {
    this.page=1
    this.getAllUsers();
  }

  openForm(operation: string, user: User) {
    this.currentIndex = user.id;
    this.currentUser = user;
    this.crudOperation = operation;
    console.log(this.currentUser)
    console.log(this.currentIndex)
    this.crudMode = true;
    console.log(this.crudMode)
  }


  teacherAccess(){
    if (this.storageService.hasTeacherRole() || this.storageService.hasAdminRole()) return true
    else return false;
  }

  adminAccess() {
    if (this.storageService.hasAdminRole()) return true
    else return false;
  }

}
