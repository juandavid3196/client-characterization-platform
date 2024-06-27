import { Component } from '@angular/core';

@Component({
  selector: 'app-checkbox-question',
  templateUrl: './checkbox-question.component.html',
  styleUrls: ['./checkbox-question.component.scss']
})
export class CheckboxQuestionComponent {

  getToggleValues(values : any) {
    console.log(values);
  }

}
