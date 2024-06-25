import { Component } from '@angular/core';
import { Survey } from '../../models/survey.model';
import { SurveyService } from '../../services/survey.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-survey-list',
  templateUrl: './survey-list.component.html',
  styleUrls: ['./survey-list.component.scss']
})

export class SurveyListComponent {

constructor( 
  private surveyService : SurveyService, 
  private toastr: ToastrService){}

options : string[] = ["Estado","Fecha de modificación"];
isFormVisible: boolean = false;
surveys  : Survey[] = [];
filteredSurveys: Survey[] = [];
selectedSurvey : Survey | null = null;
searchTerm : string = '';

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
  this.filteredSurveys = this.surveys.filter(event => event.title.toLowerCase().includes(this.searchTerm.toLowerCase()));
}

openCreateSurveyForm(): void {
  this.selectedSurvey = null;
  this.isFormVisible = true;
}

openEditSurveyForm(survey: Survey): void {
  this.selectedSurvey = survey;
  this.isFormVisible = true;
}

deleteSurvey(id: number): void {
  if(window.confirm("¿Desea eliminar la encuesta?")){
    this.surveyService.deleteSurvey(id).subscribe(() => {
      this.loadSurveys(); 
      });
    this.toastr.success("Encuesta Eliminada con Exito");
  }else{
    return;
  }
}

closeForm(): void {
    this.isFormVisible = false;
}

onSurveySaved(): void {
  this.loadSurveys();
}

}
