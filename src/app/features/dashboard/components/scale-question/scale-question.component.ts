import { Component, ElementRef, EventEmitter, Input, Output, QueryList, SimpleChanges, ViewChild, ViewChildren} from '@angular/core';
import { FormBuilder, FormGroup, FormArray } from '@angular/forms';
import {FilterSelectComponent} from '../../../../shared/components/filter-select/filter-select.component'
import {ToggleButtonComponent} from '../../../../shared/components/toggle-button/toggle-button.component'
import { DataBankService } from '../../services/data-bank.service';
import { Subscription } from 'rxjs';
import { DashboardlsService } from '../../services/dashboardls.service';

@Component({
  selector: 'app-scale-question',
  templateUrl: './scale-question.component.html',
  styleUrls: ['./scale-question.component.scss']
})
export class ScaleQuestionComponent {
  @ViewChild('appFilterComponent') FilterComponent: FilterSelectComponent | undefined;
  @ViewChild('appToggleButtonDefectedA') ToggleComponent: ToggleButtonComponent | undefined;
  @ViewChildren('appToggleButton') toggleButtons!: QueryList<ToggleButtonComponent>;
  
  scaleForm : FormGroup;
  addNote : boolean =  false;
  defectedAnswer : boolean = false;
  anotherField : boolean = false;
  required :boolean = false;
  apply : boolean = false;
  qMessage : boolean = false;
  aMessage : boolean = false;
  blocked : boolean =  false;
  changeSection: boolean = true;
  optionsMessage : boolean = false;
  spinner: boolean = false;
  dashboardOptions : any[] = [];
  formSubscription: Subscription | undefined;
  sliderValue: number = 5;
  sliderOPtions : number[] = [1,2,3,4,5];
  sliderMouseOptions : number[] = [];
  showValue : boolean = false;


  @Input() elementData : any = {};
  @Output() refreshList =  new EventEmitter();

  @ViewChild('slideValue') slideValueElement!: ElementRef;

  constructor(private fb:FormBuilder,
     private dataBankService :DataBankService, 
     private dashboardlsService : DashboardlsService ){
    this.scaleForm = this.fb.group({  // create a fb.group for every Object 
      id: '',
      numeral: null,
      type: 'scale',
      text: '',
      description:'',
      icon:'scale-opinion-icon',
      note_text:'',
      addedToBank: false,
      scale_value : 0,
      settings: this.fb.group({  
        question_multimedia: '',
        options_multimedia: '',
        steps: 0,
        left_label : '',
        center_label:'',
        right_label:'',
        answer_value: '',
        required: false,
        defected_answer: false,
        add_note: false,
        apply:false,
      })
    });
  }

