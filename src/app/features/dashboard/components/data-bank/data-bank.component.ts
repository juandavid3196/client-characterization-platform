import { Component, EventEmitter, Input, Output } from '@angular/core';
import { DataBankService } from '../../services/data-bank.service';
import { v4 as uuidv4 } from 'uuid';
import { DashboardlsService } from '../../services/dashboardls.service';


@Component({
  selector: 'app-data-bank',
  templateUrl: './data-bank.component.html',
  styleUrls: ['./data-bank.component.scss']
})
export class DataBankComponent {

close : boolean = false;
@Output() formClose = new EventEmitter<void>();
@Output() reloadList = new EventEmitter<void>();
@Output() selectedOption =  new EventEmitter<any>();
bankQuestions : any[] = [];
arrayQuestions : any[] = [];
selectedIndexes : number[] = [];
@Input() IndexPosition : any = {};
types : string[] = ['Check Box','Tabla', 'Si y No', 'Abierta', 'Escala de Opciones','Todas'];

constructor(
  private dataBankService : DataBankService,
  private dashboardlsService : DashboardlsService
){}

ngOnInit() : void {

  this.getBanks();
  this.selectedIndexes = [];
}


getBanks() : void {
  this.dataBankService.getBanks().subscribe(banks => { 
    this.bankQuestions = banks;
    this.arrayQuestions = banks;
  });
}


onClose():void {
  this.close =  true;
  setTimeout(()=>{
    this.formClose.emit();
  },500);
}

selectedQuestion(index:number) : void {
  this.selectedIndexes.push(index);
}

verifyIndex(index:number): boolean {
 if(this.selectedIndexes.indexOf(index) != -1){
  return true;
 }
 return false;
}

deleteQuestion(id:string): void {
  this.dataBankService.deleteBank(id).subscribe(
    () => {
      this.getBanks();
    },
    (error) => {
      console.error('Error deleting bank', error);
    }
  );
}

deselectQuestion(index:number) : void {
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


sendQuestions() :  void {
  let questions = [];
  let numeralList = 1;

  // Generar IDs y preparar las preguntas seleccionadas
  for (let i = 0; i < this.selectedIndexes.length; i++) {
    const newQuestion = { ...this.bankQuestions[this.selectedIndexes[i]], id: uuidv4() };
    questions.push(newQuestion);  
  }

  let dashboardOptions = this.dashboardlsService.getDashboardOptions();

  

  if (this.IndexPosition.index === 0 && this.IndexPosition.position !== 'forward') {
    // Insertar al principio
    dashboardOptions.unshift(...questions);
  }else {
    // Insertar en la posición especificada
    dashboardOptions.splice(this.IndexPosition.index + 1, 0, ...questions);
  }

   // agregar numerales
  
   for(let i =0; i< dashboardOptions.length; i++){
    if(dashboardOptions[i].type !== 'section'){
      dashboardOptions[i].numeral = numeralList;
      numeralList +=1;
    }
  }

  // Guardar las opciones actualizadas y resetear el estado
  this.dashboardlsService.saveDashboardOptions(dashboardOptions);
  this.reloadList.emit();
  this.selectedIndex(this.IndexPosition, questions);
  numeralList = 1;
  this.IndexPosition.index = 0;
  this.IndexPosition.position = '';
  this.selectedIndexes = [];
  this.onClose();
}

selectedIndex(positionData:any,element: any) :  void {
  let data = {};
  if(positionData.index === 0  && element.length === 1){
     data = {
       index: (positionData.position === 'back') ? 0 : 1,
       element:element[element.length-1]
      }
  }else if(positionData.index === 0 && element.length >= 1){
    data = {
        index:(positionData.position === 'back')? element.length -1:element.length,
        element:element[element.length-1]
      }
  }else{
    data = {
      index: positionData.index + element.length,
      element:element[element.length-1]
    }
  }
  this.selectedOption.emit(data);
}


}
