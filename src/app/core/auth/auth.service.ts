import { Injectable, NgZone } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { RegisterAndLogin } from './interfaces/registerAndLogin';
import { SwalService } from '../../services/swal.service';
import * as fb from 'firebase/app';
import { getMsgError } from 'src/app/class/error.class';
import { NgxSpinnerService } from 'ngx-spinner';
import { User } from './interfaces/user';
import { environment } from '../../../environments/environment';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private user:BehaviorSubject<User> = new BehaviorSubject<User>(null);
  user$ = this.user.asObservable();

  constructor(private angularFireAuth: AngularFireAuth,
    private router: Router,
    private swalService: SwalService,
    private ngxSpinnerService: NgxSpinnerService) {
      this.angularFireAuth.authState.subscribe((userAuth)=>{
        if(userAuth){
          const user:User={
            uid:userAuth.uid,
            name:userAuth.displayName,
            email:userAuth.email,
            photo:userAuth.photoURL || environment.userPhotoDefault
          };
          this.user.next(user);
        }
      });
  }


  async register(value: RegisterAndLogin): Promise<void> {
    try {
      await this.ngxSpinnerService.show();
      await this.angularFireAuth.createUserWithEmailAndPassword(value.email, value.password);
      (await this.angularFireAuth.currentUser).sendEmailVerification();
      this.router.navigate(['/emailverification']);
      await this.ngxSpinnerService.hide();
    } catch (error: any) {
      await this.ngxSpinnerService.hide();
      this.handleError(error.code);
      throw(error)
    }
  }

  async login(value: RegisterAndLogin):Promise<void> {
    try {
      await this.ngxSpinnerService.show();
      await this.angularFireAuth.signInWithEmailAndPassword(value.email, value.password);
      const currentUser = await this.getcurrentUser();
      if (currentUser.emailVerified) {
        this.router.navigate(['/home']);
      } else {
        this.swalService.mixinSwal('error', 'Verifica tu E-mail para poder iniciar sesión.');
        this.signOut();
      }
      await this.ngxSpinnerService.hide();
    } catch (error) {
      await this.ngxSpinnerService.hide();
      this.handleError(error.code);
      throw(error)
    }
  }

  async loginWithGoogle(){
    try{
      await this.ngxSpinnerService.show();
      await this.angularFireAuth.signInWithPopup(new fb.default.auth.GoogleAuthProvider());
      await this.ngxSpinnerService.hide();
      this.router.navigateByUrl('/home');
    }catch(e){
      this.handleError(e.code,null,'Google');
      await this.ngxSpinnerService.hide();
    }
  }

  async loginWithFacebook(){
    try {
        await this.ngxSpinnerService.show();
        await this.angularFireAuth.signInWithPopup(new fb.default.auth.FacebookAuthProvider());
        await this.ngxSpinnerService.hide();
        this.router.navigateByUrl('/home');
    } catch (e:any) {
        this.handleError(e.code,e.email,'Facebook');
        await this.ngxSpinnerService.hide();
    }
  }

  async checkedEmail(): Promise<void> {
    try {
      let currentUser = await this.getcurrentUser();
      if (currentUser == null) { return this.swalService.mixinSwal('error', 'No hay un usuario ingresado') }
      await currentUser.reload();
      currentUser = await this.getcurrentUser();
      if (currentUser.emailVerified) {
        this.router.navigate(['/home'])
      } else {
        this.swalService.mixinSwal('error', 'No ha verificado el E-mail');
      }
    } catch (e) {
      this.swalService.mixinSwal('info', 'No hay un usuario registrado');
      this.router.navigate(['/login']);
    }
  }

  async reSendEmail(): Promise<void> {
    try {
      (await this.angularFireAuth.currentUser).sendEmailVerification();
      this.swalService.mixinSwal('success', 'Se ha reenviado el correo de verificación')
    } catch (e) {
      this.swalService.mixinSwal('info', 'No hay un usuario registrado');
      this.router.navigate(['/login']);
    }
  }

  async resetPassword(){
    try {
     const email = await this.swalService.emailModal();
     if(!email)return;
     await this.ngxSpinnerService.show();
     await this.angularFireAuth.sendPasswordResetEmail(email);
     await this.ngxSpinnerService.hide();
     this.swalService.mixinSwal('success','Se ha enviado un correo electronico para que puedas restablecer tu contraseña.')
    } catch (error) {
      await this.ngxSpinnerService.show();
      this.handleError(error.code);
      await this.ngxSpinnerService.hide();
      throw(error)
    }
  }

  async signOut() {
    await this.angularFireAuth.signOut();
    this.router.navigateByUrl('/login')
  }

  getcurrentUser() {
    return this.angularFireAuth.currentUser;
  }

  handleError(code:string,args?:any,provider?:string){
    const msg = getMsgError(code,args,provider);
    this.swalService.alertErrorLogin(msg);
  }
}
