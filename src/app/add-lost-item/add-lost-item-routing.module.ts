import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AddLostItemPage } from './add-lost-item.page';

const routes: Routes = [
  {
    path: '',
    component: AddLostItemPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AddLostItemPageRoutingModule {}
