import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminpanelComponent } from './components/adminpanel/adminpanel.component';
import { AdminpanelRoutingModule } from './adminpanel-routing.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { MatIconModule } from '@angular/material/icon';
import { SurveyTableComponent } from './components/survey-table/survey-table.component';
import { UserTableComponent } from './components/user-table/user-table.component';



@NgModule({
  declarations: [
    AdminpanelComponent,
    SurveyTableComponent,
    UserTableComponent,
  ],
  imports: [
    AdminpanelRoutingModule,
    SharedModule,
    MatIconModule,
    CommonModule
  ]
})
export class AdminpanelModule { }
