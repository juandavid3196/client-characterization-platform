import { Component } from '@angular/core';
import { Survey } from '../../models/survey.model';
import { SurveyService } from '../../services/survey.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { DashboardlsService } from 'src/app/features/dashboard/services/dashboardls.service';
import { EventBusService } from 'src/app/core/services/eventBus.service';
import { format } from 'date-fns';
import { Clipboard } from '@angular/cdk/clipboard';


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
  private dashboardlsService : DashboardlsService,
  private eventBusService: EventBusService,
  private clipboard: Clipboard
){}

states : string[] =["Creada","Editada","Publicada","Todas"];
modificationDate : string[] = ["Más Reciente", "Más Antiguo"];
isFormVisible: boolean = false;
surveys  : Survey[] = [];
filteredSurveys: Survey[] = [];
selectedSurvey : Survey | null = null;
searchTerm : string = '';
infoWindow : boolean = false;

ngOnInit(): void {
  this.loadSurveys();
  this.eventBusService.event$.subscribe(event => {
    if (event.eventName === 'dashboardDataSaved') {
      window.location.reload();
    }
  });
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
  if(survey.state === 'Publicada') return;
  if (survey) {
    localStorage.setItem('survey', JSON.stringify(survey));
    this.dashboardlsService.saveDashboardOptions(survey.questions);
    this.router.navigate(['/dashboard']);
  }
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

copyUrlSurvey(survey:any) : void {
 if(survey.state !== 'Publicada'){
  return
 }
 this.clipboard.copy(`${'http://localhost:4200'}/${'userpanel'}/id:${survey.id}`);
 this.toastr.success("Url copiada");
}

closeForm(): void {
    this.isFormVisible = false;
}

onSurveySaved(): void {
  this.loadSurveys();
}

openInfoWindow(element:Survey | null) : void {
  this.infoWindow = !this.infoWindow;
  this.selectedSurvey = element;
}


formatDate(): string {
  const date = new Date();
  return format(date, 'dd/MM/yyyy');
}

async cloneSurvey(survey: Survey) : Promise<void> {
  survey.title =  survey.title + ' - copia';
  survey.updated_date =  this.formatDate();
  survey.state = 'Editada';
  const response: any = await this.surveyService.createSurvey(survey).toPromise();
  if(response.survey){
      this.toastr.success('Encusta clonada con exito');
      this.loadSurveys();
    }

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
    case 'Publicada': 
      color = '#128524';
      background = '#ACFFBA';
    break;
    case 'Editada': 
      color = '#898C08';
      background = '#F3FFAC';
    break;
    case 'Creada': 
      color = '#666666';
      background= "#E4E4E4";
    break;
  }

  if(type === 'color') {
    return color;
  }else{
    return background;
  }
}


}
