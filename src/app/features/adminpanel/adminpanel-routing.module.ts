import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminpanelComponent } from './components/adminpanel/adminpanel.component';

const routes: Routes = [
  { path: '', component:AdminpanelComponent  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminpanelRoutingModule { }