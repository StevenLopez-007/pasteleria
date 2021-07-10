import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AuthRoutingModule } from './auth-routing.module';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { ReactiveFormsModule } from '@angular/forms';
import { AuthTemplateComponent } from './auth-template/auth-template.component';
import { EmailverificationComponent } from './emailverification/emailverification.component';
import { ComponentsModule } from '../components/components.module';

@NgModule({
  declarations: [LoginComponent,RegisterComponent,AuthTemplateComponent, EmailverificationComponent],
  imports: [
    CommonModule,
    AuthRoutingModule,
    ReactiveFormsModule,
    ComponentsModule,
  ],
  exports:[LoginComponent,RegisterComponent]
})
export class AuthModule { }
