import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'surveys',
    loadChildren: () => import('./features/surveys/surveys.module').then(m => m.SurveysModule)
  },
  {
    path: '',
    redirectTo: '/surveys',
    pathMatch: 'full'
  },
  {
    path: '**',
    redirectTo: '/surveys'
  }

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
