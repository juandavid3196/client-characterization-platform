import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserBarComponent } from './components/user-bar/user-bar.component';
import { MatIconModule } from '@angular/material/icon';
import { FilterSelectComponent } from './components/filter-select/filter-select.component';
import { ToggleButtonComponent } from './components/toggle-button/toggle-button.component';
import { SpinerComponent } from './components/spiner/spiner.component';



@NgModule({
  declarations: [
    UserBarComponent,
    FilterSelectComponent,
    ToggleButtonComponent,
    SpinerComponent,

  ],
  imports: [
    CommonModule,
    MatIconModule
  ],
  exports: [
    ToggleButtonComponent,
    UserBarComponent,
    FilterSelectComponent,
    SpinerComponent
  ]
})
export class SharedModule { }
