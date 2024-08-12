import { Component, EventEmitter, Input, Output, QueryList, SimpleChanges, ViewChild, ViewChildren} from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import {FilterSelectComponent} from '../../../../shared/components/filter-select/filter-select.component'
import {ToggleButtonComponent} from '../../../../shared/components/toggle-button/toggle-button.component'
import { DataBankService } from '../../services/data-bank.service';
import { Subscription } from 'rxjs';
import { DashboardlsService } from '../../services/dashboardls.service';

@Component({
  selector: 'app-open-question',
  templateUrl: './open-question.component.html',
  styleUrls: ['./open-question.component.scss']
})
export class OpenQuestionComponent {
  @ViewChildren('appToggleButton') toggleButtons!: QueryList<ToggleButtonComponent>;
  
  openForm : FormGroup;
  addNote : boolean =  false;
  required :boolean = false;
  qMessage : boolean = false;
  changeSection: boolean = true;
  optionsMessage : boolean = false;
  optionsMenu :  boolean = false;
  spinner: boolean = false;
  dashboardOptions : any[] = [];
  formSubscription: Subscription | undefined;
  

  @Input() elementData : any = {};
  @Output() refreshList =  new EventEmitter();

  constructor(private fb:FormBuilder,
     private dataBankService :DataBankService, 
     private dashboardlsService : DashboardlsService ){
   
      this.openForm = this.fb.group({  // create a fb.group for every Object 
      id: '',
      numeral: null,
      type: 'open',
      text: '',
      description:'',
      icon:'open-q-icon',
      note_text:'',
      text_answer:'',
      addedToBank: false,
      settings: this.fb.group({  
        question_multimedia: '',
        required: false,
        add_note: false,
      })
    });
  }

  ngOnInit() {
    this.loadFromDataObject();
    this.initializeFormValues();
    this.formSubscription = this.openForm.valueChanges.subscribe(value => {
      if (this.elementData.id !== undefined) {
        this.updateDashboardOptions(value);
      }
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['elementData'].currentValue.id) {
      this.loadFromDataObject();
    }
  }
  

  private updateDashboardOptions(value: any): void {
    if (this.elementData.id !== undefined) {
      const index = this.dashboardOptions.findIndex(e => e.id === this.elementData.id);
      if (index !== -1) {
        this.dashboardOptions[index] = { ...this.dashboardOptions[index], ...value };
        this.dashboardlsService.saveDashboardOptions(this.dashboardOptions);
      }
    }
  }

  saveOpenData(): void {

    const storedQuestions = this.dashboardlsService.getDashboardOptions();
    
    if (storedQuestions) {
     
      const index = storedQuestions.findIndex((e:any)  => e.id === this.openForm.value.id);
      
      if (index !== -1) {
  
        storedQuestions[index] = { ...storedQuestions[index], ...this.openForm.value };
        this.dashboardlsService.saveDashboardOptions(storedQuestions);
        console.log('Questions updated successfully in Local Storage');
      } else {
        console.error('Question not found in Local Storage');
      }
    } else {
      console.error('No questions found in Local Storage');
    }
  }
  

  loadFromDataObject(): void {
    
    const storedQuestions = this.dashboardlsService.getDashboardOptions();


    if (storedQuestions && this.elementData.id) {

      this.dashboardOptions = storedQuestions;
      const element = storedQuestions.find((e: any) => e.id === this.elementData.id);
      if(element){
      this.openForm.patchValue(element);
      this.spinner =  false;
    }else {
      this.spinner = true;
    }  
  }
    this.spinner =  false;
  }
  

  initializeFormValues(): void {
    const settings = this.openForm.get('settings') as FormGroup;
    this.addNote = settings.get('add_note')?.value;
    this.required = settings.get('required')?.value;
  }


  
  reloadAllControls() {
    if(this.toggleButtons){
      this.toggleButtons.forEach(toggleButton => {
        toggleButton?.reloadComponent();
      });
  }
  }

  getToggleValues(values : any): void {

    let settings = this.openForm.get('settings') as FormGroup;  // access to a specific property.   
     
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
      this.openForm.patchValue({ ['note_text']: '' }); 
    }
    return true;
  }



  onFileChange(event: any, controlName: string): void {
    const file = event.target.files[0];
    if (file) {
      const settings = this.openForm.get('settings') as FormGroup;
      settings.patchValue({ [controlName]: file });
      this.qMessage = !this.qMessage;
    }
  }

  resetInputFile(controlName:string) {
    const settings = this.openForm.get('settings') as FormGroup;
    settings.patchValue({ [controlName]: '' });
    this.qMessage = !this.qMessage;
  }



  onChangeSection():void {
    this.changeSection = !this.changeSection;
  }

  onResetForm(): void {
    this.resetopenForm();
    this.resetFormState();
  }
  
  resetopenForm(): void {
    this.openForm.reset({
      id: this.elementData.id || '',
      numeral: null,
      type: 'open',
      text: '',
      description:'',
      icon:'open-q-icon',
      note_text:'',
      addedToBank: false,
      settings: this.fb.group({  
        question_multimedia: '',
        required: false,
        add_note: false,
      })
    }); 
  }
  
  
  resetFormState(): void {
    this.initializeFormValues();
    this.reloadAllControls();
  }
  
  addToBank() : void {
    this.openForm.patchValue({ ['addedToBank']: true });
    this.dataBankService.createBank(this.openForm.value).subscribe(
      (response) => {
        console.log('Bank created', response);
      },
      (error) => {
        console.error('Error creating bank', error);
      }
    );
  }



  onSubmit() : void {
   if(this.openForm.valid){
    this.saveOpenData();
    this.refreshList.emit();
   }
  }

  ngOnDestroy(): void {
    if (this.formSubscription) {
      this.formSubscription.unsubscribe();
      this.saveOpenData();
      this.onResetForm();
    }
  }
}
