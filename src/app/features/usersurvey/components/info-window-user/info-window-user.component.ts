import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Survey } from '../../models/survey.model';

@Component({
  selector: 'app-info-window-user',
  templateUrl: './info-window-user.component.html',
  styleUrls: ['./info-window-user.component.scss'],
})
export class InfoWindowUserComponent {
  close: boolean = false;
  @Output() formClose = new EventEmitter<void>();
  @Input() surveyData!: Survey | null;

  ngOnInit(): void {
    console.log(this.surveyData);
  }

  onClose(): void {
    this.close = true;
    setTimeout(() => {
      this.formClose.emit();
    }, 500);
  }
}
