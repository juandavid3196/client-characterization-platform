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
  sectionSelected : Section | null = null;
  dashboardOptions: any[]= [];
  numeralList !: number;
  questionConfigs = questionConfigs; 
  formData !: FormGroup;
  questionIndex !: number | null;
  indexPosition :string = '';

  setFormData(form:FormGroup):void{
    this.formData = form;
  }


  openQuestionsMenu() : void {
    this.openQuestion = !this.openQuestion;
  }

  onSelectedType(type:string): void {
    let selectedQuestion = this.questionConfigs.find(q=> q.type === type);
    if(selectedQuestion){
      if(typeof this.questionIndex === 'number'){
        if(this.questionIndex === 0  && this.indexPosition === 'back'){
          const newQuestion = { ...selectedQuestion, numeral: 1}; 
          for(let i = 0; i < this.dashboardOptions.length; i++){
            if(this.dashboardOptions[i].type != 'section'){
              this.dashboardOptions[i].numeral  += 1;
            }
          }
          this.dashboardOptions.unshift(newQuestion);
        }else {
          const newQuestion = { ...selectedQuestion, numeral: this.dashboardOptions[this.questionIndex].numeral + 1}; 
          for(let i = this.questionIndex + 1; i < this.dashboardOptions.length; i++){
            if(this.dashboardOptions[i].type != 'section'){
              this.dashboardOptions[i].numeral  += 1;
            }
          }
          this.dashboardOptions.splice(this.questionIndex + 1, 0, newQuestion);
        }
      }else{
        
        this.numeralListCount();
          const newQuestion = { ...selectedQuestion, numeral: this.numeralList};
          this.dashboardOptions.push(newQuestion);
      }
    }
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
    this.dashboardOptions.push(section);
    console.log(this.dashboardOptions);
  }


  deleteQuestion(index:number): void {
   
    if(index != this.dashboardOptions.length - 1){
      for(let i = index; i < this.dashboardOptions.length; i++ ){
        if(this.dashboardOptions[i].type != 'section'){
          this.dashboardOptions[i].numeral  -= 1;
        }
      }
    }
      this.dashboardOptions.splice(index, 1);
    }
    
  addNewElement(index:number,position:string): void {
    this.questionIndex= index;
    this.indexPosition = position;
    this.openQuestionsMenu();
  }

  deleteSection(index: number) : void {
      this.dashboardOptions.splice(index, 1);  
  }

}
