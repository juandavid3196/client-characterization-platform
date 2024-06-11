import { Injectable } from '@angular/core';
import { ApiService } from '../../../core/services/api.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SurveyService {
  private endpoint = 'surveys';

  constructor(private apiService: ApiService) {}

  getSurveys(): Observable<any[]> {
    return this.apiService.get<any>(this.endpoint);
  }

  getSurveyById(id: number): Observable<any> {
    return this.apiService.getById<any>(this.endpoint, id);
  }

  createSurvey(survey: any): Observable<any> {
    return this.apiService.create<any>(this.endpoint, survey);
  }

  updateSurvey(id: number, survey: any): Observable<any> {
    return this.apiService.update<any>(this.endpoint, id, survey);
  }

  deleteSurvey(id: number): Observable<void> {
    return this.apiService.delete(this.endpoint, id);
  }
}
