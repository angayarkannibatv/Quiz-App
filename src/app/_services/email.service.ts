import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class EmailService {

  constructor(private http: HttpClient, private apiService: ApiService) { }

  sendEmail(email_token: any, userId: any, name: any, email: any){
    
    const mailOptions = {
      from: 'baluangayar@gmail.com',
      to: email, 
      subject: "Quiz App - Account created successfully!",
      html: `<p>Hey ${name}!</p>
        <p>Thank you for signing up with QuizApp.</p>
        <p>Please confirm your email address by clicking the given link below.</p>
        <a href="http://localhost:5000/email-confirmation/${email_token}?id=${userId}&name=${name}&email=${email}">Click here</a>`
      };

      console.log("Mail : ", mailOptions)
      this.apiService.sendEmail(JSON.stringify(mailOptions)).subscribe(
        (response: any) => {
          console.log("response: ", response)
          console.log('Email sent successfully!');
        },
        (error: any) => {
          console.log('Error sending email:', error);
      });
  }
}
