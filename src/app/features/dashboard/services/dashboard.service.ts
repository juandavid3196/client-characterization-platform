import { Injectable } from '@angular/core';
import { ApiService } from '../../../core/services/api.service';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/app/environments/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  private endpoint = 'question';
  private baseUrl = environment.apiUrl ; 

  constructor(private apiService: ApiService, private http : HttpClient) {}

  getQuestions(): Observable<any[]> {
    return this.apiService.get<any>(this.endpoint);
  }

  getQuestionById(id: number): Observable<any> {
    return this.apiService.getById<any>(this.endpoint, id);
  }

  createQuestion(any: any): Observable<any> {
    return this.apiService.create<any>(this.endpoint, any);
  }
  
  updateQuestion(questions: any[]): Observable<any> {
    return this.http.put<any>(`${this.baseUrl}/${this.endpoint}`, questions);
  }

  deleteQuestion(id: number): Observable<void> {
    return this.apiService.delete(this.endpoint, id);
  }
}