  ngOnInit() {
    this.loadFromDataObject();
    this.initializeFormValues();
    this.formSubscription = this.scaleForm.valueChanges.subscribe(value => {
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

  saveCheckBoxData(): void {

    const storedQuestions = this.dashboardlsService.getDashboardOptions();
    
    if (storedQuestions) {
     
      const index = storedQuestions.findIndex((e:any)  => e.id === this.scaleForm.value.id);
      
      if (index !== -1) {
  
        storedQuestions[index] = { ...storedQuestions[index], ...this.scaleForm.value };
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
      this.scaleForm.patchValue(element);
      this.spinner =  false;
    }else {
      this.spinner = true;
    }  
  }
    this.spinner =  false;
  }
  

  initializeFormValues(): void {
    const settings = this.scaleForm.get('settings') as FormGroup;
    this.addNote = settings.get('add_note')?.value;
    this.defectedAnswer = settings.get('defected_answer')?.value;
    this.required = settings.get('required')?.value;
    this.apply = settings.get('apply')?.value;
  }


  
  reloadAllControls() {
    if(this.toggleButtons){
      this.toggleButtons.forEach(toggleButton => {
        toggleButton?.reloadComponent();
      });
  }
  }

  getToggleValues(values : any): void {

    let settings = this.scaleForm.get('settings') as FormGroup;  // access to a specific property.   
     
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
      this.scaleForm.patchValue({ ['note_text']: '' }); 
    }
    return true;
  }


getOptionValue(option : string): void {

    let settings = this.scaleForm.get('settings') as FormGroup;   
    
    if (settings.controls.hasOwnProperty('answer_value')) {
      settings.patchValue({ ['answer_value']: option });
     }
     console.log(option);
     if(option !== ''){
       this.mouseOver(parseInt(option));
     }else {
      this.cleanSliderOptions();
     }
  }

  onSliderInput(event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    this.sliderValue = parseInt(inputElement.value);
    let item = 1;
    this.sliderOPtions  = [];
    for (let index = 0; index < this.sliderValue; index++) {
      this.sliderOPtions.push(item);
      item += 1;
    }
    let numberOption = parseInt(inputElement.value);
    this.slideValueElement.nativeElement.style.left = (numberOption === 1) ? (numberOption * 0) :  ( (numberOption * 10) - 10) + '%';
    this.showValue = true;
  }

  removeValue() : void {
    this.showValue = false;
  }

  verifyOptionsValue() : void {
    this.FilterComponent?.verifySelectedOption(); 
  }

  mouseOver(item:number) : void {
    for (let index = 1; index <= item; index++) {
      this.sliderMouseOptions.push(index);  
    }
  } 

  verifyIndex(item:number) : boolean {
    if(this.sliderMouseOptions.includes(item)){
      return true;
    }
    return false;
  }

  cleanSliderOptions() : void {
    this.sliderMouseOptions = [];
  }


  labelTitle(item: number): string {
    let label = '';
    const settings = this.scaleForm.get('settings') as FormGroup;
    if(item == 1 && this.sliderOPtions.length > 1){
      label = settings.get('left_label')?.value;
    }else if(this.sliderOPtions.length >= 3 && item === ((this.sliderOPtions.length / 2) + 0.5)){
      label  = settings.get('center_label')?.value;
    }else if(item === this.sliderOPtions.length) {
      label  = settings.get('right_label')?.value;
    }

    return label;
  }

  onFileChange(event: any, controlName: string): void {
    const file = event.target.files[0];
    if (file) {
      const settings = this.scaleForm.get('settings') as FormGroup;
      settings.patchValue({ [controlName]: file });

      if(controlName == 'question_multimedia'){
        this.qMessage = !this.qMessage;
      }else if(controlName == 'options_multimedia'){
        this.aMessage = !this.aMessage;
      }
    }
  }

  resetInputFile(controlName:string) {
    const settings = this.scaleForm.get('settings') as FormGroup;
    settings.patchValue({ [controlName]: '' });
    if(controlName == 'question_multimedia'){
      this.qMessage = !this.qMessage;
    }else if(controlName == 'options_multimedia'){
      this.aMessage = !this.aMessage;
    }
  }



  onChangeSection():void {
    this.changeSection = !this.changeSection;
  }

  onResetForm(): void {
    this.resetscaleForm();
    this.resetFormState();
    console.log(this.scaleForm.value);
  }
  
  resetscaleForm(): void {
    this.scaleForm.reset({
      id: this.elementData.id || '',
      numeral: null,
      type: 'scale',
      text: '',
      description:'',
      icon:'scale-icon-opinion',
      note_text:'',
      addedToBank: false,
      scale_value : 0,
      settings: this.fb.group({  
        question_multimedia: '',
        options_multimedia: '',
        steps: 0,
        left_label : '',
        center_label:'',
        right_label:'',
        answer_value: '',
        required: false,
        defected_answer: false,
        add_note: false,
        apply:false,
      })
    }); 
  }
  
  
  resetFormState(): void {
    this.sliderOPtions = [1,2,3,4,5];
    this.initializeFormValues();
    this.ToggleComponent?.reloadComponent();
    this.reloadAllControls();
  }
  
  addToBank() : void {
    this.scaleForm.patchValue({ ['addedToBank']: true });
    this.dataBankService.createBank(this.scaleForm.value).subscribe(
      (response) => {
        console.log('Bank created', response);
      },
      (error) => {
        console.error('Error creating bank', error);
      }
    );
  }



  onSubmit() : void {
   if(this.scaleForm.valid){
    this.saveCheckBoxData();
    this.refreshList.emit();
   }
  }

  ngOnDestroy(): void {
    if (this.formSubscription) {
      this.formSubscription.unsubscribe();
      this.saveCheckBoxData();
      this.onResetForm();
    }
  }
}
