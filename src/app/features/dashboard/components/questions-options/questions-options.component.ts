import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-questions-options',
  templateUrl: './questions-options.component.html',
  styleUrls: ['./questions-options.component.scss']
})
export class QuestionsOptionsComponent {

  close : boolean = false;
  @Output() formClose = new EventEmitter<void>()
  @Output() typeSelected = new EventEmitter<string>();

  selectType(type: string) {
    this.typeSelected.emit(type);
    this.onClose();
  }
  
  onClose():void {
    this.close =  true;
    setTimeout(()=>{
      this.formClose.emit();
    },500);
  }

}
