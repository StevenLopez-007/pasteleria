import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LandingPageRoutingModule } from './landing-page-routing.module';
import { LandingPageComponent } from './landing-page.component';
import { ComponentsModule } from '../components/components.module';
import { SwiperModule } from 'swiper/angular';
import { DirectivesModule } from '../../directives/directives.module';

@NgModule({
  declarations: [LandingPageComponent],
  imports: [
    CommonModule,
    LandingPageRoutingModule,
    ComponentsModule,
    SwiperModule,
    DirectivesModule
  ]
})
export class LandingPageModule { }
