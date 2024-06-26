export interface QuestionConfig {
    id: number | null;
    numeral: number | null;
    type: string;
    text:string;
    description?: string;
    icon:string;
    options?: string[];
    settings?:any;
  };


export const questionConfigs: QuestionConfig[] = [

  {
    id: null,
    numeral: null,
    type: 'checkbox',
    text: '',
    description:'',
    icon:'check-icon',
    options: [],
    settings: {
      another_field: false,
      question_multimedia: '',
      answer_multimedia:'',
      required: false,
      answer: {
        defected_answer: false,
        answer_value: ''
      },
      add_note:false,
    }
  },
  {
    id: null,
    numeral: null,
    type: 'table',
    text: '',
    description:'',
    icon:'table-icon',
    options: [],
    settings: {
      another_field: false,
      question_multimedia: '',
      answer_multimedia:'',
      required: false,
      answer: {
        defected_answer: false,
        answer_value: ''
      },
      add_note:false,
    }
  }

];