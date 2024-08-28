import { Component, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UserSurveyService } from '../../services/user-survey.service';
import { ZoomDirective } from 'src/app/shared/directives/zoom.directive';
import { SurveyService } from 'src/app/features/surveys/services/survey.service';
import { map, take } from 'rxjs';

@Component({
  selector: 'app-survey-test',
  templateUrl: './survey-test.component.html',
  styleUrls: ['./survey-test.component.scss']
})
export class SurveyTestComponent {

  survey : any = {};
  isLoading : boolean = false;
  @ViewChild(ZoomDirective) zoomDirective!: ZoomDirective;

  constructor(
    private route: ActivatedRoute,
    private userSurveyService : UserSurveyService,
    private surveyService : SurveyService,

  ) {}

  ngOnInit(): void {
   this.loadSurvey();
  }


  async loadSurvey() : Promise<void> {
    try {
      this.survey = await this.getSurveyById();
    } catch (error) {
      console.error('Error initializing survey', error);
    }
  }

  async getSurveyById(): Promise<any> {
    this.isLoading = true; // Mostrar el spinner
    try {
      const id = await new Promise<string>(resolve => {
        this.route.params.pipe(
          take(1),
          map(params => {
            let id = params['id'];
            return id.startsWith('id:') ? id.substring(3) : id;
          })
        ).subscribe(cleanId => {
          resolve(cleanId);
        });
      });
      const response: any = await this.surveyService.getSurveyById(id).toPromise();
      if(response){
        return response;
      }
      
    } catch (error) {
      console.error('Error fetching survey', error);
    } finally {
      this.isLoading = false; 
    }
  }

  
zoomIn() {
  this.zoomDirective.zoomIn();
}

zoomOut() {
  this.zoomDirective.zoomOut();
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
