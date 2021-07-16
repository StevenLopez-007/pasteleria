import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { LandscapeComponent } from './landscape/landscape.component';
import { RouterModule } from '@angular/router';
import { UserInfoComponent } from './user-info/user-info.component';



@NgModule({
  declarations: [HeaderComponent, FooterComponent, LandscapeComponent, UserInfoComponent],
  imports: [
    CommonModule,
    RouterModule
  ],
  exports:[HeaderComponent,FooterComponent,LandscapeComponent,UserInfoComponent]
})
export class ComponentsModule { }
