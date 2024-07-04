import { Component} from '@angular/core';
import { QuestionConfig,questionConfigs } from '../../models/questionsConfig.model';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-dashboard-main',
  templateUrl: './dashboard-main.component.html',
  styleUrls: ['./dashboard-main.component.scss']
})
export class DashboardMainComponent {

  openQuestion : boolean = false;
  selectedType : string = '';
  questions : QuestionConfig[]=[];
  questionConfigs = questionConfigs; 
  formData !: FormGroup;


  setFormData(form:FormGroup):void{
    this.formData = form;
  }


  openQuestionsMenu() : void {
    this.openQuestion = !this.openQuestion;
    this.selectedType = '';
  }

  onSelectedType(type:string) {
    this.selectedType = type;
    let selectedQuestion = this.questionConfigs.find(q=> q.type === type);
    if(selectedQuestion){
      const newQuestion = { ...selectedQuestion, id: this.questions.length};
      newQuestion.numeral = newQuestion.id +1;
      this.questions.push(newQuestion);
      console.log(this.questions);
    }
  }

  deleteQuestion(id:number | null){
    const index = this.questions.findIndex(s => s.id === id);
    this.questions.splice(index, 1);
  }

}
