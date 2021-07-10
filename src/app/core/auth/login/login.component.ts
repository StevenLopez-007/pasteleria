import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { environment } from '../../../../environments/environment';
import { AuthService } from '../auth.service';
import { Observable, fromEvent, Subject } from 'rxjs';
import {exhaustMap, finalize} from 'rxjs/operators';

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
  loading:boolean=false;
  formSubmit:boolean =false;

  constructor(private formBuilder: FormBuilder,private authService: AuthService) { }

  ngOnInit(): void {
    this.loginForm = this.formBuilder.group({
      email:['',[Validators.required,Validators.email]],
      password:['',[Validators.required,Validators.minLength(4)]]
    });

    this.clicks$.pipe(
      exhaustMap(async ()=>{
        return await this.authService.login(this.loginForm.value)
      }),
      finalize(()=>this.loading=false)
    ).subscribe();

  }

  get loginFormControls(){
    return this.loginForm.controls
  }

  async login(){
    this.formSubmit=true;
    if(this.loginForm.valid){
      this.loading=true;
      // await this.authService.login(this.loginForm.value);
      this.clicks$.next(true);
      // this.loading=false;
    }

  }

}
