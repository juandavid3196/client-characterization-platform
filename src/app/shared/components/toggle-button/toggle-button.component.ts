import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-toggle-button',
  templateUrl: './toggle-button.component.html',
  styleUrls: ['./toggle-button.component.scss']
})
export class ToggleButtonComponent {

  @Input() name : string = '';
  @Input() OAnswer !: number;
  @Output() toggleValues = new EventEmitter<any>();
  @Output() optionsLength = new EventEmitter<boolean>();
  state !: boolean;
  
  
  ngOnInit():void {
    this.loadFromLocalStorage();
  }


  reloadComponent():void {
    this.loadFromLocalStorage();
  }

  
  loadFromLocalStorage() {
    const savedForm = localStorage.getItem('checkBoxForm');
    if(savedForm){
      const localInfo = JSON.parse(savedForm);
      if (localInfo.hasOwnProperty('settings')) {
        const settings = localInfo.settings;
        if (settings.hasOwnProperty(this.name)) {
          this.state = settings[this.name];
        }
      }
    }
   
  }

  checkOptionsLength() : void {
    if(this.OAnswer === 0){
      this.optionsLength.emit();
    }
  }

onChangeState(): void {
    this.state = !this.state;
    this.toggleValues.emit({
      name:this.name,
      state:this.state
    })
  }
}
