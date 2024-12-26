import { Component, Output, EventEmitter, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { DashboardlsService } from 'src/app/features/dashboard/services/dashboardls.service';
import { Survey } from '../../surveys/models/survey.model';
import { SurveyService } from '../../surveys/services/survey.service';

@Component({
  selector: 'app-deadline-window',
  templateUrl: './deadline-window.component.html',
  styleUrls: ['./deadline-window.component.scss'],
})
export class DeadlineWindowComponent {
  @Output() formClose = new EventEmitter<void>();
  @Output() formSubmit = new EventEmitter<void>();
  @Input() survey!: Survey;
  close: boolean = false;
  options: string[] = [];
  errorMessage: boolean = false;
  isLoading: boolean = false;
  minDate: string = '';

  deadlineForm: FormGroup;

  constructor(private fb: FormBuilder, private surveyService: SurveyService) {
    this.deadlineForm = this.fb.group({
      deadline: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.minDate = new Date().toISOString().split('T')[0];
    console.log('minDate', this.minDate);
  }

  closeWindow(event: Event): void {
    event.preventDefault();
    this.onClose();
  }

  async onSubmit(): Promise<void> {
    if (this.deadlineForm.valid) {
      this.isLoading = true; // Mostrar el spinner
      try {
        const editSurvey = {
          deadline: this.deadlineForm.get('deadline')?.value,
        };

        const response: any = await this.surveyService
          .updateSurvey(this.survey.id, editSurvey)
          .toPromise();

        if (response) {
          console.log('Survey edited', response);
          this.formSubmit.emit();
        }
      } catch (error) {
        console.error('Error editing survey', error);
      } finally {
        this.isLoading = false; // Ocultar el spinner
        this.onClose();
      }
    } else {
      this.errorMessage = !this.errorMessage;
      return;
    }
  }

  onClose(): void {
    this.close = true;
    setTimeout(() => {
      this.formClose.emit();
    }, 500);
  }
}
