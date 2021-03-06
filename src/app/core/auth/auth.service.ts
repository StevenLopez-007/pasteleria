import { Injectable } from '@angular/core';

import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireStorage} from '@angular/fire/storage';
import * as fb from 'firebase/app';

import { Router } from '@angular/router';

import { RegisterAndLogin } from './interfaces/registerAndLogin';
import { NewUser } from './interfaces/newUser';
import { User } from './interfaces/user';

import { SwalService } from '../../services/swal.service';
import { NgxSpinnerService } from 'ngx-spinner';

import { getMsgError } from 'src/app/class/error.class';
import { environment } from '../../../environments/environment';

import { BehaviorSubject, Observable, EMPTY, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private user: BehaviorSubject<User> = new BehaviorSubject<User>(null);
  user$ = this.user.asObservable();

  downloadURLimg$: Observable<string>;

  providersID: string[] = ["google.com", "facebook.com"];

  constructor(private angularFireAuth: AngularFireAuth,
    private router: Router,
    private swalService: SwalService,
    private ngxSpinnerService: NgxSpinnerService,
    private angularFirestore: AngularFirestore,
    private storage: AngularFireStorage) {

    this.angularFireAuth.authState.pipe(
      switchMap((userAuth) => {
        if (userAuth) {
          const provider: string = userAuth.providerData[0].providerId;
          if (!(this.providersID.includes(provider))) {
            return this.angularFirestore.collection('users').doc(userAuth.uid).valueChanges()
          } else {
            const user: User = {
              userName: userAuth.displayName,
              uid: userAuth.uid,
              email: userAuth.email,
              photo: userAuth.photoURL,
              provider: provider
            }
            return of(user);
          }
        } else {
          return EMPTY;
        }
      })
    ).subscribe((userAuth: User) => {
      if (userAuth) {
        this.user.next(userAuth);
      }
    });
  }


  async register(user: RegisterAndLogin): Promise<void> {
    let userCredentials: fb.default.auth.UserCredential;
    try {
      await this.ngxSpinnerService.show();
      userCredentials = await this.angularFireAuth.createUserWithEmailAndPassword(user.email, user.password);
      (await this.angularFireAuth.currentUser).sendEmailVerification();

      const writeUser: NewUser = {
        username: user.username,
        newUser: userCredentials
      };

      await this.writeUserData(writeUser);
      this.router.navigate(['/emailverification']);
      await this.ngxSpinnerService.hide();
    } catch (error: any) {
      await this.ngxSpinnerService.hide();
      await userCredentials.user.delete();
      await this.angularFireAuth.signOut();
      this.handleError(error.code);
      throw (error)
    }
  }

  async login(user: RegisterAndLogin): Promise<void> {
    try {
      await this.ngxSpinnerService.show();
      await this.angularFireAuth.signInWithEmailAndPassword(user.email, user.password);
      const currentUser = await this.getcurrentUser();
      if (currentUser.emailVerified) {
        this.router.navigate(['/home']);
      } else {
        this.swalService.mixinSwal('error', 'Verifica tu E-mail para poder iniciar sesi??n.');
        this.signOut();
      }
      await this.ngxSpinnerService.hide();
    } catch (error) {
      await this.ngxSpinnerService.hide();
      this.handleError(error.code);
      throw (error)
    }
  }

  async loginWithGoogle() {
    try {
      await this.ngxSpinnerService.show();
      await this.angularFireAuth.signInWithPopup(new fb.default.auth.GoogleAuthProvider());
      await this.ngxSpinnerService.hide();
      this.router.navigateByUrl('/home');
    } catch (e) {
      this.handleError(e.code, null, 'Google');
      await this.ngxSpinnerService.hide();
    }
  }

  async loginWithFacebook() {
    try {
      await this.ngxSpinnerService.show();
      await this.angularFireAuth.signInWithPopup(new fb.default.auth.FacebookAuthProvider());
      await this.ngxSpinnerService.hide();
      this.router.navigateByUrl('/home');
    } catch (e: any) {
      this.handleError(e.code, e.email, 'Facebook');
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
      this.swalService.mixinSwal('success', 'Se ha reenviado el correo de verificaci??n')
    } catch (e) {
      this.swalService.mixinSwal('info', 'No hay un usuario registrado');
      this.router.navigate(['/login']);
    }
  }

  async resetPassword() {
    try {
      const email = await this.swalService.emailModal();
      if (!email) return;
      await this.ngxSpinnerService.show();
      await this.angularFireAuth.sendPasswordResetEmail(email);
      await this.ngxSpinnerService.hide();
      this.swalService.mixinSwal('success', 'Se ha enviado un correo electronico para que puedas restablecer tu contrase??a.')
    } catch (error) {
      await this.ngxSpinnerService.show();
      this.handleError(error.code);
      await this.ngxSpinnerService.hide();
      throw (error)
    }
  }

  async signOut() {
    await this.angularFireAuth.signOut();
    this.user.next(null);
    this.router.navigateByUrl('/login')
  }

  getcurrentUser() {
    return this.angularFireAuth.currentUser;
  }

  handleError(code: string, args?: any, provider?: string) {
    const msg = getMsgError(code, args, provider);
    this.swalService.alertErrorLogin(msg);
  }

  // Guardar usuario en base de datos
  writeUserData(user: NewUser) {
    return new Promise(async (resolve, reject) => {
      try {
        const newUser = user.newUser.user;
        await this.angularFirestore.collection('users').doc(newUser.uid).set({
          uid: newUser.uid,
          userName: user.username,
          email: newUser.email,
          photo: environment.userPhotoDefault
        });
        resolve(true);
      } catch (error) {
        reject(error)
      }
    })
  }

  async uploadPhotoUser(file: File, uid: string) {

    try {
      await this.ngxSpinnerService.show();
      const filePath = `/photoUsers/${uid}`;
      const fileRef = this.storage.ref(filePath);

      const task = this.storage.upload(filePath, file);

      await task.snapshotChanges().toPromise();
      this.downloadURLimg$ = fileRef.getDownloadURL();
      await this.ngxSpinnerService.hide();
    } catch (error) {
      await this.ngxSpinnerService.hide();
      this.swalService.alertErrorLogin('Ocurri?? un error al actualizar la foto.');
    }
  }

  async updateProfile(userName:string,photo:string,uid:string){
    try {
      await this.ngxSpinnerService.show();
      await this.angularFirestore.collection('users').doc(uid).update({
        userName,
        photo
      });
      await this.ngxSpinnerService.hide();
    } catch (error) {
      this.swalService.alertErrorLogin('No se pudo actualizar los datos');
      await this.ngxSpinnerService.hide();
    }
  }
}
