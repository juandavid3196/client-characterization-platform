import { Component, Input, QueryList, ViewChildren } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { ToggleButtonComponent } from 'src/app/shared/components/toggle-button/toggle-button.component';

@Component({
  selector: 'app-table-question',
  templateUrl: './table-question.component.html',
  styleUrls: ['./table-question.component.scss']
})
export class TableQuestionComponent {

  tableForm !: FormGroup;
  changeSection: boolean = true;
  addNote: boolean = false;
  required: boolean =  false;
  qMessage : boolean = false;
  aMessage : boolean = false;
  optionsTable : String[] = [];
  optionsInfo: any[] = [{
   
    index: null
  }]
  rowsInfo: any[] = [
    {
      text:'',
      index: null,
      rows : []
    }
  ]
  noVisibleField : boolean =  false;
  @ViewChildren('appToggleButton') toggleButtons!: QueryList<ToggleButtonComponent>;
  @Input() numeral !: number;


  constructor(private fb:FormBuilder){
    this.tableForm = this.fb.group({  // create a fb.group for every Object 
      id: null,
      numeral: null,
      type: 'table',
      text: '',
      description:'',
      icon:'table-icon',
      note_text:'',
      no_visible_title:'',
      options: this.fb.array([
        this.createOption()
      ]),
      settings: this.fb.group({  
        question_multimedia: '',
        options_multimedia: '',
        required: false,
        add_note: false,
      })
    });

  }

  ngOnInit() {
    this.loadFromLocalStorage();
    this.initializeFormValues();
    
    this.tableForm.valueChanges.subscribe(value => {
      localStorage.setItem('tableForm', JSON.stringify(this.tableForm.value));
    });
  }

  createOption(): FormGroup {
    return this.fb.group({
      text: new FormControl(''),
      type: new FormControl(''),
      selected: new FormControl(false)
    });
  }
  
  get options(): FormArray {
    return this.tableForm.get('options') as FormArray;
  }

  saveToLocalStorage() {
    localStorage.setItem('tableForm', JSON.stringify(this.tableForm.value));
  }

  loadFromLocalStorage() {
    const savedForm = localStorage.getItem('tableForm');
    if(savedForm){
      const parsedForm = JSON.parse(savedForm);
      this.tableForm.patchValue(parsedForm);
    }
  }

  initializeFormValues(): void {
    const settings = this.tableForm.get('settings') as FormGroup;
    this.addNote = settings.get('add_note')?.value;
    this.required = settings.get('required')?.value;
    if(this.tableForm.get('no_visible_title')?.value){
      this.noVisibleField = true;
    }
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

    let settings = this.tableForm.get('settings') as FormGroup;  // access to a specific property.   
     
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
      this.tableForm.patchValue({ ['note_text']: '' }); 
    }
    return true;
  }


  onChangeSection():void {
    this.changeSection = !this.changeSection;
  }
  
  


  onFileChange(event: any, controlName: string): void {
    const file = event.target.files[0];
    if (file) {
      const settings = this.tableForm.get('settings') as FormGroup;
      settings.patchValue({ [controlName]: file });

      if(controlName == 'question_multimedia'){
        this.qMessage = !this.qMessage;
      }else if(controlName == 'options_multimedia'){
        this.aMessage = !this.aMessage;
      }
    }
  }

  resetInputFile(controlName:string) {
    const settings = this.tableForm.get('settings') as FormGroup;
    settings.patchValue({ [controlName]: '' });
    if(controlName == 'question_multimedia'){
      this.qMessage = !this.qMessage;
    }else if(controlName == 'options_multimedia'){
      this.aMessage = !this.aMessage;
    }
  }

  
  updateAnswer(event:any,index:number): void {
    const currentValues = this.options.at(index).value;
    this.options.at(index).patchValue({
      text: event.target.value, 
      type:currentValues.type,
      selected:currentValues.selected });
    this.saveToLocalStorage();
   
    if (this.options.length > 0 && this.options.at(0)?.get('text')?.value === '' && this.options.length === 1) {
      this.removeOption(0);
    }    
    console.log(this.options);
    
  }

  updateNoVisibleValue():void {
    if(this.tableForm.get('no_visible_value')?.value != ''){
      this.saveToLocalStorage();
    }
  }

  addOption(i:number,position:string | null): void {

    if(i === 0 && position === 'back'){
      this.options.insert(i,this.createOption());
    }else{
      this.options.insert(i + 1 ,this.createOption());
    }
    this.saveToLocalStorage();
  }

  
  removeOption(index: number): void {
    if (index === 0 && this.options.length <= 1) {
      this.options.at(0).setValue({
        text: '',
        type: '',
        selected: false
      });
      this.optionsTable = [];
      this.optionsInfo = [];
    } else {
      if (index === 0) {
        this.options.removeAt(index);
        this.optionsInfo.splice(index, 1);
        this.optionsTable.splice(index,1);
        
      } else {
        this.options.removeAt(index);
        this.optionsTable.pop();
        this.optionsInfo.pop();
      }
    }

    this.saveToLocalStorage();
    this.loadFromLocalStorage();
  }


  handleOptionsType(index:number, type:string):void{
    const currentValues = this.options.at(index).value;
    this.options.at(index).patchValue({ text: currentValues.text, type:type, selected:true});
  }

  getTextValues(array:any[]): string[] {
      return array
          .filter(item => item.type === 'Texto')
          .map(item => item.text);
  }
  
  addNoVisibleColumn() : void {
    this.noVisibleField = true;
  }

  removeVisibleColumn():void {
    this.noVisibleField = false;
    this.tableForm.patchValue({ ['no_visible_title']: '' }); 

  }
  
  onResetForm():void {
    this.tableForm.reset({
      id: null,
      numeral: null,
      type: 'table',
      text: '',
      description: '',
      icon: 'table-icon',
      note_text: '',
      no_visible_title:'',
      options: this.fb.array([this.fb.control('')]),
      settings: { 
        question_multimedia: '',
        options_multimedia: '',
        required: false,
        add_note: false,
      }
    });

    this.optionsTable = [];
  
    this.initializeFormValues();
    this.loadFromLocalStorage();
    this.reloadAllControls();
   
}



  onSubmit() : void {
    if(this.tableForm.valid){
      console.log(this.tableForm.value);
    }
   }


}
