import { Injectable } from '@angular/core';
import { ApiService } from '../../../core/services/api.service';
import { Observable } from 'rxjs';
import { Survey } from '../models/survey.model';

@Injectable({
  providedIn: 'root'
})
export class SurveyService {
  private endpoint = 'surveys';

  constructor(private apiService: ApiService) {}

  getSurveys(): Observable<Survey[]> {
    return this.apiService.get<Survey>(this.endpoint);
  }

  getSurveyById(id: number): Observable<Survey> {
    return this.apiService.getById<Survey>(this.endpoint, id);
  }

  createSurvey(survey: Survey): Observable<Survey> {
    return this.apiService.create<Survey>(this.endpoint, survey);
  }

  updateSurvey(id: number, survey: Survey): Observable<Survey> {
    return this.apiService.update<Survey>(this.endpoint, id, survey);
  }

  deleteSurvey(id: number): Observable<void> {
    return this.apiService.delete(this.endpoint, id);
  }
}
