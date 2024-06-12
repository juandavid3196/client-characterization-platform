import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SurveyListComponent } from './components/survey-list/survey-list.component';
import { SurveyFormComponent } from './components/survey-form/survey-form.component';
import { SurveysRoutingModule } from './surveys-routing.module';
import { SurveyService } from './services/survey.service';
import { SharedModule } from 'src/app/shared/shared.module';
import { MatIconModule } from '@angular/material/icon';
import { ReactiveFormsModule } from '@angular/forms';



@NgModule({
  declarations: [
    SurveyListComponent,
    SurveyFormComponent,
  ],
  imports: [
    CommonModule,
    SurveysRoutingModule,
    SharedModule,
    MatIconModule,
    ReactiveFormsModule
  ],
  providers: [
    SurveyService
  ]
})
export class SurveysModule { }
