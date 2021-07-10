import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';

import { AuthService } from '../core/auth/auth.service'
@Injectable({
  providedIn: 'root'
})
export class VerifyEmailGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {

  }
  async canActivate() {
    const currentUser = await this.authService.getcurrentUser();
    if (currentUser) {
      if (!currentUser.emailVerified) {
        return true;
      } else {
        this.redirect();
        return false;
      }
    } else {
      this.redirect();
      return false;
    }
  }

  redirect() {
    this.router.navigate(['/login']);
  }

}
