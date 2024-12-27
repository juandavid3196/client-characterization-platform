import { Component } from '@angular/core';
import { Survey } from '../../models/survey.model';
import { SurveyService } from '../../services/survey.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { DashboardlsService } from 'src/app/features/dashboard/services/dashboardls.service';
import { EventBusService } from 'src/app/core/services/eventBus.service';
import { format } from 'date-fns';
import { Clipboard } from '@angular/cdk/clipboard';
import { v4 as uuidv4 } from 'uuid';
import Swal from 'sweetalert2';
import { UserSurveyService } from 'src/app/features/usersurvey/services/user-survey.service';

@Component({
  selector: 'app-survey-list',
  templateUrl: './survey-list.component.html',
  styleUrls: ['./survey-list.component.scss'],
})
export class SurveyListComponent {
  constructor(
    private surveyService: SurveyService,
    private userSurveyService: UserSurveyService,
    private toastr: ToastrService,
    private router: Router,
    private dashboardlsService: DashboardlsService,
    private eventBusService: EventBusService,
    private clipboard: Clipboard
  ) {}

  states: string[] = ['Creada', 'Editada', 'Activa', 'Todas'];
  modificationDate: string[] = ['Más Reciente', 'Más Antiguo'];
  isFormVisible: boolean = false;
  surveys: Survey[] = [];
  filteredSurveys: Survey[] = [];
  selectedSurvey: Survey | null = null;
  searchTerm: string = '';
  infoWindow: boolean = false;
  isLoading: boolean = false;

  ngOnInit(): void {
    this.loadSurveys();
    this.eventBusService.event$.subscribe((event) => {
      if (event.eventName === 'dashboardDataSaved') {
        window.location.reload();
      }
    });
  }

  loadSurveys(): void {
    this.surveyService.getSurveys().subscribe((surveys) => {
      this.surveys = surveys;
      this.filteredSurveys = surveys.filter(
        (survey) => survey.state !== 'Cerrada'
      );
      this.closeSurveyByDeadline();
    });
  }

