import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Section } from '../../models/section.model';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { v4 as uuidv4 } from 'uuid';
import { DashboardlsService } from '../../services/dashboardls.service';

@Component({
  selector: 'app-answer-menu',
  templateUrl: './answer-menu.component.html',
  styleUrls: ['./answer-menu.component.scss']
})
export class AnswerMenuComponent {
  close : boolean = false;
  changeSection: boolean = false;
  errorMessage : boolean =  false;
  @Output() formClose = new EventEmitter<void>()
  @Output() typeSelected = new EventEmitter<string>();
  @Output() sectionSelected = new EventEmitter<string>();
  @Output() openBank = new EventEmitter<any>();
  @Output() refreshList = new EventEmitter<any>();
  @Input() section !: Section;
  @Input() editSection : boolean  =false;
  


  sectionForm !: FormGroup;

  constructor( private fb:FormBuilder, private dashboardlsService: DashboardlsService){
    this.sectionForm = this.fb.group({
      id:'',
      title: ['',Validators.required],
      type:'section',
      icon:'section-icon'
    })
  }

  ngOnInit():void {
    if(this.editSection){
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

  onChangeSection():void {
    if(this.editSection) {
      return;
    }
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
      
      if (this.editSection) {
        const storedQuestions = this.dashboardlsService.getDashboardOptions();
        if (storedQuestions && this.section.id) {
          const index = storedQuestions.findIndex((e:any)  => e.id === this.section.id);
      
          if (index !== -1) {
            storedQuestions[index] = { ...storedQuestions[index], ...this.sectionForm.value };
            this.dashboardlsService.saveDashboardOptions(storedQuestions);
            this.editSection = false;
            this.refreshList.emit();
          }
        }   
      } else {
        // Crear nueva sección
        this.sectionForm.patchValue({
          id: uuidv4()
        });
        this.sectionSelected.emit(this.sectionForm.value);    
      }
    }else {
      this.errorMessage = !this.errorMessage;
      return;
    }
    this.onClose();
  }

  sendInfo() : void {
    this.onClose();
    this.openBank.emit()
  }

}
