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


}
