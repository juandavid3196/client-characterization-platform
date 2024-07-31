import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'surveys',
    loadChildren: () => import('./features/surveys/surveys.module').then(m => m.SurveysModule)
  },
  {
    path: 'dashboard',
    loadChildren: () => import('./features/dashboard/dashboard.module').then(m => m.DashboardModule)
  },
  {
    path: 'adminpanel',
    loadChildren: () => import('./features/adminpanel/adminpanel.module').then(m => m.AdminpanelModule)
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
