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
  

  onSubmit(): void {
    
    if (this.surveyForm.valid) {
      
      if (this.survey) {
        // Editar encuesta existente
        
        const currentDate = this.formatDate();
        
        const newSurvey = {
          id: this.survey.id,
          title: this.surveyForm.value.title,
          updated_date: currentDate,
          state: 'En Progreso',
        };
        this.surveyService.updateSurvey(this.survey.id, newSurvey).subscribe(() => {
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
  }

  onCancel(): void {
    this.formClose.emit();
  }

  onClose():void {
    this.formClose.emit();
  }
}
