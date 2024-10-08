import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SurveyListComponent } from './components/survey-list/survey-list.component';
import { SurveyFormComponent } from './components/survey-form/survey-form.component';
import { SurveysRoutingModule } from './surveys-routing.module';
import { SurveyService } from './services/survey.service';
import { SharedModule } from 'src/app/shared/shared.module';
import { MatIconModule } from '@angular/material/icon';
import { ReactiveFormsModule } from '@angular/forms';
import { ToastrModule } from 'ngx-toastr';
import { FormsModule } from '@angular/forms';
import { InfoWindowComponent } from './components/info-window/info-window.component';



@NgModule({
  declarations: [
    SurveyListComponent,
    SurveyFormComponent,
    InfoWindowComponent,
  ],
  imports: [
    CommonModule,
    SurveysRoutingModule,
    SharedModule,
    MatIconModule,
    ReactiveFormsModule,
    ToastrModule.forRoot({
      timeOut: 1700, // Duración de la notificación
      positionClass: 'toast-top-right', // Posición de la notificación
      preventDuplicates: true, // Evita notificaciones duplicadas
      closeButton: true, // Mostrar botón de cierre
    }),
    FormsModule,
  ],
  providers: [
    SurveyService
  ]
})
export class SurveysModule { }
