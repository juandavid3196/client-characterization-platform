import { Component} from '@angular/core';
import { QuestionConfig,questionConfigs } from '../../models/questionsConfig.model';
import { FormGroup } from '@angular/forms';
import { Section } from '../../models/section.model';

@Component({
  selector: 'app-dashboard-main',
  templateUrl: './dashboard-main.component.html',
  styleUrls: ['./dashboard-main.component.scss']
})
export class DashboardMainComponent {

  openQuestion : boolean = false;
  selectedType : string = '';
  sectionSelected : Section | null = null;
  dashboardOptions: any[]= [];
  numeralList: number = 0;
  questionConfigs = questionConfigs; 
  formData !: FormGroup;


  setFormData(form:FormGroup):void{
    this.formData = form;
  }


  openQuestionsMenu() : void {
    this.openQuestion = !this.openQuestion;
    this.selectedType = '';
  }

  onSelectedType(type:string): void {
    this.selectedType = type;
    let selectedQuestion = this.questionConfigs.find(q=> q.type === type);
    if(selectedQuestion){
      this.numeralList++;
      const newQuestion = { ...selectedQuestion, numeral: this.numeralList};
      this.dashboardOptions.push(newQuestion);
    }
  }

  onSectionSelected(section:string): void {
    this.dashboardOptions.push(section);
    console.log(this.dashboardOptions);
  }


  deleteQuestion(index:number): void {
   
    if(index != this.dashboardOptions.length - 1){
      for(let i = index; i < this.dashboardOptions.length; i++ ){
        if(this.dashboardOptions[i].type != 'section'){
          this.dashboardOptions[i].numeral  = this.dashboardOptions[i].numeral - 1;
        }
      }
    }
      this.dashboardOptions.splice(index, 1);
    }
    
  addNewElement(index:number): void {
    if(index === 0){

    }else if(index === this.dashboardOptions.length -1){

    }
    else{
      
    }
  }

  deleteSection(index: number) : void {
      this.dashboardOptions.splice(index, 1);  
  }

}
