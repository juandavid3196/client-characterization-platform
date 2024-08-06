
export const questionConfigs = [

  {
    id: '',
    numeral: null,
    type: 'checkbox',
    text: '',
    description:'',
    icon:'check-icon',
    note_text:'',
    options: [''],
    addedToBank:  false,
    settings: {
      another_field: false,
      question_multimedia: '',
      answer_multimedia:'',
      required: false,
      defected_answer:false,
      answer_value:'',
      add_note:false,
    }
  },
  {
    id: '',
    numeral: null,
    type: 'table',
    text: '',
    description:'',
    icon:'table-icon',
    note_text:'',
    addedToBank:false,
    no_visible_title:'',
    no_visible_rows:[''],
    options: [''],
    settings: {
      question_multimedia: '',
      answer_multimedia:'',
      required: false,
      add_note:false,
    }
  },
  {
    id: '',
    numeral: null,
    type: 'scale',
    text: '',
    description:'',
    icon:'scale-opinion-icon',
    note_text:'',
    addedToBank:  false,
    scale_value: 0,
    settings: {
      question_multimedia: '',
      answer_multimedia:'',
      steps: 0,
      left_label : 'Menor',
      center_label:'Neutral',
      right_label:'Mayor',
      answer_value:'',
      required: false,
      defected_answer:false,
      add_note:false,
      apply:false,
    }
  },

];