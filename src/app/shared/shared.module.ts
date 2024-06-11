import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserBarComponent } from './components/user-bar/user-bar.component';
import { MatIconModule } from '@angular/material/icon';



@NgModule({
  declarations: [
    UserBarComponent,

  ],
  imports: [
    CommonModule,
    MatIconModule
  ],
  exports: [
    UserBarComponent
  ]
})
export class SharedModule { }
