import { Component, EventEmitter, Input, Output } from '@angular/core';
import { DataBankService } from '../../services/data-bank.service';

@Component({
  selector: 'app-data-bank',
  templateUrl: './data-bank.component.html',
  styleUrls: ['./data-bank.component.scss']
})
export class DataBankComponent {

close : boolean = false;
@Output() formClose = new EventEmitter<void>();
bankQuestions : any[] = [];
selectedIndex : number[] = [];
@Input() IndexPosition !: number;

constructor(private dataBankService : DataBankService){}

ngOnInit() : void {
  const allObjects = this.dataBankService.getObjects();
  this.bankQuestions = allObjects;
}


onClose():void {
  this.close =  true;
  setTimeout(()=>{
    this.formClose.emit();
  },500);
}

selectedQuestion(index:number) : void {
  this.selectedIndex.push(index);
}

verifyIndex(index:number): boolean {
 if(this.selectedIndex.indexOf(index) != -1){
  return true;
 }
 return false;
}

}
