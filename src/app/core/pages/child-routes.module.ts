import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { EditProfileComponent } from './edit-profile/edit-profile.component';
import { EditProfileGuard } from '../../guards/edit-profile.guard';

const routes: Routes = [
  {
    path:'',
    component:HomeComponent
  },
  {
    path:'edit-profile',
    canActivate:[EditProfileGuard],
    component:EditProfileComponent
  },
  {
    path:'**',
    redirectTo:'/',
    pathMatch:'full'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)]
})
export class ChildRoutesModule { }
