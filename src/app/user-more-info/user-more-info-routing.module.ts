import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { UserMoreInfoPage } from './user-more-info.page';

const routes: Routes = [
  {
    path: '',
    component: UserMoreInfoPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UserMoreInfoPageRoutingModule {}
