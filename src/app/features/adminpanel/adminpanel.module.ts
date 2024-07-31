import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminpanelComponent } from './components/adminpanel/adminpanel.component';
import { AdminpanelRoutingModule } from './adminpanel-routing.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { MatIconModule } from '@angular/material/icon';



@NgModule({
  declarations: [
    AdminpanelComponent,
  ],
  imports: [
    AdminpanelRoutingModule,
    SharedModule,
    MatIconModule,
    CommonModule
  ]
})
export class AdminpanelModule { }
