import { Component } from '@angular/core';

@Component({
  selector: 'app-accessibility',
  templateUrl: './accessibility.component.html',
  styleUrls: ['./accessibility.component.scss'],
})
export class AccessibilityComponent {
  isVisible: boolean = false;

  togglePanel() {
    this.isVisible = !this.isVisible;
  }
}
