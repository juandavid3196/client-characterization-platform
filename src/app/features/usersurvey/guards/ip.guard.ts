import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { UserSurveyService } from '../services/user-survey.service';


@Injectable({
  providedIn: 'root'
})
export class IpGuard implements CanActivate {

  constructor(private userSurveyService: UserSurveyService, private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    const surveyId = route.paramMap.get('id');

    // Verifica si el ID existe en la base de datos.
    if(surveyId) {
      return this.userSurveyService.checkSurveyExists(surveyId).then(exists => {
        if (exists) {
          return true;
        } else {
          // Redirigir a una página de error si el ID no es válido.
          this.router.navigate(['/error']);
          return false;
        }
      }).catch(() => {
        this.router.navigate(['/error']);
        return false;
      });
    } else{
      return false;
    }
  }
}
