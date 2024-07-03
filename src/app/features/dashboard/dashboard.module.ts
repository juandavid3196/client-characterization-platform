import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DashboardRoutingModule } from './dashboard-routing.module';
import { DashboardMainComponent } from './components/dashboard-main/dashboard-main.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { MatIconModule } from '@angular/material/icon';
import { QuestionsOptionsComponent } from './components/questions-options/questions-options.component';
import { CheckboxQuestionComponent } from './components/checkbox-question/checkbox-question.component';
import { ReactiveFormsModule } from '@angular/forms';
import { CheckboxQuestionViewComponent } from './components/checkbox-question-view/checkbox-question-view.component';



@NgModule({
  declarations: [
    DashboardMainComponent,
    QuestionsOptionsComponent,
    CheckboxQuestionComponent,
    CheckboxQuestionViewComponent,
  ],
  imports: [
    CommonModule,
    SharedModule,
    MatIconModule,
    DashboardRoutingModule,
   ReactiveFormsModule
  ]
})
export class DashboardModule { }
