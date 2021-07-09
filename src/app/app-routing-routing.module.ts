import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthRoutingModule } from './core/auth/auth-routing.module';

const routes: Routes = [
  {path:'',loadChildren:()=>import('../app/core/landing-page/landing-page.module').then(m=>m.LandingPageModule)},
  {path:'**',redirectTo:'',pathMatch:'full'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes),AuthRoutingModule],
  exports: [RouterModule]
})
export class AppRoutingRoutingModule { }
