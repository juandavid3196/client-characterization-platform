import { Component, Input, Output, EventEmitter} from '@angular/core';
import { Survey } from '../../models/survey.model';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SurveyService } from '../../services/survey.service';

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

  constructor(private fb: FormBuilder, private surveyService: SurveyService) {
    this.surveyForm = this.fb.group({
      name: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    if (this.survey) {
      this.surveyForm.patchValue(this.survey);
    }
  }

  onSubmit(): void {
    
    if (this.surveyForm.valid) {
      
      if (this.survey) {
        // Editar encuesta existente
        this.surveyService.updateSurvey(this.survey.id, this.surveyForm.value).subscribe(() => {
          this.surveySaved.emit();
        });
      } else {
        // Crear nueva encuesta
        this.surveyService.createSurvey(this.surveyForm.value).subscribe(() => {
          this.surveySaved.emit();
        });
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
