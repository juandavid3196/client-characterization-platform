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
import Swal from 'sweetalert2';

@Component({
  selector: 'app-survey-test',
  templateUrl: './survey-test.component.html',
  styleUrls: ['./survey-test.component.scss']
})
export class SurveyTestComponent {

  survey : any = {};
  isLoading : boolean = false;
  answerArray : any[] = [];
  questionsToWarn : string[] =  [];
  openVideoNumeral :  string =  '';
  openVideoType :  string =  '';
  iframeHtml ?: SafeHtml;
  finalAnswerId :  string = '';
  goToSurvey :  boolean =  false;
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

  window.addEventListener('popstate', (event) => {
    this.saveSurveyAnswers();
});

  }

  ngOnInit(): void {
      this.loadSurvey();
  }


  async loadSurvey(): Promise<void> {
    this.isLoading = true; // Inicia el estado de carga
    try {
      const surveyState = await this.getSurveyById();
      if(surveyState === 'created'){
        this.goToSurvey =  true;
      }
      this.CheckingAnswerByDefect();
    } catch (error) {
      console.error('Error initializing survey', error);
    } finally {
      this.isLoading = false; // Finaliza el estado de carga
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
                 this.survey = userResponse; 
                 return 'created';
              }
          }
        }else {
          this.getAnswers(survey.id);
          this.survey = survey; 
          return 'finded';
        }
      }      
      
    } catch (error) {
      console.error('Error fetching survey', error);
    } finally {
      this.isLoading = false; 
    }
  }

  async getAnswers (surveyId:string) : Promise<void> {
    const answers : any = await this.answerService.getAnswer().toPromise();
    if(answers) {
      const answer = answers.find((e:any)=> e.id_survey === surveyId);
      if(answer){
        this.answerArray = answer.answers;
        console.log(this.answerArray);
      }
    }
  }


  reloadPage() :  void {
    window.location.reload();
    this.goToSurvey = false;
  }

  goToHome() :  void {
    this.router.navigate(['/userpanel']);
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


async surveyStateInProgress() : Promise<void> {
  const editBody = {
    state:'En Progreso',
    updated_date:  this.formatDate(),
  } 
  try {
    await this.userSurveyService.updateSurvey(this.survey.id, editBody).toPromise();  
  } catch (error) {
    console.log(error);
  }
}

async saveSurveyAnswers() :  Promise<void>{
  this.isLoading = true; // Mostrar el spinner
      try {
          const answers : any = await this.answerService.getAnswer().toPromise();
          if(answers){
            const checkAnswer =  answers.find((e:any)=> this.survey.id === e.id_survey);
            const editBody = {
              state:'En Progreso',
              updated_date: this.formatDate(),
              answers : this.answerArray,
             } 
            if(checkAnswer){
              const editedAnswer : any = await this.answerService.updateAnswer(checkAnswer.id, editBody) .toPromise();
              if(editedAnswer){
                this.surveyStateInProgress();
                this.finalAnswerId = checkAnswer.id;
                this.toastr.success('Respuestas guardadas con Exito');
              }
            }else{
              const createBody = {
                id_survey: this.survey.id,
                id: uuidv4(),
                state:'Creada',
                date_creation :  this.formatDate(),
                updated_date: this.formatDate(),
                answers : this.answerArray,
               } 
              const createdAnswer : any = await this.answerService.createAnswer(createBody).toPromise();
              if(createdAnswer){
                this.surveyStateInProgress();
                this.finalAnswerId = createdAnswer.id;
                this.toastr.success('Respuestas guardadas con Exito');
              }
            }
          }
      } catch (error) {
        console.error('Error creating survey', error);
      } finally {
        this.isLoading = false; 
      }
}

async finishAndSaveSurvey() :  Promise<void>{
  this.isLoading = true; // Mostrar el spinner
      try {
        await this.saveSurveyAnswers();
          const editBody = {
            state:'Finalizada',
          } 
          const editedAnswer : any = await this.answerService.updateAnswer(this.finalAnswerId, editBody).toPromise();
          if(editedAnswer){
            const editedUserSurvey : any = await this.userSurveyService.updateSurvey(this.survey.id, editBody).toPromise();
            if(editedUserSurvey){
              this.router.navigate(['/userpanel']);
            }
          }
      } catch (error) {
        console.error('Error creating survey', error);
      } finally {
        this.isLoading = false; 
      }
}

finishSurvey() : void {
  
  // Cheking required questions without answer
   if(this.ChekingRequiredQuestions()){
    this.toastr.info('Debes contestar las preguntas Obligatorias');
   }else{
    Swal.fire({
      title: "¿Esta seguro?",
      text: "No podras revertir los cambios!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      cancelButtonText: 'Cancelar',
      confirmButtonText: "Si, Enviar!"
    }).then((result) => {
      if (result.isConfirmed) {
        this.finishAndSaveSurvey();
        Swal.fire({
          title: "Enviada!",
          text: "La encuesta ha sido enviada.",
          icon: "success"
        });
      }
    });
    
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
  if(questionAnswer !== undefined) {
    if(questionAnswer.questionInfo.type === 'checkbox'){
      return questionAnswer.answer.option;
    }
    return questionAnswer.answer;
  } 
}


getTextFieldValue(numeral : string) : string {
  const questionAnswer =  this.answerArray.find((e:any)=>e.questionInfo.numeral === numeral);
  if(questionAnswer !== undefined) {
    if(questionAnswer.questionInfo.type === 'checkbox' && questionAnswer.answer.another_field !== '' && questionAnswer.answer.another_field !== undefined){
      return questionAnswer.answer.another_field;
    } else if (questionAnswer.questionInfo.type === 'open' && questionAnswer.answer !== '' && questionAnswer.answer != undefined) {
      return questionAnswer.answer;
    }
  } else {
    return '';
  }
  return '';
}


getTableQuestionAnswer(numeral:string,y:number,i:number) : boolean {
  for (let index = 0; index < this.answerArray.length; index++) {
    if(this.answerArray[index].questionInfo.numeral === numeral && this.answerArray[index].answer !== undefined){
        if(this.answerArray[index].answer.row === i && this.answerArray[index].answer.column === y){
         return true;
         }
     }
  }
  return false;
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

deepEqual(obj1: any, obj2: any): boolean {
  if (obj1 === obj2) {
    return true;
  }

  if (typeof obj1 !== 'object' || typeof obj2 !== 'object' || obj1 === null || obj2 === null) {
    return false;
  }

  const keys1 = Object.keys(obj1);
  const keys2 = Object.keys(obj2);

  if (keys1.length !== keys2.length) {
    return false;
  }

  for (let key of keys1) {
    if (!keys2.includes(key) || !this.deepEqual(obj1[key], obj2[key])) {
      return false;
    }
  }

  return true;
}

areFieldsEmpty(obj: any): boolean {
    if(typeof obj === 'number' && obj !== undefined && obj !== null) return false; 
    if (obj === null) return true;
    if (Array.isArray(obj) && obj.length === 0) return true;
    if (Object.keys(obj).length === 0) return true;

  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      const value = obj[key];
      if (
        value !== null &&          // No es null
        value !== undefined &&     // No es undefined
        value !== '' &&            // No es una cadena vacía
        !(Array.isArray(value) && value.length === 0) &&  // No es un array vacío
        !(typeof value === 'object' && Object.keys(value).length === 0) // No es un objeto vacío
      ) {
        return false; 
      }
    }
  }
  return true; 
}



compareAnswer(numeral:string,obj2:any) : boolean {
  const questionAnswer =  this.answerArray.find((e:any)=>e.questionInfo.numeral === numeral);
  if(questionAnswer) {
   const check = this.deepEqual(questionAnswer.answer,obj2);
   return check;
  }
  return false;
}

getTextareaValue(event: Event): string {
  const target = event.target as HTMLTextAreaElement;
  return target?.value || '';
}

veirifyRows(item:any) :  void {
  const updatedAnswers = [];
  let foundAndUpdated = false;

  for (let index = 0; index < this.answerArray.length; index++) {
    const currentAnswer = this.answerArray[index];

    if (currentAnswer.questionInfo.numeral === item.questionInfo.numeral  && currentAnswer.answer !== undefined ) {
      if (currentAnswer.answer.row === item.answer.row && currentAnswer.answer.column === item.answer.column) {
        foundAndUpdated = true;} 
      else if (currentAnswer.answer.row === item.answer.row && currentAnswer.answer.column !== item.answer.column) {
        updatedAnswers.push(item);
        foundAndUpdated = true; 
      } 
      else {
        updatedAnswers.push(currentAnswer);
      }
    } else {
      updatedAnswers.push(currentAnswer); 
    }
  }

  if (!foundAndUpdated) {
    updatedAnswers.push(item);
  }
  this.answerArray = updatedAnswers;
}

setAnswerTable(answer : any) : void {
  let body = {
    questionInfo: answer.item,
    answer : answer.answer,   
  }
  this.veirifyRows(body);
}

setAnswer(answer:any) :  void {
  
  let body = {
    questionInfo: answer.item,
    answer :  answer.answer,   
  }

  const checkIndex =  this.answerArray.findIndex((q:any)=> q.questionInfo.id ===  body.questionInfo.id);

  if(checkIndex === -1){
      this.answerArray.push(body);
  }else {
      if(this.compareAnswer(body.questionInfo.numeral, body.answer)){
        this.answerArray.splice(checkIndex,1);
      }else if(this.areFieldsEmpty(body.answer)){
        this.answerArray.splice(checkIndex,1);
      }
      else {
        this.answerArray[checkIndex].answer = body.answer;
      }
  }
}

}

