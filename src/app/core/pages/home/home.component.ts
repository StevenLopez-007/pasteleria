import { environment } from 'src/environments/environment';
import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../auth/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  constructor(private authService: AuthService,private router: Router) { }

  ngOnInit(): void {
    document.title = `${environment.name} - Inicio`
  }

  async logOut(){
    await this.authService.signOut();
    this.router.navigateByUrl('/login')
  }
}
