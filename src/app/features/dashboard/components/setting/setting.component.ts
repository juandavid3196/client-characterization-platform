import { Component, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { format } from 'date-fns';
import { ToastrService } from 'ngx-toastr';
import { SurveyService } from 'src/app/features/surveys/services/survey.service';

@Component({
  selector: 'app-setting',
  templateUrl: './setting.component.html',
  styleUrls: ['./setting.component.scss']
})
export class SettingComponent {
  settingForm !: FormGroup;
  close : boolean = false;
  errorMessage : boolean = false;
  @Output() formClose = new EventEmitter<void>();

  constructor(
    private surveyService : SurveyService, 
    private toastr: ToastrService,
    private router: Router,
    private fb: FormBuilder,
  ){
    this.settingForm = this.fb.group({
      title: ['', Validators.required],
      description: '',
    });
  }

  ngOnInit() : void {
    const survey = this.getSurveyData();
    this.settingForm.patchValue({['title']:survey.title});
    this.settingForm.patchValue({['description']:survey.description});
  }

  formatDate(): string {
    const date = new Date();
    return format(date, 'dd/MM/yyyy');
  }

  getSurveyData() : any {
    const surveyString =  localStorage.getItem('survey');
    const survey =  (surveyString) ? JSON.parse(surveyString) : '';
    return survey;
  }

  onSubmit() : void {
    
    if(this.settingForm.valid){
      const survey = this.getSurveyData();
      survey.state= 'Editada';
      survey.updated_date = this.formatDate();
      survey.title = this.settingForm.value.title;
      survey.description = this.settingForm.value.description;
      
      this.surveyService.updateSurvey(survey.id, survey).subscribe((response:any) => {
      if(response){
        const newSurvey = JSON.stringify(response.survey);
        localStorage.setItem('survey',newSurvey);
        this.toastr.success("Encuesta editada con éxito");
      }
      },
      (error) => {
        console.error('Error updating name', error);
      });
  }else {
    this.errorMessage = !this.errorMessage;
    return;
  }
    this.onClose();
  }


  deleteSurvey(): void {
    const survey = this.getSurveyData();
    if(window.confirm("¿Desea eliminar la encuesta?")){
      this.surveyService.deleteSurvey(survey.id).subscribe(() => {
        this.router.navigate(['/surveys']);
        this.toastr.success("Encuesta Eliminada con Exito");
        localStorage.clear();
      });
    }else{
      return;
    }
    this.onClose();
  }
  
  onClose():void {
    this.close =  true;
    setTimeout(()=>{
      this.formClose.emit();
    },500);
  }
}
