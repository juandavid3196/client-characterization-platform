import { Directive, ElementRef, Renderer2 } from '@angular/core';

@Directive({
  selector: '[appZoom]'
})
export class ZoomDirective {

  private zoomLevel: number = 1;

  constructor(private el: ElementRef, private renderer: Renderer2) {}

  zoomIn() {
    this.zoomLevel += 0.1;
    this.applyZoom();
  }

  zoomOut() {
    this.zoomLevel -= 0.1;
    this.applyZoom();
  }

  private applyZoom() {
    this.renderer.setStyle(this.el.nativeElement, 'transform', `scale(${this.zoomLevel})`);
    this.renderer.setStyle(this.el.nativeElement, 'transform-origin', '0 0');
    this.renderer.setStyle(this.el.nativeElement, 'transition', 'transform 0.2s');
  }

}
