import { Component } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { userSurvey } from '../../models/user-survey.model';
import { Router } from '@angular/router';
import { format } from 'date-fns';
import { UserSurveyService } from '../../services/user-survey.service';
import { Survey } from '../../models/survey.model';
import { SurveyService } from 'src/app/features/surveys/services/survey.service';

@Component({
  selector: 'app-user-surveys',
  templateUrl: './user-surveys.component.html',
  styleUrls: ['./user-surveys.component.scss'],
})
export class UserSurveysComponent {
  constructor(
    private toastr: ToastrService,
    private router: Router,
    private userSurveyService: UserSurveyService,
    private surveyService: SurveyService
  ) {}

  states: string[] = [
    'Finalizada',
    'Sin Resolver',
    'En Progreso',
    'Cancelada',
    'Suspendida',
    'Todas',
  ];

  modificationDate: string[] = ['Más Reciente', 'Más Antiguo'];
  isFormVisible: boolean = false;
  surveys: userSurvey[] = [];
  filteredSurveys: userSurvey[] = [];
  selectedSurvey: userSurvey | null = null;
  searchTerm: string = '';
  infoWindow: boolean = false;

  ngOnInit(): void {
    this.loadSurveys();
  }

  loadSurveys(): void {
    this.userSurveyService.getSurveys().subscribe((surveys) => {
      this.surveys = surveys;
      this.filteredSurveys = surveys;
    });
  }

  filterSurveys(): void {
    this.filteredSurveys = this.surveys.filter((event) =>
      event.title.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }

  formatDate(): string {
    const date = new Date();
    return format(date, 'dd/MM/yyyy');
  }

  filterByState(state: string): void {
    if (state === 'Todas') {
      this.filteredSurveys = this.surveys;
    } else {
      this.filteredSurveys = this.surveys.filter(
        (item) => item.state === state
      );
    }
  }

  filterByDate(range: string): void {
    if (range === 'Más Reciente') {
      this.filteredSurveys = this.surveys.sort((a, b) => {
        return (
          new Date(b.date_creation).getTime() -
          new Date(a.date_creation).getTime()
        );
      });
    } else if (range === 'Más Antiguo') {
      this.filteredSurveys = this.surveys.sort((a, b) => {
        return (
          new Date(a.date_creation).getTime() -
          new Date(b.date_creation).getTime()
        );
      });
    }
  }

  surveyColor(state: string, type: string): string {
    let color = '';
    let background = '';
    switch (state) {
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
        background = '#E4E4E4';
        break;
      case 'En Progreso':
        color = '#898C08';
        background = '#F3FFAC';
        break;
      case 'Suspendida':
        color = 'rgb(117 1 112)';
        background = 'rgb(236 148 255)';
        break;
    }

    if (type === 'color') {
      return color;
    } else {
      return background;
    }
  }

  viewResults(survey: any): void {}

  getSurveyLength(questions: any): number {
    if (questions) {
      let count = 0;
      for (let index = 0; index < questions.length; index++) {
        if (questions[index].type !== 'section') {
          count += 1;
        }
      }
      return count;
    }
    return 0;
  }

  async solveSurvey(activeSurvey: any): Promise<void> {
    try {
      const survey: any = await this.surveyService
        .getSurveyById(activeSurvey.id)
        .toPromise();
      if (survey) {
        if (survey.state === 'Suspendida' || survey.state === 'Cerrada') {
          const updateBody = {
            state: survey.state,
          };
          const response = await this.userSurveyService
            .updateSurvey(survey.id, updateBody)
            .toPromise();
          if (response) {
            window.location.reload();
          }
        } else {
          this.router.navigate(['/userpanel', survey.id]);
        }
      }
    } catch (error) {
      console.log(error);
    }
  }

  openInfoWindow(element: userSurvey | null): void {
    this.infoWindow = !this.infoWindow;
    this.selectedSurvey = element;
    console.log(element);
  }
}
