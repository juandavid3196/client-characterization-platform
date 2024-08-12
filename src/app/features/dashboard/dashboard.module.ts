import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DashboardRoutingModule } from './dashboard-routing.module';
import { DashboardMainComponent } from './components/dashboard-main/dashboard-main.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { MatIconModule } from '@angular/material/icon';
import { QuestionsOptionsComponent } from './components/questions-options/questions-options.component';
import { CheckboxQuestionComponent } from './components/checkbox-question/checkbox-question.component';
import { ReactiveFormsModule } from '@angular/forms';
import { TableQuestionComponent } from './components/table-question/table-question.component';
import { DataBankComponent } from './components/data-bank/data-bank.component';
import { SettingComponent } from './components/setting/setting.component';
import { TruncatePipe } from './pipes/truncate.pipe';
import { PreviewComponent } from './components/preview/preview.component';
import { ScaleQuestionComponent } from './components/scale-question/scale-question.component';
import { YesNoQuestionComponent } from './components/yes-no-question/yes-no-question.component';
import { AnswerMenuComponent } from './components/answer-menu/answer-menu.component';
import { OpenQuestionComponent } from './components/open-question/open-question.component';



@NgModule({
  declarations: [
    DashboardMainComponent,
    QuestionsOptionsComponent,
    CheckboxQuestionComponent,
    TableQuestionComponent,
    DataBankComponent,
    SettingComponent,
    TruncatePipe,
    PreviewComponent,
    ScaleQuestionComponent,
    YesNoQuestionComponent,
    AnswerMenuComponent,
    OpenQuestionComponent,
  
  ],
  imports: [
    CommonModule,
    SharedModule,
    MatIconModule,
    DashboardRoutingModule,
   ReactiveFormsModule,
   FormsModule
  ]
})
export class DashboardModule { }
