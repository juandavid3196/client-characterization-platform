import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserSurveysComponent } from './components/user-surveys/user-surveys.component';
import { UserSurveyRoutingModule } from './user-survey-routing.module';
import { MatIconModule } from '@angular/material/icon';
import { SharedModule } from "../../shared/shared.module";
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SurveyTestComponent } from './components/survey-test/survey-test.component';



@NgModule({
  declarations: [
    UserSurveysComponent,
    SurveyTestComponent
  ],
  imports: [
    MatIconModule,
    UserSurveyRoutingModule,
    CommonModule,
    SharedModule,
    ReactiveFormsModule,
    FormsModule,
]
})
export class UserSurveyModule { }
