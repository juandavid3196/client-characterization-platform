import { Survey } from '../../models/survey.model';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ValidationErrors,
  ValidatorFn,
} from '@angular/forms';

@Component({
  selector: 'app-question-form',
  templateUrl: './question-form.component.html',
  styleUrls: ['./question-form.component.scss'],
})
export class QuestionFormComponent {
  close: boolean = false;
  @Output() formClose = new EventEmitter<void>();
  @Output() emitAnswer = new EventEmitter<any>();
  @Input() formQuestionInfo!: any | null;
  sectionForm!: FormGroup;
  warningMessage: boolean = false;

  constructor(private fb: FormBuilder) {
    this.sectionForm = this.fb.group({
      video: ['', [this.validateIframeYoutube]],
      imageUrl: ['', [this.validateUrl(/https?:\/\/[^\s$.?#].[^\s]*$/)]],
      text: ['', [this.maxLengthValidator(300)]],
    });
  }

  ngOnInit(): void {
    if (this.formQuestionInfo) {
      this.sectionForm.patchValue({
        video: this.formQuestionInfo.video,
        imageUrl: this.formQuestionInfo.imageUrl,
        text: this.formQuestionInfo.text,
      });
    }
  }

  // Validador para el iframe de YouTube
  validateIframeYoutube(control: any) {
    if (!control.value) return null;
    const iframeRegex =
      /<iframe.*src="https:\/\/www\.youtube\.com\/embed\/.*".*<\/iframe>/;
    return iframeRegex.test(control.value) ? null : { invalidIframe: true };
  }

  // Validador personalizado
  validateUrl(regex: RegExp) {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value;
      if (!value) {
        return null; // Campo vacío es válido
      }
      return regex.test(value) ? null : { invalidUrl: true }; // Aplica la validación solo si hay contenido
    };
  }

  maxLengthValidator(maxLength: number): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value;
      return value && value.length > maxLength ? { maxLength: true } : null;
    };
  }

  onClose(): void {
    this.close = true;
    this.warningMessage = false;
    setTimeout(() => {
      this.formClose.emit();
    }, 500);
  }

  onSubmit(): void {
    if (this.sectionForm.valid) {
      if (
        this.sectionForm.value.video === '' &&
        this.sectionForm.value.imageUrl === '' &&
        this.sectionForm.value.text === ''
      ) {
        this.warningMessage = !this.warningMessage;
        return;
      }
      this.emitAnswer.emit(this.sectionForm.value);
      this.onClose();
    }
  }
}
