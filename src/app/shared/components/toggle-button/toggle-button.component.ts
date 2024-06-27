import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-toggle-button',
  templateUrl: './toggle-button.component.html',
  styleUrls: ['./toggle-button.component.scss']
})
export class ToggleButtonComponent {

toggleState : boolean = false;

@Input() name : string = '';
@Output() toggleValues = new EventEmitter<any>();

onChangeState(): void {
  this.toggleState = !this.toggleState;
  this.toggleValues.emit({
    name:this.name,
    state:this.toggleState
  })
}


}
