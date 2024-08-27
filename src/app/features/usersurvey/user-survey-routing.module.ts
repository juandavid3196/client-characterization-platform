import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UserSurveysComponent } from './components/user-surveys/user-surveys.component';
import { SurveyTestComponent } from './components/survey-test/survey-test.component';
import { IpGuard } from './guards/ip.guard';


const routes: Routes = [
  { path: '', component: UserSurveysComponent },
  { path: '/id', component: SurveyTestComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserSurveyRoutingModule {}
