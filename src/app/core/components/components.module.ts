import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { LandscapeComponent } from './landscape/landscape.component';
import { RouterModule } from '@angular/router';
import { UserInfoComponent } from './header/user-info/user-info.component';
import { UserInfoSideBarComponent } from './header/user-info-side-bar/user-info-side-bar.component';
import { ModalComponent } from './modal/modal.component';
import { ImageCropperComponent } from './image-cropper/image-cropper.component';
import { NgxSpinnerModule } from 'ngx-spinner';



@NgModule({
  declarations: [
    HeaderComponent,
    FooterComponent,
    LandscapeComponent,
    UserInfoComponent,
    UserInfoSideBarComponent,
    ModalComponent,
    ImageCropperComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    NgxSpinnerModule
  ],
  exports:[
    HeaderComponent,
    FooterComponent,
    LandscapeComponent,
    UserInfoComponent,
    UserInfoSideBarComponent,
    ModalComponent,
    ImageCropperComponent
  ]
})
export class ComponentsModule { }
