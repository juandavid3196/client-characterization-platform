import { Component} from '@angular/core';
import { QuestionConfig,questionConfigs } from '../../models/questionsConfig.model';

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
  changeSection: string = 'edit';


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

  onChangeSection(section:string):void {
    this.changeSection = section;
  }
}
