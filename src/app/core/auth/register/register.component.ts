import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subject } from 'rxjs';
import { exhaustMap, finalize } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { AuthService } from '../auth.service';

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
  loading:boolean=false;
  formSubmit:boolean =false;
  constructor(private formBuilder: FormBuilder,private authService: AuthService) { }

  ngOnInit(): void {
    this.registerForm = this.formBuilder.group({
      email:['',[Validators.required,Validators.email]],
      password:['',[Validators.required,Validators.minLength(4)]]
    });

    this.clicks$.pipe(
      exhaustMap(async ()=>{
        return await this.authService.login(this.registerForm.value)
      }),
      finalize(()=>this.loading=false)
    ).subscribe();
  }

  get registerFormControls(){
    return this.registerForm.controls
  }

  async register(){
    this.formSubmit=true;
    if(this.registerForm.valid){
      this.loading =true;
      this.clicks$.next(true);
    }
  }

}
