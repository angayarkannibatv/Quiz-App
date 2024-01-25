import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { EmailConfirmationComponent } from './email-confirmation/email-confirmation.component';

const routes: Routes = [
    {   path: '', component: LoginComponent  },
    {   path: 'signup', component: SignupComponent  },
    {   path: 'forgot-password', component: ForgotPasswordComponent  },
    {   path: 'email-confirmation/:token', component: EmailConfirmationComponent  }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class AccountRoutingModule { }