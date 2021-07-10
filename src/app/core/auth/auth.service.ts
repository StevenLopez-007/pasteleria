import { Injectable, NgZone } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { RegisterAndLogin } from './interfaces/registerAndLogin';
import { SwalService } from '../../services/swal.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  errorMessage = '';
  constructor(private angularFireAuth: AngularFireAuth,
    private router: Router,
    private ngZone: NgZone,
    private swalService: SwalService) {
    }

  async register(value: RegisterAndLogin): Promise<void> {
    try {
      await this.angularFireAuth.createUserWithEmailAndPassword(value.email, value.password);
      (await this.angularFireAuth.currentUser).sendEmailVerification();
      this.router.navigate(['/emailverification']);
    } catch (resp: any) {
      this.errorMessage = resp.message;
    }
  }

  async login(value: RegisterAndLogin): Promise<void> {
    try {
      await this.angularFireAuth.signInWithEmailAndPassword(value.email, value.password);
      const currentUser = await this.getcurrentUser();
      if (currentUser.emailVerified) {
        this.router.navigate(['/home']);
      } else {
        this.swalService.mixinSwal('error', 'Verifica tu E-mail para poder iniciar sesión.');
        this.signOut();
      }
    } catch (resp) {
      this.errorMessage = resp.message;
    }
  }

  async checkedEmail():Promise<void> {
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

  async reSendEmail():Promise<void> {
    try {
      (await this.angularFireAuth.currentUser).sendEmailVerification();
      this.swalService.mixinSwal('success', 'Se ha reenviado el correo de verificación')
    } catch (e) {
      this.swalService.mixinSwal('info', 'No hay un usuario registrado');
      this.router.navigate(['/login']);
    }
  }

  async signOut(){
    await this.angularFireAuth.signOut();
  }

  getcurrentUser() {

    return this.angularFireAuth.currentUser;
  }
}
