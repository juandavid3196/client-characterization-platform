import { Component, ElementRef, EventEmitter, Input, Output, QueryList, SimpleChanges, ViewChild, ViewChildren} from '@angular/core';
import { FormBuilder, FormGroup} from '@angular/forms';
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
  optionsMessage : boolean = false;
  changeSection: boolean = true;
  spinner: boolean = false;
  dashboardOptions : any[] = [];
  formSubscription: Subscription | undefined;
  sliderValue: number = 5;
  sliderOptions : number[] = [];
  sliderMouseOptions : number[] = [];
  showValue : boolean = false;
  openVideoWindow : boolean = false;
  videoUrlType : string = '';


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
      scale_value : 5,
      settings: this.fb.group({  
        question_multimedia: '',
        options_multimedia: '',
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

  saveScaleData(): void {

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
      const settings = this.scaleForm.get('settings') as FormGroup;
      this.qMessage = (settings.get('question_multimedia')?.value) ? true : false;
      this.setSliderSteps(this.scaleForm.value.scale_value);
      this.sliderValue = this.scaleForm.value.scale_value;
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
        if(values.name === 'defected_answer' && values.state === false){
          settings.patchValue({ ['answer_value']: '' });
        }
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
     if(option !== ''){
       this.mouseOver(parseInt(option));
     }else {
      this.cleansliderOptions();
     }
  }

  setSliderSteps(steps:number) : void {
    let item = 1;
    this.sliderOptions  = [];
    for (let index = 0; index < steps; index++) {
      this.sliderOptions.push(item);
      item += 1;
    }
  }

  onSliderInput(event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    this.sliderValue = parseInt(inputElement.value);
    let item = 1;
    this.sliderOptions  = [];
    for (let index = 0; index < this.sliderValue; index++) {
      this.sliderOptions.push(item);
      item += 1;
    }
    this.scaleForm.patchValue({ ['scale_value']: this.sliderValue });
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
    if(item <= this.scaleForm.value.settings.answer_value){
      return true;
    }
    return false;
  }

  cleansliderOptions() : void {
    this.sliderMouseOptions = [];
  }


  labelTitle(item: number): string {
    let label = '';
    const settings = this.scaleForm.get('settings') as FormGroup;
    if(item == 1 && this.sliderOptions.length > 1){
      label = settings.get('left_label')?.value;
    }else if(this.sliderOptions.length >= 3 && item === ((this.sliderOptions.length / 2) + 0.5)){
      label  = settings.get('center_label')?.value;
    }else if(item === this.sliderOptions.length) {
      label  = settings.get('right_label')?.value;
    }

    return label;
  }


  //Video URL

  addVideoUrl(controlName: string): void {
    this.loadUrlsData();
    this.videoUrlType = controlName;
    this.openVideoWindow = true;
   }
 
 
   loadUrlsData() : void {
     const storedQuestions = this.dashboardlsService.getDashboardOptions();
     
     if (storedQuestions && this.elementData.id) {
       this.dashboardOptions = storedQuestions;
       const element = storedQuestions.find((e: any) => e.id === this.elementData.id);
   
       if (element) {
         this.scaleForm.patchValue(element);
         const settings = this.scaleForm.get('settings') as FormGroup;
         this.qMessage = (settings.get('question_multimedia')?.value) ? true : false;
       }
     }
   }
 
   closeVideoWindow() : void {
     this.openVideoWindow = false;
   }

  resetInputFile(controlName:string) {
    const settings = this.scaleForm.get('settings') as FormGroup;
    settings.patchValue({ [controlName]: '' });
    if(controlName == 'question_multimedia'){
      this.qMessage = !this.qMessage;
    }
  }

  onChangeSection():void {
    this.changeSection = !this.changeSection;
  }

  onResetForm(): void {
    this.resetscaleForm();
    this.resetFormState();
  }
  
  resetscaleForm(): void {
    this.scaleForm.reset({
      id: this.elementData.id || '',
      numeral: this.elementData.numeral || '',
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
  
  
  resetFormState(): void {
    this.sliderOptions = [1,2,3,4,5];
    this.qMessage = false;
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
    this.saveScaleData();
    this.refreshList.emit();
   }
  }

  ngOnDestroy(): void {
    if (this.formSubscription) {
      this.formSubscription.unsubscribe();
      this.saveScaleData();
      this.onResetForm();
    }
  }
}
