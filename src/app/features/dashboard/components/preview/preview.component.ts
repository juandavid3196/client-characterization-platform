import { Component, Input, ViewChild } from '@angular/core';
import { DashboardlsService } from '../../services/dashboardls.service';
import { ZoomDirective } from 'src/app/shared/directives/zoom.directive';

@Component({
  selector: 'app-preview',
  templateUrl: './preview.component.html',
  styleUrls: ['./preview.component.scss']
})
export class PreviewComponent {

dashboardData : any[] = [];
@ViewChild(ZoomDirective) zoomDirective!: ZoomDirective;

constructor(private dashboardlsService : DashboardlsService){}

ngOnInit() : void {
  this.getDashboardData();
}

zoomIn() {
  this.zoomDirective.zoomIn();
}

zoomOut() {
  this.zoomDirective.zoomOut();
}

getDashboardData() :  void {
  this.dashboardData = this.dashboardlsService.getDashboardOptions();
}

getMaxLengthValue(item:any): number[] {
    const options = item.options as any[];
    const maxOptionsRows = Math.max(...options.map(option => option.rows.length));
    const maxVisibleRows = item.no_visible_rows.length;
    const maxRows = Math.max(maxOptionsRows, maxVisibleRows);
    return Array.from({ length: maxRows }, (_, i) => i);
}


verifyIndex(item:number, answer : number) : boolean {
  if(item <= answer){
    return true;
  }
  return false;
}


labelTitle(number: number, sliderOptions:any, item:any): string {
  let label = '';
  if(number == 1 && sliderOptions.length > 1){
    label = item.settings.left_label;
  }else if(sliderOptions.length >= 3 && number === ((sliderOptions.length / 2) + 0.5)){
    label  = item.settings.center_label;
  }else if(number === sliderOptions.length) {
    label  = item.settings.right_label;
  }

  return label;
}

 getSliderOptions(steps:number) : number[] {
  let item = 1;
    let sliderOptions = [];
    for (let index = 0; index < steps; index++) {
      sliderOptions.push(item);
      item += 1;
    }
    return sliderOptions;
 }

}