  filterSurveys(): void {
    this.filteredSurveys = this.surveys.filter((event) =>
      event.title.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }

  checkDeadline(survey: any): boolean {
    const currentDate = new Date();
    const deadline = new Date(survey.deadline);
    return currentDate.getTime() >= deadline.getTime();
  }

  closeSurveyByDeadline(): void {
    this.filteredSurveys.forEach((element) => {
      if (this.checkDeadline(element)) {
        this.surveyService
          .updateSurvey(element.id, { state: 'Cerrada' })
          .subscribe((response) => {
            if (response) {
              Swal.fire({
                title: 'Encuesta Cerrada',
                text: 'La encuesta ha sido cerrada.',
                icon: 'info',
              });
            }
          });
      }
    });
  }

  openCreateSurveyForm(): void {
    this.selectedSurvey = null;
    this.isFormVisible = true;
  }

  editSurvey(survey: Survey): void {
    if (survey.state === 'Activa') return;
    if (survey) {
      localStorage.setItem('survey', JSON.stringify(survey));
      this.dashboardlsService.saveDashboardOptions(survey.questions);
      this.router.navigate(['/dashboard']);
    }
  }

  onStopSurvey(survey: Survey): void {
    Swal.fire({
      title: '¿Esta seguro?',
      text: 'La encuesta permeanecera inactiva indefinidamente',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      cancelButtonText: 'Cancelar',
      confirmButtonText: 'Si, Suspender!',
    }).then((result) => {
      if (result.isConfirmed) {
        this.stopSurvey(survey)
          .then((res) => {
            Swal.fire({
              title: 'Suspendida!',
              text: 'La encuesta ha sido suspendida.',
              icon: 'success',
            });
          })
          .catch((error) => {
            console.log(error);
          });
      }
    });
  }

  onActivateSurvey(survey: Survey): void {
    Swal.fire({
      title: '¿Esta seguro?',
      text: 'Los usuarios podran acceder y solucionar la encuesta de nuevo',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      cancelButtonText: 'Cancelar',
      confirmButtonText: 'Si, Activar!',
    }).then((result) => {
      if (result.isConfirmed) {
        this.activeSurvey(survey)
          .then((res) => {
            Swal.fire({
              title: 'Activada!',
              text: 'La encuesta ha sido activada.',
              icon: 'success',
            });
          })
          .catch((error) => {
            console.log(error);
          });
      }
    });
  }

  async stopSurvey(survey: Survey): Promise<void> {
    this.isLoading = true; // Mostrar el spinner
    try {
      survey.state = 'Suspendida';
      survey.updated_date = this.formatDate();
      const response = await this.surveyService
        .updateSurvey(survey.id, survey)
        .toPromise();
      if (response) {
        console.log(response, 'Survey updated');
        try {
          const response = await this.userSurveyService
            .updateSurvey(survey.id, survey)
            .toPromise();
          if (response) {
            console.log(response, 'User survey state updated');
          }
        } catch (error) {
          console.error('Error creating survey', error);
        }
      }
    } catch (error) {
      console.error('Error suspending survey', error);
    } finally {
      this.isLoading = false;
    }
  }

  async activeSurvey(survey: Survey): Promise<void> {
    this.isLoading = true; // Mostrar el spinner
    try {
      survey.state = 'Activa';
      survey.updated_date = this.formatDate();
      const response = await this.surveyService
        .updateSurvey(survey.id, survey)
        .toPromise();
      if (response) {
        console.log(response, 'Survey updated');
        try {
          const response = await this.userSurveyService
            .updateSurvey(survey.id, survey)
            .toPromise();
          if (response) {
            console.log(response, 'User survey state updated');
          }
        } catch (error) {
          console.error('Error creating survey', error);
        }
      }
    } catch (error) {
      console.error('Error creating survey', error);
    } finally {
      this.isLoading = false;
    }
  }

  closeSurvey(id: string): void {
    Swal.fire({
      title: '¿Esta seguro?',
      text: 'La encuesta sera archivada indefinidamente!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      cancelButtonText: 'Cancelar',
      confirmButtonText: 'Si, Cerrar!',
    }).then((result) => {
      if (result.isConfirmed) {
        const editSurvey = {
          state: 'Cerrada',
        };
        this.surveyService.updateSurvey(id, editSurvey).subscribe(() => {
          this.userSurveyService.updateSurvey(id, editSurvey).subscribe(() => {
            Swal.fire({
              title: 'Cerrada!',
              text: 'La encuesta ha sido cerrada.',
              icon: 'success',
            });
            this.loadSurveys();
          });
        });
      }
    });
  }

  copyUrlSurvey(survey: any): void {
    if (survey.state !== 'Activa') {
      return;
    }
    this.clipboard.copy(
      `${'http://localhost:4200'}/${'userpanel'}/id:${survey.id}`
    );
    this.toastr.success('Url copiada');
  }

  closeForm(): void {
    this.isFormVisible = false;
  }

  onSurveySaved(): void {
    this.loadSurveys();
  }

  openInfoWindow(element: Survey | null): void {
    this.infoWindow = !this.infoWindow;
    this.selectedSurvey = element;
  }

  formatDate(): string {
    const date = new Date();
    return format(date, 'dd/MM/yyyy');
  }

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

  async cloneSurvey(survey: Survey): Promise<void> {
    survey.id = uuidv4();
    survey.title = survey.title + ' - copia';
    survey.updated_date = this.formatDate();
    survey.state = 'Editada';
    const response: any = await this.surveyService
      .createSurvey(survey)
      .toPromise();
    if (response.survey) {
      this.toastr.success('Encusta clonada con exito');
      this.loadSurveys();
    }
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
      case 'Activa':
        color = '#128524';
        background = '#ACFFBA';
        break;
      case 'Editada':
        color = '#898C08';
        background = '#F3FFAC';
        break;
      case 'Cerrada':
        color = 'rgb(179 0 0)';
        background = 'rgb(255 170 170)';
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
}
