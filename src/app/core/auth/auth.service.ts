import { Injectable, NgZone } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFireStorage } from '@angular/fire/storage';
import { Router } from '@angular/router';
import { RegisterAndLogin } from './interfaces/registerAndLogin';
import { SwalService } from '../../services/swal.service';
import * as fb from 'firebase/app';
import { getMsgError } from 'src/app/class/error.class';
import { NgxSpinnerService } from 'ngx-spinner';
import { User } from './interfaces/user';
import { environment } from '../../../environments/environment';
import { BehaviorSubject, Observable, EMPTY, of } from 'rxjs';
import { AngularFirestore } from '@angular/fire/firestore';
import { NewUser } from './interfaces/newUser';
import { finalize, switchMap, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private user: BehaviorSubject<User> = new BehaviorSubject<User>(null);
  user$ = this.user.asObservable();

  providersID:string[]=["google.com","facebook.com"];

  constructor(private angularFireAuth: AngularFireAuth,
    private router: Router,
    private swalService: SwalService,
    private ngxSpinnerService: NgxSpinnerService,
    private angularFirestore: AngularFirestore,
    private storage: AngularFireStorage) {

    this.angularFireAuth.authState.pipe(
      switchMap((userAuth)=>{
        if(userAuth){
          if(!(this.providersID.includes(userAuth.providerData[0].providerId))){
            return this.angularFirestore.collection('users').doc(userAuth.uid).valueChanges()
          }else{
            const user:User={
              userName:userAuth.displayName,
              uid:userAuth.uid,
              email:userAuth.email,
              photo:userAuth.photoURL
            }
            return of(user);
          }
        }else{
          return EMPTY;
        }
      })
    ).subscribe((userAuth:User) => {
      if (userAuth) {
        this.user.next(userAuth);
      }
    });
  }


  async register(user: RegisterAndLogin): Promise<void> {
    try {
      await this.ngxSpinnerService.show();
      const userCredentials = await this.angularFireAuth.createUserWithEmailAndPassword(user.email, user.password);
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
        this.swalService.mixinSwal('error', 'Verifica tu E-mail para poder iniciar sesión.');
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
      this.swalService.mixinSwal('success', 'Se ha reenviado el correo de verificación')
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
      this.swalService.mixinSwal('success', 'Se ha enviado un correo electronico para que puedas restablecer tu contraseña.')
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

  updatePhotoUser(file: File, uid: string) {
    return new Promise((resolve, reject) => {
      try {
        const filePath = `/photoUsers/${uid}`;
        const fileRef = this.storage.ref(filePath);

        const task = this.storage.upload(filePath, file);
        let downloadUrl: Observable<string>;
        task.snapshotChanges().pipe(
          finalize(() => downloadUrl = fileRef.getDownloadURL())
        ).subscribe();
        resolve(downloadUrl);
      } catch (error) {
        reject(error);
      }
    });
  }
}
