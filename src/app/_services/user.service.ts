import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import { Observable } from 'rxjs';

const USER_API  = 'http://localhost:8080/api/data/users';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
  withCredentials: true
};

@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor(private http: HttpClient) {}

  getAll(): Observable<any>{
    return this.http.get<any>(USER_API + "/all", httpOptions);
  }

  getAllByPage(params: any): Observable<any>{
    let queryParams: HttpParams = this.getQueryParams(params)

    return this.http.get<any>(`${USER_API}/allByPage`,
      {params: queryParams, headers: httpOptions.headers});
  }

  getAllByName(params: any): Observable<any>{
    return this.http.get<any>(`${USER_API}/byNage?${params}`, httpOptions);
  }

  getAllByRole(params: any): Observable<any>{
    return this.http.get<any>(`${USER_API}/byRole?${params}`, httpOptions);
  }

  get(id: any): Observable<any>{
    return this.http.get<any>(`${USER_API}/${id}`, httpOptions);
  }

  update(id: any, data: any): Observable<any> {
    return this.http.put(`${USER_API}/${id}`, data, httpOptions);
  }

  addParentRole(id: any, params: any): Observable<any> {
    return this.http.put(`${USER_API}/parent/${id}`, null, {params, ...httpOptions});
  }

  addChildren(id: any, params: any): Observable<any> {
    return this.http.put(`${USER_API}/parent/${id}/new`,null,  {params, ...httpOptions});
  }

  addClassheadRole(id: any, params: any): Observable<any> {
    return this.http.put(`${USER_API}/classhead/${id}`, null, {params, ...httpOptions});
  }

  addClass(id: any, params: any): Observable<any> {
    return this.http.put(`${USER_API}/classhead/${id}/new`, null, {params, ...httpOptions});
  }

  addTeacherRole(id: any): Observable<any> {
    return this.http.put(`${USER_API}/teacher/${id}`, httpOptions);
  }

  addAdminRole(id: any): Observable<any> {
    return this.http.put(`${USER_API}/admin/${id}`, httpOptions);
  }

  addVisitorRole(id: any): Observable<any> {
    return this.http.put(`${USER_API}/visitor/${id}`, httpOptions);
  }

  delete(id: any): Observable<any> {
    return this.http.delete(`${USER_API}/${id}`, httpOptions);
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
