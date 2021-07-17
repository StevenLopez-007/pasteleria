import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthService } from '../../../auth/auth.service';
import { User } from '../../../auth/interfaces/user';

@Component({
  selector: 'app-user-info-side-bar',
  templateUrl: './user-info-side-bar.component.html',
  styleUrls: ['./user-info-side-bar.component.css']
})
export class UserInfoSideBarComponent implements OnInit {

  user:Observable<User>;

  constructor(private authService: AuthService) { }

  ngOnInit(): void {
    this.user = this.authService.user$;
    this.authService.user$.subscribe((resp)=>console.log)
  }

  async signOut(){
    await this.authService.signOut();
  }

}
