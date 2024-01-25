import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ApiService } from '@app/_services/api.service';
import { EmailService } from '@app/_services/email.service';
import { StudentService } from '@app/_services/student.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.css'
})
export class SignupComponent {
  profileForm = new FormGroup({
    name: new FormControl('', Validators.required),
    email: new FormControl('', Validators.required),
    password: new FormControl('', Validators.required),
  });
  clientId="262091523626-tu5ffnitduakqqanvmf6m84rbg2co5ra.apps.googleusercontent.com";
  loading = false;
  submitted = false;
  hidePassword: boolean = true;
  errMsg: any;
  userId: any;

  constructor(private studentService: StudentService,
    private emailService: EmailService,
    private apiService: ApiService){}

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
      this.studentService.addStudent(this.profileForm.value.name ? this.profileForm.value.name : '', this.profileForm.value.email ? this.profileForm.value.email : '', this.profileForm.value.password ? this.profileForm.value.password : '').subscribe(
        (response: any) => {
          console.log("response: ", response)
          console.log('Account created successfully!');
          let data = {
            id: response?.result?.insertId
          }

          // console.log("Id : ",JSON.stringify(data))

          this.apiService.generateToken(JSON.stringify(data)).subscribe(
            (response: any) => {
              console.log("response: ", response)
              console.log('Token generated successfully!');
              let name = this.profileForm.value.name ? this.profileForm.value.name : '';
              let email = this.profileForm.value.email ? this.profileForm.value.email : '';
              this.emailService.sendEmail(response?.email_token, response?.result?.insertId, name, email);
            },
            (error: any) => {
              console.log('Error adding student:', error);
          });
        },
        (error: any) => {
          console.log('Error adding student:', error);
      });
    }
  }


}
