import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserBarComponent } from './components/user-bar/user-bar.component';
import { MatIconModule } from '@angular/material/icon';
import { ConfirmButtonComponent } from './components/confirm-button/confirm-button.component';
import { FilterSelectComponent } from './components/filter-select/filter-select.component';



@NgModule({
  declarations: [
    UserBarComponent,
    ConfirmButtonComponent,
    FilterSelectComponent,

  ],
  imports: [
    CommonModule,
    MatIconModule
  ],
  exports: [
    UserBarComponent,
    ConfirmButtonComponent,
    FilterSelectComponent
  ]
})
export class SharedModule { }
