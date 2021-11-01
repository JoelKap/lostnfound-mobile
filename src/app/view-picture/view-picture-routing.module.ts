import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ViewPicturePage } from './view-picture.page';

const routes: Routes = [
  {
    path: '',
    component: ViewPicturePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ViewPicturePageRoutingModule {}
