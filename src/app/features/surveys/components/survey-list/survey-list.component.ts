import { Component } from '@angular/core';
import { Survey } from '../../models/survey.model';
import { SurveyService } from '../../services/survey.service';

@Component({
  selector: 'app-survey-list',
  templateUrl: './survey-list.component.html',
  styleUrls: ['./survey-list.component.scss']
})

export class SurveyListComponent {

constructor( private surveyService : SurveyService){}

options : string[] = ["Estado","Fecha de modificación"];
isFormVisible: boolean = false;
surveys  : Survey[] = [];
selectedSurvey : Survey | null = null;

ngOnInit(): void {
  this.loadSurveys();
}

loadSurveys(): void {
  this.surveyService.getSurveys().subscribe(surveys => {
    this.surveys = surveys;
  });
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
  this.surveyService.deleteSurvey(id).subscribe(() => {
    this.loadSurveys(); 
  });
}

closeForm(): void {
  this.isFormVisible = false;
}

onSurveySaved(): void {
  this.isFormVisible = false;
  this.loadSurveys();
}

}
