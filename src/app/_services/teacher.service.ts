import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from "@angular/common/http";
import {Observable} from "rxjs";
import {Student} from "../models/student.model";
import {Subject} from "../models/subject.model";

const TEACHER_API = 'http://localhost:8080/api/data/subjects';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
  withCredentials: true
};

@Injectable({
  providedIn: 'root'
})
export class TeacherService {

  constructor(private http: HttpClient) { }

  getAll(params: any): Observable<any>{
    let queryParams: HttpParams = this.getQueryParams(params)

    return this.http.get<any>(`${TEACHER_API}/`,
      {params: queryParams, headers: httpOptions.headers});
  }

  getBySubject(params: any): Observable<any>{
    let queryParams: HttpParams = this.getQueryParams(params)

    return this.http.get<any>(`${TEACHER_API}/bySubject`,
      {params: queryParams, observe: 'response',headers: httpOptions.headers});
  }

  getByTeacher(params: any): Observable<any>{
    let queryParams: HttpParams = this.getQueryParams(params)

    return this.http.get<any>(`${TEACHER_API}/byTeacher`,
      {params: queryParams, observe: 'response', headers: httpOptions.headers});
  }

  getByClass(params: any): Observable<any>{
    let queryParams: HttpParams = this.getQueryParams(params)

    return this.http.get<any>(`${TEACHER_API}/byClass`,
      {params: queryParams, observe: 'response', headers: httpOptions.headers});
  }

  getSubjects(params: any): Observable<any>{
    let queryParams: HttpParams = this.getQueryParams(params)

    return this.http.get<any>(`${TEACHER_API}/subject/all`,
      {params: queryParams, headers: httpOptions.headers});
  }

  get(id: any): Observable<any>{
    return this.http.get<Subject>(`${TEACHER_API}/subject/${id}`);
  }

  create(data: any): Observable<any> {
    return this.http.post(TEACHER_API + '/', data, httpOptions);
  }

  delete(params: any): Observable<any> {
    let queryParams = this.getQueryParams(params)

    return this.http.delete(`${TEACHER_API}/`,
      {params: queryParams, observe: 'response', headers: httpOptions.headers});
  }

  createRegistry(params: any): Observable<any> {
    return this.http.post(TEACHER_API + '/registry', null, {params, ...httpOptions});
  }

  deleteRegistry(id: any): Observable<any> {
    return this.http.delete(`${TEACHER_API}/registry/${id}`, httpOptions);
  }

  deleteAllRegistries(): Observable<any> {
    return this.http.delete(`${TEACHER_API}/registry/all`, httpOptions)
  }

  getSchoolYear(): Observable<any>{
    return this.http.get(`${TEACHER_API}/schoolYear`,httpOptions);
  }

  beginNewSchoolYear(): Observable<any>{
    return this.http.put(`${TEACHER_API}/newSchoolYear`,httpOptions);
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
