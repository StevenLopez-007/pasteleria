import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppRoutingRoutingModule } from './app-routing-routing.module';
import { ComponentsModule } from './core/components/components.module';
import { AuthModule } from './core/auth/auth.module';
import {AngularFireAuthModule} from '@angular/fire/auth';
import {AngularFireModule} from '@angular/fire';
import {AngularFirestoreModule} from '@angular/fire/firestore';
import { AngularFireStorageModule,BUCKET } from '@angular/fire/storage';
import { AppComponent } from './app.component';
import { PagesModule } from './core/pages/pages.module';
import { environment } from '../environments/environment';
import { NgxSpinnerModule } from 'ngx-spinner';
import { PhotoUrlPipe } from './pipes/photo-url.pipe';


@NgModule({
  declarations: [
    AppComponent,
    PhotoUrlPipe
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    NgxSpinnerModule,

    AppRoutingRoutingModule,

    AngularFireModule.initializeApp(environment.firebase),
    AngularFirestoreModule,
    AngularFireAuthModule,
    AngularFireStorageModule,

    ComponentsModule,
    AuthModule,
    PagesModule
  ],
  providers: [{provide:BUCKET,useValue:'cupcakesweet'}],
  bootstrap: [AppComponent]
})
export class AppModule { }
