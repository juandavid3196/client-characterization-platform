import { Component, EventEmitter, Input, Output, QueryList, ViewChildren } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { ToggleButtonComponent } from 'src/app/shared/components/toggle-button/toggle-button.component';
import { DataBankService } from '../../services/data-bank.service';

interface Option {
  rows: string[];
  selected: boolean;
  text: string;
  type: string;
}

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
  noVisibleField : boolean =  false;
  selectedOptionIndex : number = 0; 
  @ViewChildren('appToggleButton') toggleButtons!: QueryList<ToggleButtonComponent>;
  @Input() numeral !: number;
  @Output() dataTable =  new EventEmitter<any>();

  //Dropdown variables
  select_click: boolean = false;
  caret_rotate: boolean = false;
  menu_open: boolean = false;
  selectedOption : string = '';
  DropOptions : any[] = [];
  rowsSection: string = 'basic';
  
  constructor(private fb:FormBuilder, private dataBankService : DataBankService){
    this.tableForm = this.fb.group({  // create a fb.group for every Object 
      id: null,
      numeral: null,
      type: 'table',
      text: '',
      description:'',
      icon:'table-icon',
      addedToBank:false,
      note_text:'',
      no_visible_title:'',
      no_visible_rows: this.fb.array([this.fb.control('')]),
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
    localStorage.clear();
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
      selected: new FormControl(false),
      rows: this.fb.array([this.fb.control('')])
    });
  }

  
  get options(): FormArray {
    return this.tableForm.get('options') as FormArray;
  }

  get no_visible_rows(): FormArray {
    return this.tableForm.get('no_visible_rows') as FormArray;
  }

  get rows(): FormArray {
    return this.options.at(this.selectedOptionIndex).get('rows') as FormArray;
  }
  
  saveToLocalStorage() {
    localStorage.setItem('tableForm', JSON.stringify(this.tableForm.value));
  }


  loadFromLocalStorage() {
    const savedForm = localStorage.getItem('tableForm');
    if (savedForm) {
      const parsedForm = JSON.parse(savedForm);
      this.tableForm.patchValue(parsedForm);
  
      // cargar opciones
      const optionsArray = this.tableForm.get('options') as FormArray;
  
      // Limpiar opciones existentes
      while (optionsArray.length) {
        optionsArray.removeAt(0);
      }
  
      // Cargar opciones desde el almacenamiento local
      parsedForm.options.forEach((option: any) => {
        const optionGroup = this.createOption(); // Crear un nuevo FormGroup para cada opción
        optionGroup.patchValue(option); // Parchar el FormGroup con los valores guardados
  
        // Limpiar y cargar filas (rows) si existen
        const rowsArray = optionGroup.get('rows') as FormArray;
        if (option.rows && Array.isArray(option.rows)) {
          while (rowsArray.length) {
            rowsArray.removeAt(0);
          }
          option.rows.forEach((row: any) => {
            rowsArray.push(this.fb.control(row));
          });
        }
  
        // Limpiar y cargar filas no visibles (no_visible_rows) si existen
        const noVisibleRowsArray = this.tableForm.get('no_visible_rows') as FormArray;
       
          while (noVisibleRowsArray.length) {
            noVisibleRowsArray.removeAt(0);
          }
          parsedForm.no_visible_rows.forEach((noVisibleRow: any) => {
            noVisibleRowsArray.push(this.fb.control(noVisibleRow));
          });
        
  
        optionsArray.push(optionGroup);
      });
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

  

   //Options Methods
  
   updateAnswer(event:any,index:number): void {

    const currentValues = this.options.at(index).value;
    this.options.at(index).patchValue({
      text: event.target.value, 
      type:currentValues.type,
      selected:currentValues.selected,
      rows: currentValues.rows
    });
    this.saveToLocalStorage();
   
    if (this.options.length > 0 && this.options.at(0)?.get('text')?.value === '' && this.options.length === 1) {
      this.removeOption(0);
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

  handleOptionsType(index:number, type:string):void{
    const currentValues = this.options.at(index).value;
    this.options.at(index).patchValue({ text: currentValues.text, type:type, selected:true, rows: currentValues.rows});
    this.saveToLocalStorage();
  }
  
  removeOption(index: number): void {
    if (this.options.length === 1) {
      const optionGroup = this.options.at(0) as FormGroup;
      optionGroup.patchValue({
        text: '',
        type: '',
        selected: false,
      });
      const rowsArray = optionGroup.get('rows') as FormArray;
      while (rowsArray.length) {
        rowsArray.removeAt(0);
      }
      rowsArray.push(this.fb.control(''));
      this.DropOptions = [...this.options.value];
    } else {
        this.options.removeAt(index);
        this.DropOptions = [...this.options.value];
    }

    if(this.selectedOptionIndex === index){
      this.selectedOption = '';
    }
    
    this.saveToLocalStorage();
  }


  getTextOptions(): string[] {
    return this.options.controls
      .filter(control => control.get('type')?.value === 'text')
      .map(control => control.get('text')?.value);
  }

  //No visible-Column Methods
  
  addNoVisibleColumn() : void {
    this.noVisibleField = true;
  }

  removeVisibleColumn():void {
    this.noVisibleField = false;
    this.tableForm.patchValue({ ['no_visible_title']: '' }); 
    this.clearNoVisibleRows();
    this.rowsSection = 'basic';
    this.saveToLocalStorage();
  }

  clearNoVisibleRows():void {
    const noVisibleRowsArray = this.tableForm.get('no_visible_rows') as FormArray;
    while (noVisibleRowsArray.length) {
      noVisibleRowsArray.removeAt(0);
    }
    noVisibleRowsArray.push(this.fb.control(''));
  }

  updateNoVisibleValue(event:any):void {
    this.tableForm.patchValue({['no_visible_title']:event.target.value});  
    if(event.target.value === ''){
      this.rowsSection = 'basic';
    }  
    this.saveToLocalStorage();
  }

  addNoVisibleRows(): void {
      this.rowsSection = 'no-visible';
  }

  addVisibleRow(optionIndex: number): void {
    this.no_visible_rows.insert(optionIndex + 1,this.fb.control(''));
    this.saveToLocalStorage();
  }

  removeVisibleRow(optionIndex: number): void {
    if (this.no_visible_rows.length === 1) {
      this.no_visible_rows.at(0).setValue('');
    }else{
      this.no_visible_rows.removeAt(optionIndex);
    }
    this.saveToLocalStorage();
  }

  updateVisibleRow(optionIndex:number,event:any):void {
    this.no_visible_rows.at(optionIndex).setValue(event.target.value);
    this.saveToLocalStorage();
  } 
  

  //Rows methods

  addRow(optionIndex: number, rowIndex:number): void {
    this.getRows(optionIndex).insert(rowIndex + 1,this.fb.control(''));
    this.saveToLocalStorage();
  }

  removeRow(optionIndex: number, rowIndex: number): void {
    if (this.rows.length === 1) {
      this.rows.at(0).setValue('');
    }else{
      this.getRows(optionIndex).removeAt(rowIndex);
    }
    this.saveToLocalStorage();
  }

  updateRow(optionIndex:number,event:any):void {
    this.getRows(optionIndex).setValue(event.target.value);
    this.saveToLocalStorage();
  } 

  getRows(index: number): FormArray {
    return (this.options.at(index) as FormGroup).get('rows') as FormArray;
  }


//Dropdow methods

toggleSelect() : void {
  this.select_click = !this.select_click;
  this.caret_rotate = !this.caret_rotate;
  if(this.select_click){
    this.DropOptions =  [...this.options.value];
  }
  this.rowsSection = 'basic';
}

handleOption(option: any,index:number):void {
  this.select_click = !this.select_click;
  this.caret_rotate = !this.caret_rotate;
  this.selectedOption = option.text;
  this.selectedOptionIndex = index; 
  this.loadFromLocalStorage();
}

//table Info

getMaxLengthValue(): number[] {
  const options = this.tableForm.value.options as Option[];
  const maxOptionsRows = Math.max(...options.map(option => option.rows.length));
  const maxVisibleRows = this.tableForm.value.no_visible_rows.length;
  const maxRows = Math.max(maxOptionsRows, maxVisibleRows);
  return Array.from({ length: maxRows }, (_, i) => i);
}

 

 // Form Methods

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
    no_visible_rows: this.fb.array([this.fb.control('')]),
    options: this.fb.array([
      this.createOption()
    ]),
    settings: { 
      question_multimedia: '',
      options_multimedia: '',
      required: false,
      add_note: false,
    }
  });

  this.selectedOptionIndex = 0;
  this.selectedOption = '';
  this.DropOptions = [];

  this.initializeFormValues();
  this.loadFromLocalStorage();
  this.reloadAllControls();
 
}


  // Questions bank methods

  addToBank() : void {
    this.tableForm.patchValue({['addedToBank']:true});
    this.dataBankService.addObject(this.tableForm.value);
  }

  onSubmit() : void {
    if(this.tableForm.valid){
      this.dataTable.emit(this.tableForm.value);
    }
   }


  ngOnDestroy(): void {
    localStorage.removeItem('tableForm');
  }

}
