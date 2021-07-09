import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LazyLoadImgDirective } from './lazy-load-img.directive';



@NgModule({
  declarations: [LazyLoadImgDirective],
  imports: [
    CommonModule
  ],
  exports:[LazyLoadImgDirective]
})
export class DirectivesModule { }
