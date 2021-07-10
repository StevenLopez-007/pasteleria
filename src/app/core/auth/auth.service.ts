import { Injectable, NgZone } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { RegisterAndLogin } from './interfaces/registerAndLogin';
import { SwalService } from '../../services/swal.service';
import * as fb from 'firebase';
import { getMsgError } from 'src/app/class/error.class';
import { NgxSpinnerService } from 'ngx-spinner';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private angularFireAuth: AngularFireAuth,
    private router: Router,
    private ngZone: NgZone,
    private swalService: SwalService,
    private ngxSpinnerService: NgxSpinnerService) {
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
     await this.angularFireAuth.sendPasswordResetEmail(email);
     this.swalService.mixinSwal('success','Se ha enviado un correo electronico para que puedas restablecer tu contraseña.')
    } catch (error) {
      this.handleError(error.code);
      throw(error)
    }
  }

  async signOut() {
    await this.angularFireAuth.signOut();
  }

  getcurrentUser() {
    return this.angularFireAuth.currentUser;
  }

  handleError(code:string){
    const msg = getMsgError(code);
    this.swalService.alertErrorLogin(msg);
  }
}
