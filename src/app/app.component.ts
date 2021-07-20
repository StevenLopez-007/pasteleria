import { Component, HostListener, OnInit } from '@angular/core';
import { OrientationScreenService } from './services/orientation-screen.service';
import { RoutesService } from './services/routes.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  orientation:string;
  constructor(private orientationScreenService: OrientationScreenService,private routesService: RoutesService) {}

  ngOnInit(){
    this.orientationScreenService.orientation$.subscribe((orientacion:any)=>{
      this.orientation = orientacion;
    });
    this.initRouteConfig();
  }

  @HostListener('window:resize')
  changeOrientation():void{
    this.orientationScreenService.detectOrientacion();
  }
  initRouteConfig(): void {
    this.routesService.initRouteConfig();
  }
}
