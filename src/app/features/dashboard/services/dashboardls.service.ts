import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})

export class DashboardlsService {
  private dashboardOptionsKey = 'dashboardOptions';
  
  // Método para obtener las opciones del dashboard desde el localStorage
  getDashboardOptions(): any[] {
    const savedOptions = localStorage.getItem(this.dashboardOptionsKey);
    return savedOptions ? JSON.parse(savedOptions) : [];
  }

  // Método para guardar las opciones del dashboard en el localStorage
  saveDashboardOptions(options: any[]): void {
    localStorage.setItem(this.dashboardOptionsKey, JSON.stringify(options));
  }
}
