import { Injectable } from '@angular/core';
import { ApiService } from '../../../core/services/api.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DataBankService {

  private endpoint = 'bank';

  constructor(private apiService: ApiService) {}

  getBanks(): Observable<any[]> {
    return this.apiService.get<any>(this.endpoint);
  }


  createBank(any: any): Observable<any> {
    return this.apiService.create<any>(this.endpoint, any);
  }


  deleteBank(id:string): Observable<void> {
    return this.apiService.delete(this.endpoint, id);
  }

}
