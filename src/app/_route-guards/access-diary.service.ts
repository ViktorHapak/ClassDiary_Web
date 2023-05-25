import { Injectable } from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree} from "@angular/router";
import {Observable} from "rxjs";
import {StorageService} from "../_services/storage.service";

@Injectable()
export class AccessDiaryService implements CanActivate{

  constructor(private storageService: StorageService, private router: Router) { }

  isAccess(): boolean{
    if(this.storageService.hasParentRole() || this.storageService.hasTeacherRole()
    || this.storageService.hasClassHeadRole() || this.storageService.hasAdminRole()){
      return true
    } else return false
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    if (this.isAccess()) return true
    else {
      this.router.navigate([''])
      return false}

  }


}
