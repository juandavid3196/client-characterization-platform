import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CoreModule } from './core/core.module';
import { SharedModule } from './shared/shared.module';
import { SurveysModule } from './features/surveys/surveys.module';
import { HttpClientModule } from '@angular/common/http';
import { DashboardModule } from './features/dashboard/dashboard.module';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    CoreModule,
    SharedModule,
    SurveysModule,
    HttpClientModule,
    DashboardModule

  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
