import { Injectable } from '@angular/core';
import { CanActivate,Router } from '@angular/router';
import { AuthService } from '../core/auth/auth.service';
import { map, catchError } from 'rxjs/operators';
import { of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EditProfileGuard implements CanActivate {
  constructor(private authService: AuthService,private router: Router){}
  canActivate(){
    return this.authService.user$.pipe(
      map((user)=>{
        if(!user['provider']){
          return true;
        }else{
          this.router.navigateByUrl('/home');
          return false;
        }
      }),catchError((error)=>{
        this.router.navigateByUrl('/home');
        return of(false);
      })
    )



  }

}
