import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserBarComponent } from './components/user-bar/user-bar.component';
import { MatIconModule } from '@angular/material/icon';
import { FilterSelectComponent } from './components/filter-select/filter-select.component';
import { ToggleButtonComponent } from './components/toggle-button/toggle-button.component';
import { SpinerComponent } from './components/spiner/spiner.component';
import { ZoomDirective } from './directives/zoom.directive';



@NgModule({
  declarations: [
    UserBarComponent,
    FilterSelectComponent,
    ToggleButtonComponent,
    SpinerComponent,
    ZoomDirective,

  ],
  imports: [
    CommonModule,
    MatIconModule
  ],
  exports: [
    ToggleButtonComponent,
    UserBarComponent,
    FilterSelectComponent,
    SpinerComponent,
    ZoomDirective
  ]
})
export class SharedModule { }
