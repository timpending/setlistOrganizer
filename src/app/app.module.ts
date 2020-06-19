import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AngularFireModule } from '@angular/fire';
import { AngularFireAnalyticsModule } from '@angular/fire/analytics';
import { AngularFirestoreModule } from '@angular/fire/firestore';

import { environment } from '../environments/environment';


const firebaseConfig = {
  apiKey: "AIzaSyDmiTpkVDqE-h90wliYkoG9oJtOLu4S-Rw",
  authDomain: "ng-tea-shop.firebaseapp.com",
  databaseURL: "https://ng-tea-shop.firebaseio.com",
  projectId: "ng-tea-shop",
  storageBucket: "ng-tea-shop.appspot.com",
  messagingSenderId: "295192380434",
  appId: "1:295192380434:web:60643d3c7b9a21ca9c44cb"
};

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFireAnalyticsModule,
    AngularFirestoreModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
