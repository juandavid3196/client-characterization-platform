import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-data-bank',
  templateUrl: './data-bank.component.html',
  styleUrls: ['./data-bank.component.scss']
})
export class DataBankComponent {
close : boolean = false;
@Output() formClose = new EventEmitter<void>();

onClose():void {
  this.close =  true;
  setTimeout(()=>{
    this.formClose.emit();
  },500);
}


}
