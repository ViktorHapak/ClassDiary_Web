import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from "@angular/common/http";
import {Observable} from "rxjs";

const GRADES_API = 'http://localhost:8080/api/grades';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
  withCredentials: true
};

@Injectable({
  providedIn: 'root'
})
export class GradesService {

  constructor(private http: HttpClient) { }

  getGrades1(params: any): Observable<any> {
    let queryParams: HttpParams = this.getQueryParams(params);

    return this.http.get<any>(`${GRADES_API}/first`,
      {params: queryParams, headers: httpOptions.headers});
  }

  getGrades2(params: any): Observable<any> {
    let queryParams: HttpParams = this.getQueryParams(params);

    return this.http.get<any>(`${GRADES_API}/second`,
      {params: queryParams, headers: httpOptions.headers});
  }

  getFinalGrades(params: any): Observable<any> {
    let queryParams: HttpParams = this.getQueryParams(params);

    return this.http.get<any>(`${GRADES_API}/final`,
      {params: queryParams, headers: httpOptions.headers});
  }

  getGrades1byStudent(id: any): Observable<any>{
    return this.http.get<any>(`${GRADES_API}/first/${id}`, httpOptions);
  }

  getGrades2byStudent(id: any): Observable<any>{
    return this.http.get<any>(`${GRADES_API}/second/${id}`, httpOptions);
  }

  getFinalGradesbyStudent(id: any): Observable<any>{
    return this.http.get<any>(`${GRADES_API}/final/${id}`, httpOptions);
  }

  addGrade1(id: any, params: any) :Observable<any>{
    let queryParams: HttpParams = this.getQueryParams(params);
    return this.http.put(`${GRADES_API}/first/add/${id}`,null, {params, ...httpOptions});
  }

  addGrade2(id: any, params: any) :Observable<any>{
    let queryParams: HttpParams = this.getQueryParams(params);
    return this.http.put(`${GRADES_API}/second/add/${id}`,null, {params, ...httpOptions});
  }

  deleteGrade1(id: any, params: any) :Observable<any>{
    return this.http.put(`${GRADES_API}/first/delete/${id}`,null, {params, ...httpOptions});
  }

  deleteGrade2(id: any, params: any) :Observable<any>{
    return this.http.put(`${GRADES_API}/second/delete/${id}`,null, {params, ...httpOptions});
  }

  calculateModule1(id: any, params: any) :Observable<any>{
    return this.http.put(`${GRADES_API}/first/calc/${id}`,null, {params, ...httpOptions});
  }

  calculateModule2(id: any, params: any) :Observable<any>{
    return this.http.put(`${GRADES_API}/second/calc/${id}`,null, {params, ...httpOptions});
  }

  calculateSemester1(id: any, params: any) :Observable<any>{
    return this.http.put(`${GRADES_API}/first/semester/${id}`,null, {params, ...httpOptions});
  }

  calculateSemester2(id: any, params: any) :Observable<any>{
    return this.http.put(`${GRADES_API}/second/semester/${id}`,null, {params, ...httpOptions});
  }

  calculateYear(id: any, params: any): Observable<any>{
    return this.http.put(`${GRADES_API}/final/grade/${id}`,null, {params, ...httpOptions});
  }

  giveExamGrade(id: any, params: any): Observable<any>{
    return this.http.put(`${GRADES_API}/final/exam/${id}`,null, {params, ...httpOptions});
  }

  getQueryParams(params: any): HttpParams{
    let queryParams = new HttpParams();

    for (let key in params) {
      if (params[key] !== undefined && params[key] !== null) {
        queryParams = queryParams.set(key, params[key]);
      }
    }

    return queryParams;

  }







}
