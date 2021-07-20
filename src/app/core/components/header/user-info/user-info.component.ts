import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
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
  showLoadImg:boolean=true;

  constructor(private authService: AuthService) { }

  ngOnInit(): void {
    this.user = this.authService.user$;
  }

  async signOut(){
    await this.authService.signOut();
  }

  onLoadImg(userPhoto:HTMLImageElement,loadingImg:HTMLDivElement){
    loadingImg.classList.add('d-none');
    userPhoto.classList.remove('d-none');
  }


}
