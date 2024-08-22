import { Component,Output, EventEmitter} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SurveyService } from '../../services/survey.service';
import { format } from 'date-fns';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { DashboardlsService } from 'src/app/features/dashboard/services/dashboardls.service';

@Component({
  selector: 'app-survey-form',
  templateUrl: './survey-form.component.html',
  styleUrls: ['./survey-form.component.scss']
})
export class SurveyFormComponent {
      
  @Output() formClose = new EventEmitter<void>();
  @Output() surveySaved = new EventEmitter<void>();
  close : boolean = false;
  options:string[] = []; 
  errorMessage : boolean = false;
  isLoading : boolean = false;

  surveyForm: FormGroup;

  constructor(
    private fb: FormBuilder, 
    private surveyService: SurveyService,  
    private toastr: ToastrService,
    private router: Router,
    private dashboardlsService : DashboardlsService
  ) {
    
    
    this.surveyForm = this.fb.group({
      title: ['', Validators.required],
      description:'',
      date_creation: this.formatDate(),
      updated_date: this.formatDate(),
      state: 'creada',
      questions:this.fb.array([]),
    });
  }


 formatDate(): string {
    const date = new Date();
    return format(date, 'dd/MM/yyyy');
  }

  async onSubmit(): Promise<void> {
    if (this.surveyForm.valid) {
      this.isLoading = true; // Mostrar el spinner
      try {
        const response: any = await this.surveyService.createSurvey(this.surveyForm.value).toPromise();
        
        if (response.survey) {
          localStorage.setItem('survey', JSON.stringify(response.survey));
          this.dashboardlsService.saveDashboardOptions(response.survey.questions);
          this.router.navigate(['/dashboard']);
          this.toastr.success("Encuesta Creada con Éxito");
          this.surveySaved.emit();
        }
      } catch (error) {
        console.error('Error creating survey', error);
      } finally {
        this.isLoading = false; // Ocultar el spinner
        this.onClose();
      }
    } else {
      this.errorMessage = !this.errorMessage;
      return;
    }
  }
  

  onClose():void {
    this.close =  true;
    setTimeout(()=>{
      this.formClose.emit();
    },500);
  }
}
