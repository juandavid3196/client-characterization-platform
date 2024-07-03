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
  qMessage : boolean = false;
  aMessage : boolean = false;

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

  getOptionValue(option : string) {

    let settings = this.checkBoxForm.get('settings') as FormGroup;   
    
    if (settings.controls.hasOwnProperty('answer_value')) {
      settings.patchValue({ ['answer_value']: option });
     }
  }

  get options(): FormArray {
    return this.checkBoxForm.get('options') as FormArray;
  }


  onFileChange(event: any, controlName: string): void {
    const file = event.target.files[0];
    if (file) {
      const settings = this.checkBoxForm.get('settings') as FormGroup;
      settings.patchValue({ [controlName]: file });

      if(controlName == 'question_multimedia'){
        this.qMessage = !this.qMessage;
      }else if(controlName == 'options_multimedia'){
        this.aMessage = !this.aMessage;
      }
    }
  }

  resetInputFile(controlName:string) {
    const settings = this.checkBoxForm.get('settings') as FormGroup;
    settings.patchValue({ [controlName]: '' });
    if(controlName == 'question_multimedia'){
      this.qMessage = !this.qMessage;
    }else if(controlName == 'options_multimedia'){
      this.aMessage = !this.aMessage;
    }
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
