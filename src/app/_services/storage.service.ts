import { Injectable } from '@angular/core';
import {User} from "../models/user.model";

const USER_KEY = 'auth-user';
const SUBCOMP_KEY = 'sub-routing';
const SEMESTER_KEY = 'load-semester';
const SCLASS_KEY = 'load-sclass';
const SUBJECT_KEY = 'load-subject';
const SCHOOLYEAR_KEY = 'load-schoolyear'

@Injectable({
  providedIn: 'root'
})
export class StorageService {
  constructor() {}


  public justRegistered = false;
  public justLogged = false;

  public loggedIn = false;
  public username = '';
  public role = '';

  public count = -1;
  public schoolYear: string = '';

  public registrationMessage = '';
  public loginMessage = '';

  public dataType = 'students';
  public currentSemester = '';
  public currentSclass = '';
  public currentSubject = '';
  private user: any;

  clean(): void {
    this.loggedIn = false;
    window.sessionStorage.clear();
    this.username = '';
    this.role = '';
  }

  public saveUser(user: any): void {
    this.loggedIn = true;
    window.sessionStorage.removeItem(USER_KEY);
    window.sessionStorage.setItem(USER_KEY, JSON.stringify(user));
    this.username = user.username;
    this.role = user.role.toString();
  }

  public saveDataType(dataType: string): void{
    window.sessionStorage.removeItem(SUBCOMP_KEY);
    window.sessionStorage.setItem(SUBCOMP_KEY, JSON.stringify(dataType));
    this.dataType = dataType;

  }

  public saveSemester(semester: string): void {
    window.sessionStorage.removeItem(SEMESTER_KEY);
    window.sessionStorage.setItem(SEMESTER_KEY, JSON.stringify(semester))
    this.currentSemester = semester;
  }

  public saveSclass(sclass: string): void {
    window.sessionStorage.removeItem(SCLASS_KEY);
    window.sessionStorage.setItem(SCLASS_KEY, JSON.stringify(sclass))
    this.currentSclass = sclass;
  }

  public saveSubject(subject: string): void {
    window.sessionStorage.removeItem(SUBJECT_KEY);
    window.sessionStorage.setItem(SUBJECT_KEY, JSON.stringify(subject))
    this.currentSubject = subject;
  }

  public saveSchoolYear(schoolyear: string): void {
    window.sessionStorage.removeItem(SCHOOLYEAR_KEY);
    window.sessionStorage.setItem(SCHOOLYEAR_KEY, JSON.stringify(schoolyear))
    this.schoolYear = schoolyear;
  }

  public getUser(): any {
    const user = window.sessionStorage.getItem(USER_KEY);
    if (user) {
      return JSON.parse(user);
    }

    return null;
  }

  public getDataType(): string{
    const subComponent = window.sessionStorage.getItem(SUBCOMP_KEY);
    if(subComponent){
      return JSON.parse(subComponent);
    }

    return this.dataType;
  }

  public getSemester(): string{
    const semester = window.sessionStorage.getItem(SEMESTER_KEY);
    if(semester){
      return JSON.parse(semester);
    }

    return this.currentSemester;
  }

  public getSclass(): string{
    const sclass = window.sessionStorage.getItem(SCLASS_KEY);
    if(sclass){
      return JSON.parse(sclass);
    }

    return this.currentSclass;
  }

  public getSubject(): string{
    const subject = window.sessionStorage.getItem(SUBJECT_KEY);
    if(subject){
      return JSON.parse(subject);
    }

    return this.currentSubject;
  }

  public getSchoolYear(): string {
    const schoolyear = window.sessionStorage.getItem(SCHOOLYEAR_KEY);
    if(schoolyear){
      return JSON.parse(schoolyear);
    }

    return this.schoolYear;
  }


  public isLoggedIn(): boolean {
    const user = window.sessionStorage.getItem(USER_KEY);
    if (user) {
      return true;
    }

    return false;
  }

  public writeCountValue(newCount: number): void{
    this.count = newCount;
  }

  public hasParentRole(): boolean{
    const user = window.sessionStorage.getItem(USER_KEY);
    if(!user) return false;
    else
    {
      if (JSON.parse(user).role.includes('ROLE_Parent')) return true;
      else return false;
    }
  }

  public hasChild(studentName: string): boolean{
    const user = window.sessionStorage.getItem(USER_KEY);
    if(!user) return false;
    else
    {
      if (JSON.parse(user).role.includes('ROLE_Parent') &&
        JSON.parse(user).children.includes(studentName)) return true;
      else return false;
    }
  }

  public hasTeacherRole(): boolean{
    const user = window.sessionStorage.getItem(USER_KEY);
    if(!user) return false;
    else
    {
      if (JSON.parse(user).role.includes('ROLE_Teacher') ||
        JSON.parse(user).role.includes('ROLE_ClassHead')) return true;
      else return false;
    }
  }

  public hasClassHeadRole(): boolean{
    const user = window.sessionStorage.getItem(USER_KEY);
    if(!user) return false;
    else
    {
      if (JSON.parse(user).role.includes('ROLE_ClassHead')) return true;
      else return false;
    }
  }

  public hasTeacherRegistry(subjectName: string, sclassName: string): boolean{
    const user = window.sessionStorage.getItem(USER_KEY);
    if(!user) return false;
    else
    {
      if ((JSON.parse(user).role.includes('ROLE_Teacher') ||
        JSON.parse(user).role.includes('ROLE_ClassHead'))
      && JSON.parse(user).learning.includes(JSON.parse(user).username + '-' + subjectName + '-' + sclassName)) return true;
      else return false;
    }
  }

  public hasClass(sclassName: string): boolean{
    const user = window.sessionStorage.getItem(USER_KEY);
    if(!user) return false;
    else
    {
      if (JSON.parse(user).role.includes('ROLE_ClassHead')
      && (JSON.parse(user).class.includes(sclassName) )) return true;
      else return false;
    }
  }

  public hasAdminRole(): boolean{
    const user = window.sessionStorage.getItem(USER_KEY);
    if(!user) return false;
    else
    {
      if (JSON.parse(user).role.includes('ROLE_Admin')) return true;
      else return false;
    }
  }


  public makeCurrentSignup(message: string): void{
    this.justRegistered = true;
    this.registrationMessage = message;
  }

  public makeCurrentLogin(message: string): void{
    this.justLogged = true;
    this.loginMessage = message;
  }

  public confirmLogin(){
    this.justLogged = false;
    this.loginMessage = '';
  }

  public confirmSignup(){
    this.justRegistered = false;
    this.registrationMessage = '';
  }
}
