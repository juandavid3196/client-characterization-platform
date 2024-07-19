import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserBarComponent } from './components/user-bar/user-bar.component';
import { MatIconModule } from '@angular/material/icon';
import { FilterSelectComponent } from './components/filter-select/filter-select.component';
import { ToggleButtonComponent } from './components/toggle-button/toggle-button.component';



@NgModule({
  declarations: [
    UserBarComponent,
    FilterSelectComponent,
    ToggleButtonComponent,

  ],
  imports: [
    CommonModule,
    MatIconModule
  ],
  exports: [
    ToggleButtonComponent,
    UserBarComponent,
    FilterSelectComponent
  ]
})
export class SharedModule { }
