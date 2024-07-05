import { Component, ViewChild} from '@angular/core';
import { FormBuilder, FormGroup, FormArray } from '@angular/forms';
import {FilterSelectComponent} from '../../../../shared/components/filter-select/filter-select.component'

@Component({
  selector: 'app-checkbox-question',
  templateUrl: './checkbox-question.component.html',
  styleUrls: ['./checkbox-question.component.scss']
})
export class CheckboxQuestionComponent {

  @ViewChild('appFilterComponent') childComponent: FilterSelectComponent | undefined;
  
  checkBoxForm : FormGroup;
  addNote !: boolean;
  defectedAnswer !: boolean;
  anotherField !: boolean;
  required !:boolean;
  optionsAnswer : string[] = [];
  qMessage : boolean = false;
  aMessage : boolean = false;
  blocked : boolean =  false;
  changeSection: boolean = true;

  constructor(private fb:FormBuilder){
    this.checkBoxForm = this.fb.group({  // create a fb.group for every Object 
      id: null,
      numeral: null,
      type: 'checkbox',
      text: '',
      description:'',
      icon:'check-icon',
      note_text:'',
      options: this.fb.array(['']),
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

  ngOnInit() {
    this.loadFromLocalStorage();
    this.initializeFormValues();
    
    this.checkBoxForm.valueChanges.subscribe(value => {
      localStorage.setItem('checkBoxForm', JSON.stringify(this.checkBoxForm.value));
    });
  }

  


  saveToLocalStorage() {
    localStorage.setItem('checkBoxForm', JSON.stringify(this.checkBoxForm.value));
  }

  loadFromLocalStorage() {
    const savedForm = localStorage.getItem('checkBoxForm');
    if(savedForm){
      const parsedForm = JSON.parse(savedForm);
      this.checkBoxForm.patchValue(parsedForm);
    }
  }

  initializeFormValues(): void {
    const settings = this.checkBoxForm.get('settings') as FormGroup;
    this.anotherField = settings.get('another_field')?.value;
    this.addNote = settings.get('add_note')?.value;
    this.defectedAnswer = settings.get('defected_answer')?.value;
    this.required = settings.get('required')?.value;
    this.saveToLocalStorage();
  }

  getToggleValues(values : any): void {

    let settings = this.checkBoxForm.get('settings') as FormGroup;  // access to a specific property.   
     
     if (settings.controls.hasOwnProperty(values.name)) { // verify a property 

      if(this.checkInfo(values)){
        settings.patchValue({ [values.name]: values.state }); // modify value
        this.initializeFormValues();
      }else{
        return;
      }
    } 
  }

  checkInfo(values:any):boolean {
    if(values.name === 'add_note' && values.state === false){
      this.checkBoxForm.patchValue({ ['note_text']: '' }); 
    }
    return true;
  }


  getOptionValue(option : string): void {

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
    if(index == 0 && this.optionsAnswer.length <= 1){
      this.options.at(0).setValue('');
      const settings = this.checkBoxForm.get('settings') as FormGroup;
      settings.patchValue({ ['answer_value']: '' });
      this.optionsAnswer = [];
      settings.patchValue({ ['defected_answer']: false });
      this.initializeFormValues();
      this.loadFromLocalStorage();
    }else{
      this.options.removeAt(index);
      this.optionsAnswer.splice(index, 1); 
      this.childComponent?.verifySelectedOption(); 
    }
  }

  onChangeSection():void {
    this.changeSection = !this.changeSection;
  }

  onSubmit() : void {
   if(this.checkBoxForm.valid){
    console.log(this.checkBoxForm.value);
   }
  }

}
