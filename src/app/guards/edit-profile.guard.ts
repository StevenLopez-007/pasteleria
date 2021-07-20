import { Injectable } from '@angular/core';
import { CanActivate,Router } from '@angular/router';
import { AuthService } from '../core/auth/auth.service';
import { map, catchError } from 'rxjs/operators';
import { of } from 'rxjs';
import { SwalService } from '../services/swal.service';

@Injectable({
  providedIn: 'root'
})
export class EditProfileGuard implements CanActivate {
  constructor(private authService: AuthService,private router: Router,private swalService: SwalService){}
  canActivate(){
    return this.authService.user$.pipe(
      map((user)=>{
        if(!user['provider']){
          return true;
        }else{
          this.router.navigateByUrl('/home');
          this.swalService.mixinSwal('info','No puedes editar este perfil.');
          return false;
        }
      }),catchError((error)=>{
        this.router.navigateByUrl('/home');
        this.swalService.mixinSwal('info','No puedes editar este perfil.');
        return of(false);
      })
    )



  }

}
