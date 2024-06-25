import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DashboardRoutingModule } from './dashboard-routing.module';
import { DashboardMainComponent } from './components/dashboard-main/dashboard-main.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { MatIconModule } from '@angular/material/icon';



@NgModule({
  declarations: [
    DashboardMainComponent,
  ],
  imports: [
    CommonModule,
    SharedModule,
    MatIconModule,
    DashboardRoutingModule
  ]
})
export class DashboardModule { }
