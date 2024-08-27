import { Component} from '@angular/core';
import { questionConfigs } from '../../models/questionsConfig.model';
import { Section } from '../../models/section.model';
import { v4 as uuidv4 } from 'uuid';
import { DashboardlsService } from '../../services/dashboardls.service';
import { SurveyService } from 'src/app/features/surveys/services/survey.service';
import { ToastrService } from 'ngx-toastr';
import { format } from 'date-fns';
import { EventBusService } from 'src/app/core/services/eventBus.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-dashboard-main',
  templateUrl: './dashboard-main.component.html',
  styleUrls: ['./dashboard-main.component.scss']
})
export class DashboardMainComponent {

  openQuestion : boolean = false;
  sectionSelected : Section | null = null;
  dashboardOptions: any[]= [];
  numeralList !: number;
  questionConfigs = questionConfigs; 
  questionIndex : number =0;
  indexPosition : string  = 'back';
  indexSelected!:number | null;
  elementSelected : any = {};
  databankSection: boolean = false;
  settingSection: boolean = false;
  btnSelected : string = 'dashboard';
  bankIndex : any = {index:0,position:''};
  editSection : boolean = false;
  openPreview : boolean = false;
  isLoading : boolean = false;
  survey : any = {};

  constructor(
    private dashboardlsService : DashboardlsService,
    private surveyService: SurveyService,  
    private toastr: ToastrService,
    private eventBusService: EventBusService,
    private router: Router,
  ){
    window.addEventListener('beforeunload', (event) => {
        this.saveDashboardData();
    });

    window.addEventListener('popstate', (event) => {
          this.saveDashboardData();
          this.eventBusService.emit('dashboardDataSaved', { someData: 'data' });
    });
  }

  // Local Storage Info

  ngOnInit() : void {
    this.getSurveyData();
    this.getQuestions();
    this.initializeDashboardValues();
  } 

  goToSurveyPage(): void {
    this.saveDashboardData();
    this.router.navigate(['/surveys']);
  }

  getSurveyData() : void {
    const surveyString =  localStorage.getItem('survey');
    this.survey =  (surveyString) ? JSON.parse(surveyString) : '';
  }

  getQuestions(): void {
    this.dashboardOptions = this.dashboardlsService.getDashboardOptions();
  }

  formatDate(): string {
    const date = new Date();
    return format(date, 'dd/MM/yyyy');
  }

  
  async saveDashboardData(): Promise<void> {
    this.isLoading = true; // Mostrar el spinner
    try {
      const surveyString = localStorage.getItem('survey');
      const survey = (surveyString) ? JSON.parse(surveyString) : '';  
      survey.questions = this.dashboardlsService.getDashboardOptions();
      survey.state = 'Editada';
      survey.updated_date = this.formatDate();
      const response = await this.surveyService.updateSurvey(survey.id, survey).toPromise();
      if (response) {
        this.toastr.success("Encuesta Guardada con Éxito");
      }
  
    } catch (error) {
      console.error('Error creating survey', error);
    } finally {
      this.isLoading = false; 
    }
  }
  
  updateDashboardQuestions(item: any[]): void {
    this.addNumeralToQuestions();
    this.dashboardlsService.saveDashboardOptions(item);
    this.onRefreshList();
  }



  loadQuestionsFromLocalStorage(): void {
    const storedOptions = this.dashboardlsService.getDashboardOptions();
    if (storedOptions) {
      this.dashboardOptions = storedOptions;
      this.editSection = false;
    }
  }


  initializeDashboardValues(): void {
    if(this.dashboardOptions.length > 0 ){
      this.elementSelected = this.dashboardOptions[0];
      this.indexSelected = 0;
    }
  } 



  openQuestionsMenu(index?:number,position?:string) : void {
    this.openQuestion = !this.openQuestion;
    if(typeof index === 'number'){
      this.bankIndex.index = index;
      this.bankIndex.position = position;
    }
  }

  onSelectedType(type:string): void {
    let selectedQuestion = this.questionConfigs.find(q=> q.type === type);
    if(selectedQuestion){
      // Asignar un ID único si no existe
      selectedQuestion.id = uuidv4(); // Generar un nuevo ID único   
        if(this.questionIndex === 0  && this.indexPosition === 'back'){

          this.dashboardOptions.unshift(selectedQuestion);
          this.updateDashboardQuestions(this.dashboardOptions);
          this.onElementSelected(0,selectedQuestion);

        }else if (this.questionIndex >= 0 && this.indexPosition === 'forward' ) {
          
          this.dashboardOptions.splice(this.questionIndex + 1, 0, selectedQuestion);
          this.updateDashboardQuestions(this.dashboardOptions);
          this.onElementSelected(this.questionIndex + 1, selectedQuestion);
       
        }else if(this.indexPosition === 'end'){  
          
          this.dashboardOptions.push(selectedQuestion);
          this.updateDashboardQuestions(this.dashboardOptions);
          this.onElementSelected(this.dashboardOptions.length -1,selectedQuestion);
    }

    this.questionIndex = 0;
    this.indexPosition = '';
  }

}

