import { Injectable } from '@angular/core';
import { ApiService } from '../../../core/services/api.service';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class UserService {
  private endpoint = 'user';

  constructor(private apiService: ApiService) {}

  getUsers(): Observable<any[]> {
    return this.apiService.get<any>(this.endpoint);
  }

  getUserById(id: number): Observable<any> {
    return this.apiService.getById<any>(this.endpoint, id);
  }

  createUser(user: any): Observable<any> {
    return this.apiService.create<any>(this.endpoint, user);
  }

  updateUser(id: number, user: any): Observable<any> {
    return this.apiService.update<any>(this.endpoint, id, user);
  }

  deleteUser(id: number): Observable<void> {
    return this.apiService.delete(this.endpoint, id);
  }
}
