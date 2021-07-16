import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AngularFireAuthGuard,redirectUnauthorizedTo } from '@angular/fire/auth-guard';
import { PagesComponent } from './pages.component';
import { HeaderRoutes } from '../../interfaces/header-routes';

const headerRoutes:HeaderRoutes[]=[
  {
    name:'Pagina Principal',
    url:'/'
  },
  {
    name:'Inicio',
    url:'/dashboard'
  }
]

const redirectUnauthorizedToLogin = () => redirectUnauthorizedTo(['/login']);
const routes: Routes = [
  {
    path:'dashboard',
    component:PagesComponent,
    canActivate:[AngularFireAuthGuard],
    data:{authGuardPipe:redirectUnauthorizedToLogin,
      headerRoutes
    },
    loadChildren:()=>import('./child-routes.module').then(m=>m.ChildRoutesModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PagesRoutingModule { }
