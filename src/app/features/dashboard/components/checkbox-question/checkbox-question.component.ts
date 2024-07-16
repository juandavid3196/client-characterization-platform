import { Component, Input, QueryList, ViewChild, ViewChildren} from '@angular/core';
import { FormBuilder, FormGroup, FormArray } from '@angular/forms';
import {FilterSelectComponent} from '../../../../shared/components/filter-select/filter-select.component'
import {ToggleButtonComponent} from '../../../../shared/components/toggle-button/toggle-button.component'

@Component({
  selector: 'app-checkbox-question',
  templateUrl: './checkbox-question.component.html',
  styleUrls: ['./checkbox-question.component.scss']
})
export class CheckboxQuestionComponent {

  @ViewChild('appFilterComponent') FilterComponent: FilterSelectComponent | undefined;
  @ViewChild('appToggleButtonDefectedA') ToggleComponent: ToggleButtonComponent | undefined;
  @ViewChildren('appToggleButton') toggleButtons!: QueryList<ToggleButtonComponent>;
  
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
  optionsMessage : boolean = false;

  @Input() numeral!:number;

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

       // cargar opciones
      const optionsArray = this.checkBoxForm.get('options') as FormArray;
      while (optionsArray.length) {
        optionsArray.removeAt(0);
      }
      parsedForm.options.forEach((option: string) => {
        optionsArray.push(this.fb.control(option));
      });
      
      this.optionsAnswer = parsedForm.options.filter((option: string | null) => option != null && option !== '') || [];      
     
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


  
  reloadAllControls() {
    if(this.toggleButtons){
      this.toggleButtons.forEach(toggleButton => {
        toggleButton?.reloadComponent();
      });
  }
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
      this.saveToLocalStorage();
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
    this.saveToLocalStorage();
  }

  updateAnswer(): void {
    this.optionsAnswer = this.options.controls.map(control => control.value);
    this.saveToLocalStorage();
    if(this.optionsAnswer[0] === ''){
      this.removeOption(0);
    }
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
      this.ToggleComponent?.reloadComponent();
      this.optionsMessage = false;
    }else{
      this.options.removeAt(index);
      this.optionsAnswer.splice(index, 1); 
      this.FilterComponent?.verifySelectedOption(); 
    }
  }

  checkOptionsLength(): void {
    this.optionsMessage = !this.optionsMessage;
  }

  onChangeSection():void {
    this.changeSection = !this.changeSection;
  }

  onResetForm():void {
      this.checkBoxForm.reset({
        id: null,
        numeral: null,
        type: 'checkbox',
        text: '',
        description: '',
        icon: 'check-icon',
        note_text: '',
        options: this.fb.array([this.fb.control('')]),
        settings: {
          another_field: false,
          question_multimedia: '',
          options_multimedia: '',
          required: false,
          defected_answer: false,
          answer_value: '',
          add_note: false,
        }
      });

      this.optionsAnswer = [];
    
      this.initializeFormValues();
      this.loadFromLocalStorage();
      this.ToggleComponent?.reloadComponent();
      this.reloadAllControls();
     
  }

  onSubmit() : void {
   if(this.checkBoxForm.valid){
    console.log(this.checkBoxForm.value);
   }
  }

}
