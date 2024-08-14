import { Component, EventEmitter, Input, Output, QueryList, SimpleChanges, ViewChild, ViewChildren} from '@angular/core';
import { FormBuilder, FormGroup, FormArray } from '@angular/forms';
import {FilterSelectComponent} from '../../../../shared/components/filter-select/filter-select.component'
import {ToggleButtonComponent} from '../../../../shared/components/toggle-button/toggle-button.component'
import { DataBankService } from '../../services/data-bank.service';
import { Subscription } from 'rxjs';
import { DashboardlsService } from '../../services/dashboardls.service';

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
  addNote : boolean = false;
  defectedAnswer : boolean = false;
  anotherField : boolean =  false;
  required :boolean =  false;
  optionsAnswer : string[] = [];
  qMessage : boolean = false;
  aMessage : boolean = false;
  blocked : boolean =  false;
  changeSection: boolean = true;
  optionsMessage : boolean = false;
  spinner: boolean = false;
  dashboardOptions : any[] = [];
  formSubscription: Subscription | undefined;
  openVideoWindow : boolean = false;
  videoUrlType : string = '';

  @Input() elementData : any = {};
  @Output() refreshList =  new EventEmitter();

  constructor(private fb:FormBuilder,
     private dataBankService :DataBankService, 
     private dashboardlsService : DashboardlsService ){
    this.checkBoxForm = this.fb.group({  // create a fb.group for every Object 
      id: '',
      numeral: null,
      type: 'checkbox',
      text: '',
      description:'',
      icon:'check-icon',
      note_text:'',
      addedToBank: false,
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
    this.loadFromDataObject();
    this.initializeFormValues();
    this.formSubscription = this.checkBoxForm.valueChanges.subscribe(value => {
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
     
      const index = storedQuestions.findIndex((e:any)  => e.id === this.checkBoxForm.value.id);
      
      if (index !== -1) {
  
        storedQuestions[index] = { ...storedQuestions[index], ...this.checkBoxForm.value };
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

      this.checkBoxForm.patchValue(element);
      const settings = this.checkBoxForm.get('settings') as FormGroup;
      this.qMessage = (settings.get('question_multimedia')?.value) ? true : false;
      this.aMessage = (settings.get('options_multimedia')?.value) ? true : false;
  
      // Load options
      const optionsArray = this.checkBoxForm.get('options') as FormArray;
      while (optionsArray.length) {
        optionsArray.removeAt(0);
      }
      
      if (element.options) {
          element.options.forEach((option: string) => {
          optionsArray.push(this.fb.control(option));
        });
      }
    
      this.optionsAnswer = element.options.filter((option: string | null) => option != null && option !== '') || [];
      this.spinner =  false;
    }else {
      this.spinner = true;
    }  
  }
    this.spinner =  false;
  }
  

  initializeFormValues(): void {
    const settings = this.checkBoxForm.get('settings') as FormGroup;
    this.anotherField = settings.get('another_field')?.value;
    this.addNote = settings.get('add_note')?.value;
    this.defectedAnswer = settings.get('defected_answer')?.value;
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


  // Video Url

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
         this.checkBoxForm.patchValue(element);
         const settings = this.checkBoxForm.get('settings') as FormGroup;
         this.qMessage = (settings.get('question_multimedia')?.value) ? true : false;
         this.aMessage = (settings.get('options_multimedia')?.value) ? true : false;
       }
     }
   }
 
   closeVideoWindow() : void {
     this.openVideoWindow = false;
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

  onResetForm(): void {
    this.resetCheckBoxForm();
    this.resetFormState();
    console.log(this.checkBoxForm.value);
  }
  
  resetCheckBoxForm(): void {
    this.checkBoxForm.reset({
      id: this.elementData.id || '',
      numeral: null,
      type: 'checkbox',
      text: '',
      description: '',
      icon: 'check-icon',
      note_text: '',
      addedToBank: false,
      options: [],
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
  
    // Reset FormArray controls
    this.resetFormArray(this.checkBoxForm.get('options') as FormArray, ['']);
  }
  
  resetFormArray(formArray: FormArray, initialValues: any[]): void {
    formArray.clear();
    initialValues.forEach(value => formArray.push(this.fb.control(value)));
  }
  
  resetFormState(): void {
    this.optionsAnswer = [];
    this.qMessage = false;
    this.aMessage = false;
    this.initializeFormValues();
    this.ToggleComponent?.reloadComponent();
    this.reloadAllControls();
  }
  
  addToBank() : void {
    this.checkBoxForm.patchValue({ ['addedToBank']: true });
    this.dataBankService.createBank(this.checkBoxForm.value).subscribe(
      (response) => {
        console.log('Bank created', response);
      },
      (error) => {
        console.error('Error creating bank', error);
      }
    );
  }



  onSubmit() : void {
   if(this.checkBoxForm.valid){
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
