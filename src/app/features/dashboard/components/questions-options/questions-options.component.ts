import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Section } from '../../models/section.model';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { v4 as uuidv4 } from 'uuid';
import { DashboardlsService } from '../../services/dashboardls.service';

@Component({
  selector: 'app-questions-options',
  templateUrl: './questions-options.component.html',
  styleUrls: ['./questions-options.component.scss'],
})
export class QuestionsOptionsComponent {
  close: boolean = false;
  changeSection: boolean = false;
  errorMessage: boolean = false;
  @Output() formClose = new EventEmitter<void>();
  @Output() typeSelected = new EventEmitter<string>();
  @Output() sectionSelected = new EventEmitter<string>();
  @Output() openBank = new EventEmitter<void>();
  @Output() refreshList = new EventEmitter<void>();
  @Output() closeEditWindow = new EventEmitter<void>();
  @Input() section!: Section;
  @Input() editSection: boolean = false;

  sectionForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private dashboardlsService: DashboardlsService
  ) {
    this.sectionForm = this.fb.group({
      id: '',
      title: ['', Validators.required],
      description: '',
      video: ['', [this.validateIframeYoutube]],
      imageUrl: ['', [this.validateUrl(/https?:\/\/[^\s$.?#].[^\s]*$/)]],
      type: 'section',
      icon: 'section-icon',
    });
  }

  ngOnInit(): void {
    if (this.editSection) {
      this.changeSection = !this.changeSection;
      this.sectionForm.patchValue(this.section);
    }
  }

  selectType(type: string) {
    this.typeSelected.emit(type);
    this.onClose();
  }

  validateField(field: string): void {
    if (this.sectionForm.value[field] !== '') {
      this.errorMessage = false;
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

  onChangeSection(): void {
    if (this.editSection) {
      return;
    }
    this.changeSection = !this.changeSection;
  }

  onClose(): void {
    this.close = true;
    this.closeEditWindow.emit();
    setTimeout(() => {
      this.formClose.emit();
    }, 500);
  }

  closeSection(event: Event): void {
    event.preventDefault();
    this.editSection = false;
    this.refreshList.emit();
    this.onClose();
  }

  onSubmit(): void {
    console.log(this.sectionForm.value, this.sectionForm.valid);
    if (this.sectionForm.valid) {
      if (this.editSection) {
        const storedQuestions = this.dashboardlsService.getDashboardOptions();
        if (storedQuestions && this.section.id) {
          const index = storedQuestions.findIndex(
            (e: any) => e.id === this.section.id
          );

          if (index !== -1) {
            storedQuestions[index] = {
              ...storedQuestions[index],
              ...this.sectionForm.value,
            };
            this.dashboardlsService.saveDashboardOptions(storedQuestions);
            this.editSection = false;
            console.log(this.sectionForm.value);
            this.refreshList.emit();
          }
        }
      } else {
        // Crear nueva sección
        this.sectionForm.patchValue({
          id: uuidv4(),
        });
        console.log(this.sectionForm.value);
        this.sectionSelected.emit(this.sectionForm.value);
      }
    } else {
      this.errorMessage = !this.errorMessage;
      return;
    }
    this.onClose();
  }

  sendInfo(): void {
    this.onClose();
    this.openBank.emit();
  }
}
