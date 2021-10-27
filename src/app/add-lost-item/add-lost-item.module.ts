import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AddLostItemPageRoutingModule } from './add-lost-item-routing.module';

import { AddLostItemPage } from './add-lost-item.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    AddLostItemPageRoutingModule
  ],
  declarations: [AddLostItemPage]
})
export class AddLostItemPageModule {}
