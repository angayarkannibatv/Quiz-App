import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class StudentService {

  constructor(private http: HttpClient) { }

  addStudent(name: string, email: string, password: string) {
    const data = {
      name: name,
      email: email,
      password: password
    };
    return this.http.post(`${environment.apiUrl}/signup`, data);
  }
}
