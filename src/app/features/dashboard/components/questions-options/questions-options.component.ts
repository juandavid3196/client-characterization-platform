import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Section } from '../../models/section.model';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-questions-options',
  templateUrl: './questions-options.component.html',
  styleUrls: ['./questions-options.component.scss']
})
export class QuestionsOptionsComponent {

  close : boolean = false;
  changeSection: boolean = false;
  errorMessage : boolean =  false;
  @Output() formClose = new EventEmitter<void>()
  @Output() typeSelected = new EventEmitter<string>();
  @Output() sectionSelected = new EventEmitter<string>();
  @Input() section : Section | null =  null;

  sectionForm !: FormGroup;

  constructor( private fb:FormBuilder){
    this.sectionForm = this.fb.group({
      title: ['',Validators.required],
      type:'section',
      icon:'section-icon'
    })
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

  onChangeSection():void {
    this.changeSection = !this.changeSection;
  }
  
  onClose():void {
    this.close =  true;
    setTimeout(()=>{
      this.formClose.emit();
    },500);
  }

  onSubmit(): void {
    if (this.sectionForm.valid) {
      
      if (this.section) {
        // Editar sección existente
        
      } else {
        // Crear nueva sección

        this.sectionSelected.emit(this.sectionForm.value);
      
      }
    }else {
      this.errorMessage = !this.errorMessage;
      return;
    }
    this.onClose();
  }

}
