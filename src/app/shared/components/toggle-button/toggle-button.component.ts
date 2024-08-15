import { Component, EventEmitter, Input, Output, SimpleChanges } from '@angular/core';
import { DashboardlsService } from 'src/app/features/dashboard/services/dashboardls.service';

@Component({
  selector: 'app-toggle-button',
  templateUrl: './toggle-button.component.html',
  styleUrls: ['./toggle-button.component.scss']
})
export class ToggleButtonComponent {

  @Input() name : string = '';
  @Input() OAnswer !: number;
  @Input() elementData : any = {};
  @Output() toggleValues = new EventEmitter<any>();
  @Output() optionsLength = new EventEmitter<boolean>();
  state : boolean =  false;
  
  constructor(private dashboardlsService : DashboardlsService){}
  
  ngOnInit():void {
    this.loadFromLocalStorage();
  }

  ngOnChanges(changes: SimpleChanges): void {

    if (changes['elementData']?.currentValue.id) {
      this.loadFromLocalStorage();
    }
  }

  reloadComponent():void {
    this.loadFromLocalStorage();
  }

  
  loadFromLocalStorage() {
    const storedQuestions = this.dashboardlsService.getDashboardOptions();
    if (storedQuestions && this.elementData.id) {
      const element = storedQuestions.find((e: any) => e.id === this.elementData.id);
      if(element){
          if (element.hasOwnProperty('settings')) {
            const settings = element.settings;
            if (settings.hasOwnProperty(this.name)) {
              this.state = settings[this.name];
            }
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

  ngOnDestroy() : void {
      this.state =  false;    
  }

}



