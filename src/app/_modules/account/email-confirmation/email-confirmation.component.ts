import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from '@app/_services/api.service';
import { EmailService } from '@app/_services/email.service';

@Component({
  selector: 'app-email-confirmation',
  templateUrl: './email-confirmation.component.html',
  styleUrl: './email-confirmation.component.scss'
})
export class EmailConfirmationComponent {
  token: any;
  userId: any;
  name: any;
  email: any;
  isValid: boolean = false;
  message: any;
  constructor(private route: ActivatedRoute, private apiService: ApiService, private emailService: EmailService) {}
  ngOnInit(): void {
    this.token = this.route.snapshot.paramMap.get('token')
    this.emailConfirmation();
  }
  emailConfirmation() {
    this.route.queryParams.subscribe(params => {
      this.userId = params['id'];
      this.name = params['name'];
      this.email = params['email'];
    });
    let data = {
      token: this.token,
      user_id: this.userId
    }

    this.message = '';
    this.apiService.checkEmailToken(JSON.stringify(data)).subscribe(
      (response: any) => {
        console.log("response: ", response)
        console.log("Message : ", response.text)
        this.message = response.text;
        if(response.text === "Email token valid"){
          this.isValid = true;
          this.apiService.confirmEmail(JSON.stringify(data)).subscribe(
            (response: any) => {
              console.log("response: ", response)
              if(response.status === true){
                console.log('Email confirmed successfully!');
              }
              else{
                console.log('Soemthing went wrong, please try again later.');
              }
            },
            (error: any) => {
              console.log('Error checking token:', error);
          });
        }
      },
      (error: any) => {
        console.log('Error confirming email:', error);
    });
    
  }

  updateToken(){
    let data = {
      user_id: this.userId,
      token: this.token,
    }
    this.apiService.updateEmailToken(JSON.stringify(data)).subscribe(
      (response: any) => {
        console.log("response: ", response)
        console.log('Token updated successfully!');
        this.emailService.sendEmail(this.token, this.userId, this.name, this.email);
      },
      (error: any) => {
        console.log('Error adding student:', error);
    });
  }
}
