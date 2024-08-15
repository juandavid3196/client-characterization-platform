import { Component } from '@angular/core';

@Component({
  selector: 'app-adminpanel',
  templateUrl: './adminpanel.component.html',
  styleUrls: ['./adminpanel.component.scss']
})
export class AdminpanelComponent {


  sectionSelected : string = 'home';
  searchTerm : string = '';

  onSectionSelected(text:string) : void {
    this.sectionSelected = text;
  }

 

}
