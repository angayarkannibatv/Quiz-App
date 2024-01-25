import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ApiService } from '@app/_services/api.service';
import { EmailService } from '@app/_services/email.service';
@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrl: './forgot-password.component.css'
})
export class ForgotPasswordComponent {
  profileForm = new FormGroup({
    email: new FormControl('', Validators.required)
  });
  clientId="262091523626-tu5ffnitduakqqanvmf6m84rbg2co5ra.apps.googleusercontent.com";
  loading = false;
  submitted = false;
  hidePassword: boolean = true;
  errMsg: any;

  constructor(private apiService: ApiService){}

  ngOnInit(): void {
    
  }

  get f() { return this.profileForm.controls; }

  togglePassword() {
    this.hidePassword = !this.hidePassword;
  }

  onSubmit(){
   
    this.submitted = true;
    this.errMsg = '';

    if (this.profileForm.invalid) {
      return;
    }
    else{
      const mailOptions = {
        from: 'baluangayar@gmail.com',
        to: this.profileForm.value.email ? this.profileForm.value.email : '', // Replace with recipient email address
        subject: "Quiz App - Account created successfully!",
        // text: `${name}\n${message}`,
        html: `<p>"Your Account created successfully.\nPlease confirm your email"</p>`
      };
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
}
