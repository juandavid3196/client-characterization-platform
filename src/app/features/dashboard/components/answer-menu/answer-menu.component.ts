import {
  Component,
  EventEmitter,
  Input,
  Output,
  SimpleChanges,
} from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { DashboardlsService } from '../../services/dashboardls.service';

@Component({
  selector: 'app-answer-menu',
  templateUrl: './answer-menu.component.html',
  styleUrls: ['./answer-menu.component.scss'],
})
export class AnswerMenuComponent {
  close: boolean = false;
  errorMessage: boolean = false;
  editVideo: boolean = false;
  @Output() formClose = new EventEmitter<void>();
  @Output() refreshData = new EventEmitter<void>();
  @Input() elementData: any = {};
  @Input() videoType: string = '';

  multimediaForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private dashboardlsService: DashboardlsService
  ) {
    this.multimediaForm = this.fb.group({
      video: ['', [this.validateIframeYoutube]],
      image: ['', [this.validateUrl(/https?:\/\/[^\s$.?#].[^\s]*$/)]],
    });
  }

  ngOnInit(): void {
    this.loadFromLocalStorage();
    console.log(this.videoType, this.elementData);
    if (
      this.multimediaForm.value.video != '' ||
      this.multimediaForm.value.image != ''
    ) {
      this.editVideo = true;
    }
  }

  // Dectect changes in the videoType input

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['videoType']?.currentValue) {
      this.loadFromLocalStorage();
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

  loadFromLocalStorage() {
    const storedQuestions = this.dashboardlsService.getDashboardOptions();
    if (storedQuestions && this.elementData.id) {
      const element = storedQuestions.find(
        (e: any) => e.id === this.elementData.id
      );
      if (element) {
        if (element.hasOwnProperty('settings')) {
          const settings = element.settings;
          if (this.videoType === 'question_multimedia') {
            this.multimediaForm.patchValue({
              video: settings['question_video'],
              image: settings['question_image'],
            });
          } else {
            this.multimediaForm.patchValue({
              video: settings['answer_video'],
              image: settings['answer_image'],
            });
          }
        }
      }
    }
  }

  onClose(): void {
    this.close = true;
    setTimeout(() => {
      this.formClose.emit();
    }, 500);
  }

  onSubmit(): void {
    if (this.multimediaForm.valid) {
      const storedQuestions = this.dashboardlsService.getDashboardOptions();
      if (storedQuestions && this.elementData?.id) {
        const index = storedQuestions.findIndex(
          (e: any) => e.id === this.elementData.id
        );
        if (index !== -1) {
          const question = storedQuestions[index];
          if (question.settings) {
            if (this.videoType === 'question_multimedia') {
              question.settings['question_video'] =
                this.multimediaForm.value.video;
              question.settings['question_image'] =
                this.multimediaForm.value.image;
            } else {
              question.settings['answer_video'] =
                this.multimediaForm.value.video;
              question.settings['answer_image'] =
                this.multimediaForm.value.image;
            }
          }
          storedQuestions[index] = { ...question };
          this.dashboardlsService.saveDashboardOptions(storedQuestions);
        }
      }
    } else {
      this.errorMessage = !this.errorMessage;
      return;
    }
    this.editVideo = false;
    this.onClose();
    this.refreshData.emit();
  }
}
