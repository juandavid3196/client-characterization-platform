import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-accessibility',
  templateUrl: './accessibility.component.html',
  styleUrls: ['./accessibility.component.scss'],
})
export class AccessibilityComponent {
  isVisible: boolean = false;
  @Output() emitMode = new EventEmitter<string>();
  styles: any = {
    fontSizeUp: false,
    fontSizeDown: false,
    zoomUp: false,
    zoomDown: false,
    grayScale: false,
    invertColors: false,
    sepiaMode: false,
    bigCursor: false,
  };

  setMode(mode: string): void {
    this.emitMode.emit(mode);
  }

  togglePanel() {
    this.isVisible = !this.isVisible;
  }
}
