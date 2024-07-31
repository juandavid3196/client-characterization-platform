import { Component } from '@angular/core';

@Component({
  selector: 'app-adminpanel',
  templateUrl: './adminpanel.component.html',
  styleUrls: ['./adminpanel.component.scss']
})
export class AdminpanelComponent {


  sectionSelected : string = 'home';

  onSectionSelected(text:string) : void {
    this.sectionSelected = text;
  }

}
