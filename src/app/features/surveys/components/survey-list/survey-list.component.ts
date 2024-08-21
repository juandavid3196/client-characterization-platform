import { Component } from '@angular/core';
import { Survey } from '../../models/survey.model';
import { SurveyService } from '../../services/survey.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { DashboardlsService } from 'src/app/features/dashboard/services/dashboardls.service';

@Component({
  selector: 'app-survey-list',
  templateUrl: './survey-list.component.html',
  styleUrls: ['./survey-list.component.scss']
})

export class SurveyListComponent {

constructor( 
  private surveyService : SurveyService, 
  private toastr: ToastrService,
  private router: Router,
  private dashboardlsService : DashboardlsService
){}

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

editSurvey(survey: Survey): void {
  if (survey) {
    localStorage.setItem('survey', JSON.stringify(survey));
    this.dashboardlsService.saveDashboardOptions(survey.questions);
    this.router.navigate(['/dashboard']);
  }
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
