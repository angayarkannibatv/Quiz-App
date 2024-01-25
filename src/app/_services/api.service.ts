import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(private http: HttpClient) { }

  sendEmail(data: any) {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json', 'accept': 'application/json' });
    return this.http.post(`${environment.apiUrl}/send-email`, data, {headers});
  }

  confirmEmail(data: any) {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json',  'accept': 'application/json' });
    return this.http.post(`${environment.apiUrl}/email-confirmation`, data, {headers});
  }

  checkEmailToken(data: any) {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json',  'accept': 'application/json' });
    return this.http.post(`${environment.apiUrl}/check-email-token`, data, {headers});
  }

  generateToken(data: any) {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json',  'accept': 'application/json' });
    return this.http.post(`${environment.apiUrl}/generate-token`, data, {headers});
  }

  updateEmailToken(data: any){
    const headers = new HttpHeaders({ 'Content-Type': 'application/json',  'accept': 'application/json' });
    return this.http.post(`${environment.apiUrl}/update-email-token`, data, {headers});
  }
}
