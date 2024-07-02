import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormArray } from '@angular/forms';

@Component({
  selector: 'app-checkbox-question',
  templateUrl: './checkbox-question.component.html',
  styleUrls: ['./checkbox-question.component.scss']
})
export class CheckboxQuestionComponent {

  checkBoxForm : FormGroup;
  addNote: boolean = false;
  defectedAnswer: boolean = false;
  optionsAnswer : string[] = [];
  
  constructor(private fb:FormBuilder){
    this.checkBoxForm = this.fb.group({  // create a fb.group for every Object 
      id: null,
      numeral: null,
      type: 'checkbox',
      text: '',
      description:'',
      icon:'check-icon',
      note_text:'',
      options: this.fb.array([this.fb.control('')]),
      settings: this.fb.group({  
        another_field: false,
        question_multimedia: '',
        options_multimedia: '',
        required: false,
        defected_answer: false,
        answer_value: '',
        add_note: false,
      })
    });

  }


  
 
  getToggleValues(values : any) {

    let settings = this.checkBoxForm.get('settings') as FormGroup;  // access to a specific property.   
     
     if (settings.controls.hasOwnProperty(values.name)) { // verify a property 

      if(values.name === 'add_note'){
        this.addNote = values.state;
      }else if( values.name == 'defected_answer'){
        this.defectedAnswer = values.state;
      }

      settings.patchValue({ [values.name]: values.state }); // modify value
    } 
  }

  get options(): FormArray {
    return this.checkBoxForm.get('options') as FormArray;
  }

  addOption(): void {
    this.options.push(this.fb.control(''));
  }

  updateAnswer(): void {
    this.optionsAnswer = this.options.controls.map(control => control.value);
  }

  removeOption(index: number): void {
    this.options.removeAt(index);
    this.optionsAnswer.splice(index, 1);  
  }

  onSubmit() : void {
   if(this.checkBoxForm.valid){
    console.log(this.checkBoxForm.value);
   }
  }

}
