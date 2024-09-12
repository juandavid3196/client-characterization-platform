import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Survey } from '../../models/survey.model';

@Component({
  selector: 'app-info-window',
  templateUrl: './info-window.component.html',
  styleUrls: ['./info-window.component.scss']
})
export class InfoWindowComponent {
  
  close : boolean = false;
  @Output() formClose = new EventEmitter<void>();
  @Input() surveyData !: Survey | null;

  ngOnInit() : void {
    console.log(this.surveyData);
  }

  onClose():void {
    this.close =  true;
    setTimeout(()=>{
      this.formClose.emit();
    },500);
  }


}
