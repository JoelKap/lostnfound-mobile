import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { UserMoreInfoPageRoutingModule } from './user-more-info-routing.module';

import { UserMoreInfoPage } from './user-more-info.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    UserMoreInfoPageRoutingModule
  ],
  declarations: [UserMoreInfoPage]
})
export class UserMoreInfoPageModule {}
