import { Component, EventEmitter, Input, Output, QueryList, SimpleChanges, ViewChild, ViewChildren} from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import {FilterSelectComponent} from '../../../../shared/components/filter-select/filter-select.component'
import {ToggleButtonComponent} from '../../../../shared/components/toggle-button/toggle-button.component'
import { DataBankService } from '../../services/data-bank.service';
import { Subscription } from 'rxjs';
import { DashboardlsService } from '../../services/dashboardls.service';
@Component({
  selector: 'app-yes-no-question',
  templateUrl: './yes-no-question.component.html',
  styleUrls: ['./yes-no-question.component.scss']
})
export class YesNoQuestionComponent {
  @ViewChild('appFilterComponent') FilterComponent: FilterSelectComponent | undefined;
  @ViewChild('appToggleButtonDefectedA') ToggleComponent: ToggleButtonComponent | undefined;
  @ViewChildren('appToggleButton') toggleButtons!: QueryList<ToggleButtonComponent>;
  
  yesnoForm : FormGroup;
  addNote : boolean =  false;
  defectedAnswer : boolean = false;
  enlargeAnswer : boolean = false;
  anotherField : boolean = false;
  required :boolean = false;
  qMessage : boolean = false;
  changeSection: boolean = true;
  optionsMessage : boolean = false;
  optionsMenu :  boolean = false;
  spinner: boolean = false;
  dashboardOptions : any[] = [];
  formSubscription: Subscription | undefined;
  yesNoOptions : string[] = ['Si','No'];
  iconsType : string = '';
  answerValue : string = '';
  openVideoWindow : boolean = false;
  videoUrlType : string = '';

  @Input() elementData : any = {};
  @Output() refreshList =  new EventEmitter();

  constructor(private fb:FormBuilder,
     private dataBankService :DataBankService, 
     private dashboardlsService : DashboardlsService ){
   
      this.yesnoForm = this.fb.group({  // create a fb.group for every Object 
      id: '',
      numeral: null,
      type: 'yes/no',
      text: '',
      description:'',
      icon:'yes-no-icon',
      note_text:'',
      addedToBank: false,
      selected_icons:'',
      settings: this.fb.group({  
        question_multimedia: '',
        answer_value: '',
        required: false,
        defected_answer: false,
        add_note: false,
        enlarge_answer:false,
      })
    });
  }

  ngOnInit() {
    this.loadFromDataObject();
    this.initializeFormValues();
    this.formSubscription = this.yesnoForm.valueChanges.subscribe(value => {
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

  saveYesNoData(): void {

    const storedQuestions = this.dashboardlsService.getDashboardOptions();
    
    if (storedQuestions) {
     
      const index = storedQuestions.findIndex((e:any)  => e.id === this.yesnoForm.value.id);
      
      if (index !== -1) {
  
        storedQuestions[index] = { ...storedQuestions[index], ...this.yesnoForm.value };
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
        this.yesnoForm.patchValue(element);
        const settings = this.yesnoForm.get('settings') as FormGroup;
        this.qMessage = (settings.get('question_multimedia')?.value) ? true : false;
        this.spinner =  false;
    }else {
      this.spinner = true;
    }  
  }
    this.spinner =  false;
  }
  

  initializeFormValues(): void {
    const settings = this.yesnoForm.get('settings') as FormGroup;
    this.addNote = settings.get('add_note')?.value;
    this.defectedAnswer = settings.get('defected_answer')?.value;
    this.required = settings.get('required')?.value;
    this.enlargeAnswer = settings.get('enlarge_answer')?.value;
    this.iconsType = this.yesnoForm.get('selected_icons')?.value;
  }


  
  reloadAllControls() {
    if(this.toggleButtons){
      this.toggleButtons.forEach(toggleButton => {
        toggleButton?.reloadComponent();
      });
  }
  }

  getToggleValues(values : any): void {

    let settings = this.yesnoForm.get('settings') as FormGroup;  // access to a specific property.   
     
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
      this.yesnoForm.patchValue({ ['note_text']: '' }); 
    }
    return true;
  }


getOptionValue(option : string): void {

    let settings = this.yesnoForm.get('settings') as FormGroup;   
    
    if (settings.controls.hasOwnProperty('answer_value')) {
      settings.patchValue({ ['answer_value']: option });
     }
  }

  iconsSelection(type:string) : void {
    this.iconsType = type;
    this.yesnoForm.patchValue({ ['selected_icons']: type }); 
  } 

  addAnswer() : void {
    this.optionsMenu =  true;
  }

  answerType(type:string) : void {
      this.answerValue = type;
  }

  // Video URL

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
         this.yesnoForm.patchValue(element);
         const settings = this.yesnoForm.get('settings') as FormGroup;
         this.qMessage = (settings.get('question_multimedia')?.value) ? true : false;
       }
     }
   }
 
   closeVideoWindow() : void {
     this.openVideoWindow = false;
   }

  resetInputFile(controlName:string) {
    const settings = this.yesnoForm.get('settings') as FormGroup;
    settings.patchValue({ [controlName]: '' });
      this.qMessage = !this.qMessage;
  }



  onChangeSection():void {
    this.changeSection = !this.changeSection;
  }

  onResetForm(): void {
    this.resetyesnoForm();
    this.resetFormState();
  }
  
  resetyesnoForm(): void {
    this.yesnoForm.reset({
      id: this.elementData.id || '',
      numeral: this.elementData.numeral || '',
      type: 'yes/no',
      text: '',
      description:'',
      icon:'yes-no-icon',
      note_text:'',
      addedToBank: false,
      selected_icons:'hands',
      settings: this.fb.group({  
        question_multimedia: '',
        answer_value: '',
        required: false,
        defected_answer: false,
        add_note: false,
        enlarge_answer:false,
      })
    }); 
  }
  
  
  resetFormState(): void {
    this.iconsType = 'hands';
    this.yesNoOptions = [];
    this.qMessage = false;
    this.initializeFormValues();
    this.ToggleComponent?.reloadComponent();
    this.reloadAllControls();
  }
  
  addToBank() : void {
    this.yesnoForm.patchValue({ ['addedToBank']: true });
    this.dataBankService.createBank(this.yesnoForm.value).subscribe(
      (response) => {
        console.log('Bank created', response);
      },
      (error) => {
        console.error('Error creating bank', error);
      }
    );
  }



  onSubmit() : void {
   if(this.yesnoForm.valid){
    this.saveYesNoData();
    this.refreshList.emit();
   }
  }

  ngOnDestroy(): void {
    if (this.formSubscription) {
      this.formSubscription.unsubscribe();
      this.saveYesNoData();
      this.onResetForm();
    }
  }
}
