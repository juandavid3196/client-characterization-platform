import { Component, EventEmitter, Input, Output, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-filter-select',
  templateUrl: './filter-select.component.html',
  styleUrls: ['./filter-select.component.scss']
})
export class FilterSelectComponent {

@Input() options : string[] = [];
@Output() optionValue = new EventEmitter<string>();

  select_click: boolean = false;
  caret_rotate: boolean = false;
  menu_open: boolean = false;
  selectedOption : string = '';

  verifySelectedOption() : void {
    if(!this.options.includes(this.selectedOption)){
      this.selectedOption = '';
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
