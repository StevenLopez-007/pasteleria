import { Component, OnInit} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { environment } from '../../../../environments/environment';
import { AuthService } from '../auth.service';
import {Subject,EMPTY } from 'rxjs';
import {catchError, exhaustMap} from 'rxjs/operators';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['../style.auth.css']
})
export class LoginComponent implements OnInit {

  clicks$: Subject<boolean> = new Subject();

  name:string = environment.name;
  showPassword:boolean = false;

  loginForm:FormGroup;

  formSubmit:boolean =false;

  constructor(private formBuilder: FormBuilder,private authService: AuthService) { }

  ngOnInit(): void {
    document.title = `${environment.name} - Inicio de sesión`;
    this.configFormLogin();
    this.login();
  }

  get loginFormControls(){
    return this.loginForm.controls
  }

  async submitLogin(){
    this.formSubmit=true;
    if(this.loginForm.valid){
      this.clicks$.next(true);
    }
  }

  login(){
    this.clicks$.pipe(
      exhaustMap(async ()=>{
        return await this.authService.login(this.loginForm.value)
      }),
      catchError((e)=>{
        this.loginForm.get('password').reset();
        this.login();
        return EMPTY;
      })
    ).subscribe();
  }

  async resetPassword(){
    this.authService.resetPassword();
  }

  configFormLogin(){
    this.loginForm = this.formBuilder.group({
      email:['',[Validators.required,Validators.email]],
      password:['',[Validators.required,Validators.minLength(6)]]
    });
  }

}
