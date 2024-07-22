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
arrayQuestions : any[] = [];
selectedIndexes : number[] = [];
@Input() IndexPosition !: number;
types : string[] = ['Check Box','Tabla', 'Si y No', 'Abierta', 'Escala de Opciones','Todas'];

constructor(private dataBankService : DataBankService){}

ngOnInit() : void {
  const allObjects = this.dataBankService.getObjects();
  this.bankQuestions = allObjects;
  this.arrayQuestions = allObjects;
  this.selectedIndexes = [];
}


onClose():void {
  this.close =  true;
  setTimeout(()=>{
    this.formClose.emit();
  },500);
}

selectedQuestion(index:number) : void {
  this.selectedIndexes.push(index);
  console.log(index);
}

verifyIndex(index:number): boolean {
 if(this.selectedIndexes.indexOf(index) != -1){
  return true;
 }
 return false;
}

deleteQuestion(index:number): void {
  this.dataBankService.deleteObject(index);
}

deselectQuestion(index:number) : void {
  console.log(index);
  let number = this.selectedIndexes.indexOf(index);
  if(number != -1){
    this.selectedIndexes.splice(number,1);
  }
}

filterByText(event:any):void {
  this.arrayQuestions = this.bankQuestions.filter(item => item.text.toLowerCase().includes(event.target.value.toLowerCase()));
}

filterByType(type: string) {
  if(type === 'Todas'){ 
    this.arrayQuestions = this.bankQuestions;
    return;
  }
  const dictionary = [{value:'Tabla',type:'table'},{value:'Check Box',type:'checkbox'},{value:'Si y No',type:'yes/no'},{value:'Abierta',type:'open'},{value:'Escala de Opciones',type:'scale'}];
  let value = dictionary.filter(e => e.value === type);  
  this.arrayQuestions = this.bankQuestions.filter(item => item.type.toLowerCase() === value[0].type);
}

}
