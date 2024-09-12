import { Component, Input } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Survey } from 'src/app/features/surveys/models/survey.model';
import { SurveyService } from 'src/app/features/surveys/services/survey.service';

@Component({
  selector: 'app-survey-table',
  templateUrl: './survey-table.component.html',
  styleUrls: ['./survey-table.component.scss']
})
export class SurveyTableComponent {

  surveys  : Survey[] = [];
  filteredSurveys: Survey[] = [];

  constructor( 
    private surveyService : SurveyService, 
    private toastr: ToastrService){}
    @Input() filteredWord : string = '';

  ngOnInit(): void {
    this.loadSurveys();
  }
  
   
  loadSurveys(): void {
    this.surveyService.getSurveys().subscribe(surveys => {
      this.surveys = surveys;
      this.filteredSurveys =surveys;
    });
  }

  filterSurveys(): void {
    this.filteredSurveys = this.surveys.filter(event => event.title.toLowerCase().includes(this.filteredWord.toLowerCase()));
  }
  
  deleteSurvey(id: string): void {
    if(window.confirm("¿Desea eliminar la encuesta?")){
      this.surveyService.deleteSurvey(id).subscribe(() => {
        this.loadSurveys(); 
        });
      this.toastr.success("Encuesta Eliminada con Exito");
    }else{
      return;
    }
  }

}
