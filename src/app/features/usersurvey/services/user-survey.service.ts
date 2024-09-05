import { Injectable } from '@angular/core';
import { ApiService } from '../../../core/services/api.service';
import { Observable } from 'rxjs';
import { userSurvey } from '../models/user-survey.model';
import { SurveyService } from '../../surveys/services/survey.service';

@Injectable({
  providedIn: 'root'
})
export class UserSurveyService {
  private endpoint = 'usersurvey';

  constructor(private apiService: ApiService, private surveyService : SurveyService ) {}

  getSurveys(): Observable<userSurvey[]> {
    return this.apiService.get<userSurvey>(this.endpoint);
  }

  getSurveyById(id: string): Observable<userSurvey> {
    return this.apiService.getById<userSurvey>(this.endpoint, id);
  }

  createSurvey(survey: userSurvey): Observable<userSurvey> {
    return this.apiService.create<userSurvey>(this.endpoint, survey);
  }

  updateSurvey(id: string, survey: any): Observable<userSurvey> {
    return this.apiService.update<userSurvey>(this.endpoint, id, survey);
  }

  deleteSurvey(id: string): Observable<void> {
    return this.apiService.delete(this.endpoint, id);
  }

  checkSurveyExists(id: string): Promise<boolean> {
    return this.surveyService.getSurveyById(id).toPromise().then((response: any) => {
      if (response && response.survey) {
        return true; // La encuesta existe
      } else {
        return false; // La encuesta no existe
      }
    }).catch((error) => {
      console.error('Error fetching survey', error);
      return false; // Error en la solicitud o la encuesta no existe
    });
  }
  
}
