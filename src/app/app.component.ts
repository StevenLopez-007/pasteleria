import { Component, HostListener, OnInit } from '@angular/core';
import { OrientationScreenService } from './services/orientation-screen.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  orientation:string;
  constructor(private orientationScreenService: OrientationScreenService) {}

  ngOnInit(){
    this.orientationScreenService.orientation$.subscribe((orientacion:any)=>{
      // console.log(orientacion)
      this.orientation = orientacion;
    });
  }

  @HostListener('window:resize')
  changeOrientation():void{
    this.orientationScreenService.detectOrientacion();
  }
}
