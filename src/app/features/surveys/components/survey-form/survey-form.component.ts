import { Component, Input, Output, EventEmitter} from '@angular/core';
import { Survey } from '../../models/survey.model';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SurveyService } from '../../services/survey.service';
import { format } from 'date-fns';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-survey-form',
  templateUrl: './survey-form.component.html',
  styleUrls: ['./survey-form.component.scss']
})
export class SurveyFormComponent {
      
  @Input() survey : Survey | null = null;
  @Output() formClose = new EventEmitter<void>();
  @Output() surveySaved = new EventEmitter<void>();
  close : boolean = false;
  options:string[] = []; 

  surveyForm: FormGroup;

  constructor(
    private fb: FormBuilder, private surveyService: SurveyService,  
    private toastr: ToastrService) {
    
    const currentDate = this.formatDate();
    
    this.surveyForm = this.fb.group({
      title: ['', Validators.required],
      date_creation: currentDate,
      updated_date: currentDate,
      state: 'creada',
      question_count: 0
    });
  }

  ngOnInit(): void {
    if (this.survey) {
      this.surveyForm.patchValue(this.survey);
    }
  }

 formatDate(): string {
    const date = new Date();
    return format(date, 'dd/MM/yyyy');
  }

  chargeData(survey: Survey): void {
      const currentDate = this.formatDate();
      survey.title =  this.surveyForm.value.title,
      survey.updated_date= currentDate,
      survey.state= 'En Progreso';
    }
  

  onSubmit(): void {
    
    if (this.surveyForm.valid) {
      
      if (this.survey) {
        // Editar encuesta existente
        this.chargeData(this.survey);
        this.surveyService.updateSurvey(this.survey.id, this.survey).subscribe(() => {
          this.surveySaved.emit();
        });
        this.toastr.success("Encuesta Editada con Exito");
      } else {
        // Crear nueva encuesta
        this.surveyService.createSurvey(this.surveyForm.value).subscribe(() => {
          this.surveySaved.emit();
        });
        this.toastr.success("Encuesta Creada con Exito");
      }
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
