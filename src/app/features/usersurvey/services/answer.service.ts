import { Injectable } from '@angular/core';
import { ApiService } from '../../../core/services/api.service';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class AnswerService {
  private endpoint = 'answer';

  constructor(private apiService: ApiService ) {}

  getAnswer(): Observable<any[]> {
    return this.apiService.get<any>(this.endpoint);
  }

  getAnswerById(id: string): Observable<any> {
    return this.apiService.getById<any>(this.endpoint, id);
  }

  createAnswer(survey: any): Observable<any> {
    return this.apiService.create<any>(this.endpoint, survey);
  }

  updateAnswer(id: string, survey: any): Observable<any> {
    return this.apiService.update<any>(this.endpoint, id, survey);
  }

  deleteAnswer(id: string): Observable<void> {
    return this.apiService.delete(this.endpoint, id);
  }
  
}
