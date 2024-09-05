import { Component } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { userSurvey } from '../../models/user-survey.model';
import { Router } from '@angular/router';
import { format } from 'date-fns';
import { UserSurveyService } from '../../services/user-survey.service';

@Component({
  selector: 'app-user-surveys',
  templateUrl: './user-surveys.component.html',
  styleUrls: ['./user-surveys.component.scss']
})
export class UserSurveysComponent {

  constructor( 
    private toastr: ToastrService,
    private router: Router,
    private userSurveyService : UserSurveyService,
  ){}
  
  states : string[] = ["Finalizada","Sin Resolver","En Progreso","Cancelada","Todas",];
  modificationDate : string[] = ["Más Reciente", "Más Antiguo"];
  isFormVisible: boolean = false;
  surveys  : userSurvey[] = [];
  filteredSurveys: userSurvey[] = [];
  selectedSurvey : userSurvey | null = null;
  searchTerm : string = '';
  
  ngOnInit(): void {
    this.loadSurveys();
  }
  
   
  loadSurveys(): void {
    this.userSurveyService.getSurveys().subscribe(surveys => {
      this.surveys = surveys;
      this.filteredSurveys =surveys;
    });
  }
  
  filterSurveys(): void {
    this.filteredSurveys = this.surveys.filter(event => event.title.toLowerCase().includes(this.searchTerm.toLowerCase()));
  }
  
  
  formatDate(): string {
    const date = new Date();
    return format(date, 'dd/MM/yyyy');
  }
  
  filterByState(state:string): void {
    if(state === "Todas"){
      this.filteredSurveys = this.surveys;
    }else{
      this.filteredSurveys =  this.surveys.filter(item => item.state === state);
    }
  }
  
  filterByDate(range: string): void {
    if (range === "Más Reciente") {
      this.filteredSurveys = this.surveys.sort((a, b) => {
        return new Date(b.date_creation).getTime() - new Date(a.date_creation).getTime();
      });
    } else if (range === "Más Antiguo") {
      this.filteredSurveys = this.surveys.sort((a, b) => {
        return new Date(a.date_creation).getTime() - new Date(b.date_creation).getTime();
      });
    }
  }
  
  surveyColor(state:string, type:string) : string {
    let color = '';
    let background = '';
    switch(state){
      case 'Finalizada': 
        color = '#128524';
        background = '#ACFFBA';
      break;
      case 'Cancelada': 
        color = '#898C08';
        background = '#F3FFAC';
      break;
      case 'Sin Resolver': 
        color = '#666666';
        background= "#E4E4E4";
      break;
      case 'En Progreso': 
        color = '#898C08';
        background= "#F3FFAC";
      break;
    }
  
    if(type === 'color') {
      return color;
    }else{
      return background;
    }
  }

  viewResults(survey: any) : void {
  }

  solveSurvey(survey:any) : void {
    this.router.navigate(['/userpanel', survey.id]);
  }

}
