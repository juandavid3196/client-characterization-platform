import { Component} from '@angular/core';
import { questionConfigs } from '../../models/questionsConfig.model';
import { FormGroup } from '@angular/forms';
import { Section } from '../../models/section.model';
import { DashboardService } from '../../services/dashboard.service';
import { v4 as uuidv4 } from 'uuid';

@Component({
  selector: 'app-dashboard-main',
  templateUrl: './dashboard-main.component.html',
  styleUrls: ['./dashboard-main.component.scss']
})
export class DashboardMainComponent {

  openQuestion : boolean = false;
  sectionSelected : Section | null = null;
  dashboardOptions: any[]= [];
  numeralList !: number;
  questionConfigs = questionConfigs; 
  formData !: FormGroup;
  questionIndex !: number | null;
  indexPosition :string = '';
  indexSelected!:number | null;
  elementSelected : any = {};
  databankSection: boolean = false;
  settingSection: boolean = false;
  btnSelected : string = 'dashboard';
  bankIndex !: number;


  constructor(private dashboardService : DashboardService ){}

  // Local Storage Info

  ngOnInit() : void {
    this.getQuestions();
    this.initializeDashboardValues();
  } 

 
  getQuestions() : void {
    this.dashboardService.getQuestions().subscribe(q => { 
      this.dashboardOptions = q;
    });
  }

  updateDashboardQuestions(item : any[]) : void {
    this.dashboardService.updateQuestion(item).subscribe(
      (response) => {
        console.log('questions updated', response);
        this.getQuestions();
      },
      (error) => {
        console.error('Error updating questions', error);
      }
    );
  }

    initializeDashboardValues(): void {
      if(this.dashboardOptions.length > 0 ){
        this.elementSelected = this.dashboardOptions[0];
        this.indexSelected = 0;
      }
    } 


  setFormData(form:FormGroup):void{
    this.formData = form;
  }


  openQuestionsMenu(index?:number) : void {
    this.openQuestion = !this.openQuestion;
    this.bankIndex = index || 0;
  }

  onSelectedType(type:string): void {
    let selectedQuestion = this.questionConfigs.find(q=> q.type === type);
    if(selectedQuestion){
      // Asignar un ID único si no existe
      if (!selectedQuestion.id) {
        selectedQuestion.id = uuidv4(); // Generar un nuevo ID único
      }
      if(typeof this.questionIndex === 'number'){
        if(this.questionIndex === 0  && this.indexPosition === 'back'){
          const newQuestion = { ...selectedQuestion, numeral: 1}; 
          for(let i = 0; i < this.dashboardOptions.length; i++){
            if(this.dashboardOptions[i].type != 'section'){
              this.dashboardOptions[i].numeral  += 1;
            }
          }
          this.dashboardOptions.unshift(newQuestion);
          this.onElementSelected(0,newQuestion);
        }else {
          const newQuestion = { ...selectedQuestion, numeral: this.dashboardOptions[this.questionIndex].numeral + 1}; 
          for(let i = this.questionIndex + 1; i < this.dashboardOptions.length; i++){
            if(this.dashboardOptions[i].type != 'section'){
              this.dashboardOptions[i].numeral  += 1;
            }
          }
          this.dashboardOptions.splice(this.questionIndex + 1, 0, newQuestion);
          this.onElementSelected(this.questionIndex + 1, newQuestion);
        }
      }else{
        
        this.numeralListCount();
          const newQuestion = { ...selectedQuestion, numeral: this.numeralList};
          this.dashboardOptions.push(newQuestion);
          this.onElementSelected(this.dashboardOptions.length -1,newQuestion);
      }
    }

    this.updateDashboardQuestions(this.dashboardOptions);
    
    this.questionIndex = null;
    this.indexPosition = '';

  }

  numeralListCount(): void {
    this.numeralList = 1;
    for(let i = 0; i < this.dashboardOptions.length; i++ ){
      if(this.dashboardOptions[i].type != 'section'){
       this.numeralList ++;
      }
    }

  }

  onSectionSelected(section:string): void {
    
    if(typeof this.questionIndex === 'number'){
      if(this.questionIndex === 0  && this.indexPosition === 'back'){
        this.dashboardOptions.unshift(section);
        if(typeof this.questionIndex === 'number')
          this.onElementSelected(0,{type:'section'});
      }else {
        this.dashboardOptions.splice(this.questionIndex + 1, 0, section);
        this.onElementSelected(this.questionIndex + 1,{type:'section'});
      }
    }else{
      this.dashboardOptions.push(section);
      this.onElementSelected(this.dashboardOptions.length - 1,{type:'section'});
    }

    this.updateDashboardQuestions(this.dashboardOptions);

    this.questionIndex = null;
    this.indexPosition = '';

  }


  deleteQuestion(index:number): void {
   
    if(index != this.dashboardOptions.length - 1){
      for(let i = index; i < this.dashboardOptions.length; i++ ){
        if(this.dashboardOptions[i].type != 'section'){
          this.dashboardOptions[i].numeral  -= 1;
        }
      }
    }

    this.selectAfterDelete(index);
    this.dashboardOptions.splice(index, 1);
    this.updateDashboardQuestions(this.dashboardOptions);
  }


    
  addNewElement(index:number,position:string): void {
    this.questionIndex= index;
    this.indexPosition = position;
    this.openQuestionsMenu(index);
  }

  onElementSelected(index:number, element:any):void {
    this.indexSelected = index;
    if(element.type !== 'section'){
      this.elementSelected = element;
    }else{
      this.elementSelected = {};
    }
  }

  selectAfterDelete(index:number):void {
    if(index ===  0 && this.dashboardOptions.length === 1){
      this.elementSelected = {};
    }else if( this.dashboardOptions.length > 1 && index === this.dashboardOptions.length -1 ){
      this.onElementSelected(index-1,this.dashboardOptions[index-1]);  
    }else if(index === 0 && this.dashboardOptions.length === 2){
      this.onElementSelected(0,{...this.dashboardOptions[index+1],numeral:1});
    }else{
      this.onElementSelected(index,this.dashboardOptions[index+1]);
    }
  }

  deleteSection(index: number) : void {
      this.selectAfterDelete(index);
      this.dashboardOptions.splice(index, 1);  
      this.updateDashboardQuestions(this.dashboardOptions);
  }

  openDataBankSection():void {
    this.databankSection = !this.databankSection;
    if(this.databankSection === false){
      this.btnSelected = 'dashboard';
    }else {
      this.btnSelected = 'databank';
    }
  }

  openSettingSection():void {
    this.settingSection = !this.settingSection;
    if(this.settingSection === false){
      this.btnSelected = 'dashboard';
    }else {
      this.btnSelected = 'setting';
    }
  }

  // handleDataTable(dataTable:any):void {
  //   if(this.indexSelected !== null){
  //     this.dashboardOptions[this.indexSelected]= {...dataTable,numeral:this.elementSelected.numeral};
  //     this.elementSelected = this.dashboardOptions[this.indexSelected];
  //   }
  //   console.log(this.dashboardOptions,this.indexSelected,this.elementSelected);
  //   this.saveToLocalStorage();
  // }


}
