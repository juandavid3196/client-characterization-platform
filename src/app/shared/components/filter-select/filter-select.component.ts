import { Component, EventEmitter, Input, Output, SimpleChanges } from '@angular/core';
import { DashboardlsService } from 'src/app/features/dashboard/services/dashboardls.service';

@Component({
  selector: 'app-filter-select',
  templateUrl: './filter-select.component.html',
  styleUrls: ['./filter-select.component.scss']
})
export class FilterSelectComponent {

@Input() options : any[] = [];
@Input() elementData : any = {};
@Output() optionValue = new EventEmitter<string>();

select_click: boolean = false;
caret_rotate: boolean = false;
menu_open: boolean = false;
selectedOption : string = '';

  
  constructor(private dashboardlsService : DashboardlsService){}

  ngOnInit():void {
    this.setSelectedOption();
  }

  verifySelectedOption() : void {
    if(!this.options.includes(this.selectedOption)){
      this.selectedOption = '';
      this.optionValue.emit(this.selectedOption);
    }
  }

  setSelectedOption() : void {
    const storedQuestions = this.dashboardlsService.getDashboardOptions();
    if (storedQuestions && this.elementData.id) {
      const element = storedQuestions.find((e: any) => e.id === this.elementData.id);
      if(element){
          if (element.hasOwnProperty('settings')) {
            const settings = element.settings;
            if (settings.hasOwnProperty('answer_value')) {
              this.selectedOption = settings['answer_value'];
            }
          }
      }
     }
  }

  toggleSelect() : void {
    this.select_click = !this.select_click;
    this.caret_rotate = !this.caret_rotate;
  }

  handleOption(option: string):void {
    this.select_click = !this.select_click;
    this.caret_rotate = !this.caret_rotate;
    this.selectedOption = option;
    this.optionValue.emit(option);
  }
}
