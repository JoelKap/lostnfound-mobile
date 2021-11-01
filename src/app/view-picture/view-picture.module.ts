import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ViewPicturePageRoutingModule } from './view-picture-routing.module';

import { ViewPicturePage } from './view-picture.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ViewPicturePageRoutingModule
  ],
  declarations: [ViewPicturePage]
})
export class ViewPicturePageModule {}
