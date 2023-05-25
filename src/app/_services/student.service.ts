import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from "@angular/common/http";
import {Observable} from "rxjs";
import {Student} from "../models/student.model";

const STUDENTS_API = 'http://localhost:8080/api/data/students';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
  withCredentials: true
};

@Injectable({
  providedIn: 'root'
})
export class StudentService {

  constructor(private http: HttpClient) {}

  getAll(): Observable<any> {
    return this.http.get<any>(STUDENTS_API + '/all', httpOptions);
  }

  getAllByParams(params: any): Observable<any> {
    let queryParams: HttpParams = this.getQueryParams(params);

    return this.http.get<any>(`${STUDENTS_API}/allPageByClassAndName`,
      {params: queryParams, headers: httpOptions.headers});
  }

  get(id: any): Observable<Student> {
    return this.http.get<Student>(`${STUDENTS_API}/${id}`);
  }

  create(data: any): Observable<any> {
    return this.http.post(`${STUDENTS_API}/`, data, httpOptions);
  }

  update(id: any, data: any): Observable<any> {
    return this.http.put(`${STUDENTS_API}/${id}`, data, httpOptions);
  }

  delete(id: any): Observable<any> {
    return this.http.delete(`${STUDENTS_API}/${id}`, httpOptions);
  }

  deleteAll(params: any): Observable<any> {
    let queryParams: HttpParams = this.getQueryParams(params);
    return this.http.delete(`${STUDENTS_API}/all`,{params: queryParams, headers: httpOptions.headers});
  }

  getClasses(): Observable<any>{
    return this.http.get<any>(`${STUDENTS_API}/classes`, httpOptions);
  }

  getClassesBySubject(params: { subjectName: string }) {
    let queryParams: HttpParams = this.getQueryParams(params);

    return this.http.get<any>(`${STUDENTS_API}/classes`,
      {params: queryParams, headers: httpOptions.headers});
  }


  createClass(year: number): Observable<any>{
    let queryParams: HttpParams = new HttpParams().set("year",year.toString());
    return this.http.post(`${STUDENTS_API}/class?${queryParams}`, httpOptions);
  }

  addToClass(id: any, params: any): Observable<any>{
    return this.http.put(`${STUDENTS_API}/toClass/${id}`,null, {params, ...httpOptions});
  }

  removeFromClass(id: any): Observable<any>{
    return this.http.put(`${STUDENTS_API}/fromClass/${id}`,httpOptions);
  }

  deleteClass(className: string): Observable<any>{
    let queryParams: HttpParams = new HttpParams().set("className", className);

    return this.http.delete(`${STUDENTS_API}/class`,
      {params: queryParams, headers: httpOptions.headers});
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
