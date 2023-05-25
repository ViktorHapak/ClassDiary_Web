import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

const AUTH_API = 'http://localhost:8080/api/auth/';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
  withCredentials: true
};

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private http: HttpClient) {}

  login(username: string, password: string): Observable<any> {
    return this.http.post(
      AUTH_API + 'signin',
      {
        username,
        password,
      },
      httpOptions
    );
  }

  register(firstname: String, lastname: String, email: String,
           name: String, birth: Date, password: String): Observable<any> {
    return this.http.post(
      AUTH_API + 'signup',
      {
        firstname,
        lastname,
        email,
        name,
        birth,
        password,
      },
      httpOptions
    );
  }

  logout(): Observable<any> {
    return this.http.post(AUTH_API + 'signout', httpOptions);
  }

  getSchoolYear(): Observable<any>{
    return this.http.get<any>(AUTH_API + 'schoolYear');
  }
}
