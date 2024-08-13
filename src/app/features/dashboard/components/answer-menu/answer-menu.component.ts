import { Component, EventEmitter, Input, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DashboardlsService } from '../../services/dashboardls.service';

@Component({
  selector: 'app-answer-menu',
  templateUrl: './answer-menu.component.html',
  styleUrls: ['./answer-menu.component.scss']
})
export class AnswerMenuComponent {

  close : boolean = false;
  errorMessage : boolean =  false;
  editVideo: boolean =  false;
  @Output() formClose = new EventEmitter<void>()
  @Output() refreshData = new EventEmitter<void>()
  @Input() elementData : any = {};
  @Input() videoType : string = '';

  videoForm!: FormGroup;

  constructor( private fb:FormBuilder, private dashboardlsService: DashboardlsService){
    this.videoForm= this.fb.group({
      title: ['',Validators.required],
    })
  }

  ngOnInit():void {
    console.log('enter');
    this.loadFromLocalStorage();
    if(this.videoForm.value.title != ''){
      this.editVideo = true;
    }
  }

  ngOnChanges(changes: SimpleChanges): void {

    if (changes['videoType']?.currentValue) {
      this.loadFromLocalStorage();
    }
  }

  validateField(field: string): void {
    if (this.videoForm.value[field] !== '') {
      this.errorMessage = false;
    }
  }

  loadFromLocalStorage() {
    const storedQuestions = this.dashboardlsService.getDashboardOptions();
    if (storedQuestions && this.elementData.id) {
      const element = storedQuestions.find((e: any) => e.id === this.elementData.id);
      if(element){
          if (element.hasOwnProperty('settings')) {
            const settings = element.settings;
            if (settings.hasOwnProperty(this.videoType)) {
              if(settings[this.videoType] !== ''){
                this.videoForm.patchValue({['title']: settings[this.videoType]});
              }
            }
          }
      }
     }
   }
  

  onClose():void {
    this.close =  true;
    setTimeout(()=>{
      this.formClose.emit();
    },500);
  }

  onSubmit(): void {
    if (this.videoForm.valid) {
      const storedQuestions = this.dashboardlsService.getDashboardOptions();
      if (storedQuestions && this.elementData?.id) {
        const index = storedQuestions.findIndex((e:any)  => e.id === this.elementData.id);
        if (index !== -1) {
          const question = storedQuestions[index];
          if (question.settings) {
            question.settings[this.videoType] = this.videoForm.value.title;
          } 
            storedQuestions[index] = { ...question };
            this.dashboardlsService.saveDashboardOptions(storedQuestions);
        }
      }
    }else {
      this.errorMessage = !this.errorMessage;
      return;
    }
    this.editVideo = false;
    this.onClose();
    this.refreshData.emit();
  }
}
