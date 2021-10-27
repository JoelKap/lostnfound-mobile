import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

// import firebase + enviornment
import { environment } from '../environments/environment';


import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AngularFireModule } from '@angular/fire/compat';
import { AngularFirestoreModule } from '@angular/fire/compat/firestore';
import { AngularFireStorageModule } from '@angular/fire/compat/storage';
import { PreviewAnyFile } from '@ionic-native/preview-any-file/ngx';


@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [
    BrowserModule, 
    IonicModule.forRoot(), 
    AppRoutingModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFirestoreModule,
    Ng2SearchPipeModule,
    FormsModule,
    ReactiveFormsModule,
    AngularFireStorageModule,
  ],
  providers: [
    { provide: RouteReuseStrategy, 
      useClass: IonicRouteStrategy 
    },PreviewAnyFile
    ],
  bootstrap: [AppComponent],
})
export class AppModule {}
