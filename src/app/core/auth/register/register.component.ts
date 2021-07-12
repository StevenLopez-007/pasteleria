import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EMPTY, Subject } from 'rxjs';
import { catchError, exhaustMap, finalize } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { AuthService } from '../auth.service';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['../style.auth.css']
})
export class RegisterComponent implements OnInit {

  clicks$: Subject<boolean> = new Subject();

  showPassword:boolean = false;

  name:string = environment.name;

  registerForm:FormGroup;

  formSubmit:boolean =false;
  constructor(private formBuilder: FormBuilder,private authService: AuthService,private ngxSpinnerService: NgxSpinnerService) { }

  ngOnInit(): void {
    document.title = `${environment.name} - Creación de cuenta`
    this.configRegisterForm();
    this.register();
  }

  get registerFormControls(){
    return this.registerForm.controls
  }

  async submitRegister(){
    this.formSubmit=true;
    this.ngxSpinnerService.show();
    if(this.registerForm.valid){
      this.clicks$.next(true);
    }
  }

  register(){
    this.clicks$.pipe(
      exhaustMap(async ()=>{
        return await this.authService.login(this.registerForm.value)
      }),
      catchError((e)=>{
        this.registerForm.get('password').reset();
        this.register();
        return EMPTY;
      }),
      finalize(()=>{
        this.ngxSpinnerService.hide();
      })
    ).subscribe();
  }

  configRegisterForm(){
    this.registerForm = this.formBuilder.group({
      email:['',[Validators.required,Validators.email]],
      password:['',[Validators.required,Validators.minLength(6)]]
    });
  }

}
