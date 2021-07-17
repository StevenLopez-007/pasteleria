import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../auth/auth.service';
import { User } from '../../../auth/interfaces/user';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-user-info',
  templateUrl: './user-info.component.html',
  styleUrls: ['./user-info.component.css']
})
export class UserInfoComponent implements OnInit {

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