  addNumeralToQuestions() : void {
    let numeralList = 1;
    for(let i =0; i< this.dashboardOptions.length; i++){
      if(this.dashboardOptions[i].type !== 'section'){
        this.dashboardOptions[i].numeral = numeralList;
        numeralList +=1;
      }
    }
  }

  onSectionSelected(section:string): void {
    
    if(this.questionIndex === 0  && this.indexPosition === 'back'){
        this.dashboardOptions.unshift(section);
        this.updateDashboardQuestions(this.dashboardOptions);
        this.onElementSelected(0,{type:'section'});
    }else if(this.questionIndex >= 0  && this.indexPosition === 'forward') {
        this.dashboardOptions.splice(this.questionIndex + 1, 0, section);
        this.updateDashboardQuestions(this.dashboardOptions);
        this.onElementSelected(this.questionIndex + 1,{type:'section'});
    }else{
      this.dashboardOptions.push(section);
      this.updateDashboardQuestions(this.dashboardOptions);
      this.onElementSelected(this.dashboardOptions.length - 1,{type:'section'});
    }

    this.questionIndex = 0;
    this.indexPosition = '';
  }


  deleteQuestion(index:number): void {

    this.selectAfterDelete(index);
    this.dashboardOptions.splice(index, 1);
    this.updateDashboardQuestions(this.dashboardOptions);
  }

    
  addNewElement(index:number,position:string): void {
    this.questionIndex= index;
    this.indexPosition = position;
    this.openQuestionsMenu(index,position);
  }

  onElementSelected(index:number, element:any):void {
    this.indexSelected = index;
    if(element.type !== 'section'){
      this.elementSelected = element;
    }else{
     this.elementSelected = {};
    }
  }

  setIndexDataBank(data:any) : void {
    this.onElementSelected(data.index,data.element);
  }

  selectElement(index: number) : void {
      const storageElement = this.dashboardlsService.getDashboardOptions();
      if(storageElement){
        this.dashboardOptions = storageElement;
        this.indexSelected = index;
        this.elementSelected = this.dashboardOptions[index];
        if(this.elementSelected.type === 'section'){
          this.editSection = true;
          this.openQuestionsMenu();
        }
      }
  }

  changeEditSection() :  void {
    this.editSection =  false;
  }

  selectAfterDelete(index:number):void {
    if(index ===  0 && this.dashboardOptions.length === 1){
      this.elementSelected = {};
    }else if( this.dashboardOptions.length > 1 && index === this.dashboardOptions.length -1 ){
      this.onElementSelected(index-1,this.dashboardOptions[index-1]);  
    }else if(index === 0 && this.dashboardOptions.length === 2){
      this.onElementSelected(0,{...this.dashboardOptions[index+1],numeral:1});
    }else{
      this.onElementSelected(index,this.dashboardOptions[index+1]);
    }
  }

  deleteSection(index: number) : void {
      this.selectAfterDelete(index);
      this.dashboardOptions.splice(index, 1);  
      this.updateDashboardQuestions(this.dashboardOptions);
  }

  openDataBankSection():void {
    this.databankSection = !this.databankSection;
    if(this.databankSection === false){
      this.btnSelected = 'dashboard';
    }else {
      this.btnSelected = 'databank';
    }
  }

  openPreviewSection(): void {
    this.openPreview = !this.openPreview;
  }
 
  openSettingSection():void {
    this.settingSection = !this.settingSection;
    if(this.settingSection === false){
      this.btnSelected = 'dashboard';
    }else {
      this.btnSelected = 'setting';
    }
  }


  onRefreshList() : void {
    this.loadQuestionsFromLocalStorage();
  }

  async publishSurvey(): Promise<void> {
    this.isLoading = true; // Mostrar el spinner
    try {
      const surveyString = localStorage.getItem('survey');
      const survey = (surveyString) ? JSON.parse(surveyString) : '';  
      survey.questions = this.dashboardlsService.getDashboardOptions();
      survey.state = 'Publicada';
      survey.updated_date = this.formatDate();
      const response = await this.surveyService.updateSurvey(survey.id, survey).toPromise();
      if (response) {
        this.router.navigate(['/surveys']);
        this.toastr.success("Encuesta Publicada con Éxito");
      }
  
    } catch (error) {
      console.error('Error creating survey', error);
    } finally {
      this.isLoading = false; 
    }
  }
  

}


