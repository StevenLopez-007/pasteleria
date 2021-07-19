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
    url:'/home'
  }
]

const redirectUnauthorizedToLogin = () => redirectUnauthorizedTo(['/login']);
const routes: Routes = [
  {
    path:'home',
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
