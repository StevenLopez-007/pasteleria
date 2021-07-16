import { LandingPageComponent } from './landing-page.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HeaderRoutes } from '../../interfaces/header-routes';

const headerRoutes:HeaderRoutes[]=[
  {
    name:'Inicio',
    url:'/login'
  },
  {
    name:'Inicio de sesión',
    url:'/login'
  }
]

const routes: Routes = [
  {path:'',
  component:LandingPageComponent,
  data:{
    headerRoutes
  }
}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports:[RouterModule]
})
export class LandingPageRoutingModule { }
