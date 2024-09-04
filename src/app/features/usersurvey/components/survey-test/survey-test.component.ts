import { Component, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UserSurveyService } from '../../services/user-survey.service';
import { ZoomDirective } from 'src/app/shared/directives/zoom.directive';
import { SurveyService } from 'src/app/features/surveys/services/survey.service';
import { map, take } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { v4 as uuidv4 } from 'uuid';
import { format } from 'date-fns';
import { AnswerService } from '../../services/answer.service';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Component({
  selector: 'app-survey-test',
  templateUrl: './survey-test.component.html',
  styleUrls: ['./survey-test.component.scss']
})
export class SurveyTestComponent {

  survey : any = {};
  isLoading : boolean = false;
  textAreaAnswer: string = '';
  answerArray : any[] = [];
  questionsToWarn : string[] =  [];
  openVideoNumeral :  string =  '';
  openVideoType :  string =  '';
  iframeHtml ?: SafeHtml;
  @ViewChild(ZoomDirective) zoomDirective!: ZoomDirective;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private toastr: ToastrService,
    private userSurveyService : UserSurveyService,
    private surveyService : SurveyService,
    private answerService : AnswerService,
    private sanitizer: DomSanitizer

  ) {
    window.addEventListener('beforeunload', (event) => {
      this.saveSurveyAnswers();
  });


  }

  ngOnInit(): void {
   this.loadSurvey();
  }


  async loadSurvey() : Promise<void> {
    try {
      this.survey = await this.getSurveyById();
      console.log(this.survey);
      this.CheckingAnswerByDefect();
    } catch (error) {
      console.error('Error initializing survey', error);
    }
  }

  async getSurveyById(): Promise<any> {
    this.isLoading = true; // Mostrar el spinner
    try {
      //tomar id desde la URL
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

      //Verificar si el usuario ya tiene esa encuesta
      const userSurveys: any = await this.userSurveyService.getSurveys().toPromise();
      if(userSurveys){
        let survey = userSurveys.find((s:any) => s.id === id);
        if(survey === undefined){
          const response: any = await this.surveyService.getSurveyById(id).toPromise();
          if(response){
            response.state = 'Sin Resolver';
            const userResponse: any = await this.userSurveyService.createSurvey(response).toPromise();
              if(userResponse){
                this.toastr.success('Encuesta agregada con exito');
                return userResponse;
              }
          }
        }else {
          return survey;
        }
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

goToUserSurveyPage() : void {
  this.saveSurveyAnswers();
  this.router.navigate(['/userpanel']);
}

saveSurveyAnswers() :  void {
this.isLoading = true; // Mostrar el spinner
let result = {};
    try {
        // Servicio EDITAR respuestas
    } catch (error) {
      console.error('Error creating survey', error);
    } finally {
      this.isLoading = false; 
    }
}

async  finishSurvey() : Promise<void> {
  this.isLoading = true; // Mostrar el spinner

  try {
    // Cheking required questions without answer
   if(this.ChekingRequiredQuestions()){
    return;
   }
   //Saving answers in Database
   const answerBody = {
    id_survey: this.survey.id,
    id: uuidv4(),
    state:'Finalizada',
    date_creation :  this.formatDate(),
    updated_date: this.formatDate(),
    asnwers : this.answerArray,
   } 

   const response: any = await this.answerService.createAnswer(answerBody).toPromise();
    if(response){
      this.toastr.success('Encuesta Finalizada con exito');
      console.log(response)
    }
  } catch (error) {
    console.error('Error fetching survey', error);
  } finally {
    this.isLoading = false;
  }
   
}

formatDate(): string {
  const date = new Date();
  return format(date, 'dd/MM/yyyy');
}


checkRequiredProperty(numeral:string) : boolean {
  const checkNumeral =  this.questionsToWarn.find((e:any) => e === numeral);
  if(checkNumeral === undefined){
    return  false;
  }else{
    return true;  
  }
}

ChekingRequiredQuestions() :  boolean {
  this.questionsToWarn = [];
  for (let index = 0; index < this.survey.questions.length; index++) {
    if(this.survey.questions[index].settings.required === true){ // Cheking if the asnwer is in the answers Array.
       const questions = this.answerArray.find((e:any)=>e.questionInfo.id === this.survey.questions[index].id);
       if(questions === undefined){
         this.questionsToWarn.push(this.survey.questions[index].numeral);
       }
    } 
   }
   if(this.questionsToWarn.length > 0){
     return  true;
   }
   return false;
}

CheckingAnswerByDefect() : void {
  for (let index = 0; index < this.survey.questions.length; index++) {
    if(this.survey.questions[index].settings.answer_value !== ''){ // Cheking if answer_defect contains one. 
        this.setAnswer({item:this.survey.questions[index],answer:this.survey.questions[index].settings.answer_value});
    } 
   }
}

getAnswerValue(numeral : string ) :  any {
  const questionAnswer =  this.answerArray.find((e:any)=>e.questionInfo.numeral === numeral);
  if(questionAnswer) {
    return questionAnswer.answer;
  } 
}

openVideo(item:any,type:string) : void {
 this.openVideoNumeral  = item.numeral;
 this.openVideoType = type;
 if(type === 'question'){
   this.getVideoLabel(item.settings.question_multimedia);
  }else {
   this.getVideoLabel(item.settings.options_multimedia);
 }
}

closeVideo() :  void {
  this.openVideoNumeral  = 'close';
}

getVideoLabel(label:string) : void {
  this.iframeHtml = this.sanitizer.bypassSecurityTrustHtml(label);
}

verifyVideoLink(item:any,type:string) : boolean{
  if(item.settings.question_multimedia === '' && type === 'question' 
    ||item.settings.options_multimedia === '' && type === 'answer'){
    return false 
  }
  return true;
}

setAnswer(answer:any) :  void {
  let body = {
    questionInfo: answer.item,
    answer :  answer.answer,   
  }

  const checkIndex =  this.answerArray.findIndex((q:any)=>q.questionInfo.id ==  body.questionInfo.id);

  // If press click twice in a checked answer
  if(body.answer === this.getAnswerValue(body.questionInfo.numeral)){
    if(checkIndex !== -1){
      this.answerArray.splice(checkIndex,1);
    }
    return;
  }

  // Adding or Updating
  if(checkIndex === -1){
    if(body.questionInfo.type === 'open' && body.answer !== '' || body.questionInfo.type !== 'open'){
      this.answerArray.push(body);
    }else {
      return;
    }
  }else {
    if(body.questionInfo.type === 'open' && body.answer !== '' || body.questionInfo.type !== 'open'){
      this.answerArray[checkIndex].answer = body.answer;
    }else{
      return;
    }
  }
  console.log(this.answerArray);
}

}
