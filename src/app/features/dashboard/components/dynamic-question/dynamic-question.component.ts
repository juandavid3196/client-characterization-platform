import {
  Component,
  EventEmitter,
  Input,
  Output,
  QueryList,
  SimpleChanges,
  ViewChild,
  ViewChildren,
} from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FilterSelectComponent } from '../../../../shared/components/filter-select/filter-select.component';
import { ToggleButtonComponent } from '../../../../shared/components/toggle-button/toggle-button.component';
import { DataBankService } from '../../services/data-bank.service';
import { Subscription } from 'rxjs';
import { DashboardlsService } from '../../services/dashboardls.service';

@Component({
  selector: 'app-dynamic-question',
  templateUrl: './dynamic-question.component.html',
  styleUrls: ['./dynamic-question.component.scss'],
})
export class DynamicQuestionComponent {
  @ViewChildren('appToggleButton')
  toggleButtons!: QueryList<ToggleButtonComponent>;

  dynamicForm: FormGroup;
  addNote: boolean = false;
  required: boolean = false;
  qMessage: boolean = false;
  changeSection: boolean = true;
  spinner: boolean = false;
  dashboardOptions: any[] = [];
  formSubscription: Subscription | undefined;
  openVideoWindow: boolean = false;
  videoUrlType: string = '';

  @Input() elementData: any = {};
  @Output() refreshList = new EventEmitter();

  constructor(
    private fb: FormBuilder,
    private dataBankService: DataBankService,
    private dashboardlsService: DashboardlsService
  ) {
    this.dynamicForm = this.fb.group({
      // create a fb.group for every Object
      id: '',
      numeral: null,
      type: 'dynamic',
      text: '',
      description: '',
      icon: 'dynamic-q-icon',
      categories: this.fb.array([this.createCategory()]),
      note_text: '',
      addedToBank: false,
      settings: this.fb.group({
        question_multimedia: '',
        required: false,
        add_note: false,
      }),
    });
  }

  ngOnInit() {
    this.loadFromQuestionData();
    this.initializeFormValues();
    this.formSubscription = this.dynamicForm.valueChanges.subscribe((value) => {
      if (this.elementData.id !== undefined) {
        this.updateDashboardOptions(value);
      }
    });
  }

  // Handle categories

  createCategory(): FormGroup {
    return this.fb.group({
      title: ['', Validators.required],
      description: [''],
      category_video: [''],
      category_image: [''],
      subcategories: this.fb.array([this.createSubcategory()]),
    });
  }

  get categories(): FormArray {
    return this.dynamicForm.get('categories') as FormArray;
  }

  addCategory() {
    this.categories.push(this.createCategory());
  }

  editCategory(index: number, event: Event) {
    const inputElement = event.target as HTMLInputElement;
    const newValue = inputElement.value;

    const category = this.categories.at(index);
    if (category) {
      category.patchValue({
        ...category.value,
        title: newValue,
      });
    }
  }

  deleteCategory(index: number) {
    if (this.categories.length === 1) {
      const optionGroup = this.categories.at(0) as FormGroup;
      optionGroup.patchValue({
        text: '',
        description: '',
        category_video: '',
        category_image: '',
      });
      const rowsArray = optionGroup.get('subcategories') as FormArray;
      while (rowsArray.length) {
        rowsArray.removeAt(0);
      }
      rowsArray.push(this.fb.control(''));
    } else {
      this.categories.removeAt(index);
    }
  }

  //Handle Subcategory

  createSubcategory(): FormGroup {
    return this.fb.group({
      sub_title: ['', Validators.required],
      sub_description: [''],
      subcategory_video: [''],
      subcategory_image: [''],
    });
  }

  getSubcategories(categoryIndex: number): FormArray {
    return this.categories.at(categoryIndex).get('subcategories') as FormArray;
  }

  addSubcategory(categoryIndex: number) {
    this.getSubcategories(categoryIndex).push(this.createSubcategory());
  }

  deleteSubcategory(categoryIndex: number, subcategoryIndex: number) {
    const subcategories = this.getSubcategories(categoryIndex);
    subcategories.removeAt(subcategoryIndex);
  }

  editSubcategory(
    categoryIndex: number,
    subcategoryIndex: number,
    event: Event
  ) {
    const inputElement = event.target as HTMLInputElement;
    const newValue = inputElement.value;

    const subcategories = this.getSubcategories(categoryIndex);
    const subcategory = subcategories.at(subcategoryIndex);

    if (subcategory) {
      subcategory.patchValue({
        ...subcategory.value,
        title: newValue,
      });
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['elementData'].currentValue.id) {
      this.loadFromQuestionData();
    }
  }

  private updateDashboardOptions(value: any): void {
    if (this.elementData.id !== undefined) {
      const index = this.dashboardOptions.findIndex(
        (e) => e.id === this.elementData.id
      );
      if (index !== -1) {
        this.dashboardOptions[index] = {
          ...this.dashboardOptions[index],
          ...value,
        };
        this.dashboardlsService.saveDashboardOptions(this.dashboardOptions);
      }
    }
  }

  saveOpenData(): void {
    const storedQuestions = this.dashboardlsService.getDashboardOptions();

    if (storedQuestions) {
      const index = storedQuestions.findIndex(
        (e: any) => e.id === this.dynamicForm.value.id
      );

      if (index !== -1) {
        storedQuestions[index] = {
          ...storedQuestions[index],
          ...this.dynamicForm.value,
        };
        this.dashboardlsService.saveDashboardOptions(storedQuestions);
        console.log('Questions updated successfully in Local Storage');
      } else {
        console.error('Question not found in Local Storage');
      }
    } else {
      console.error('No questions found in Local Storage');
    }
  }

  async loadFromQuestionData(): Promise<void> {
    const storedQuestions = this.dashboardlsService.getDashboardOptions();

    if (storedQuestions && this.elementData.id) {
      this.dashboardOptions = storedQuestions;
      const element = storedQuestions.find(
        (e: any) => e.id === this.elementData.id
      );

      if (element) {
        this.dynamicForm.patchValue(element);

        // Configurar el estado de qMessage
        const settings = this.dynamicForm.get('settings') as FormGroup;
        this.qMessage = !!settings.get('question_multimedia')?.value;

        // Gestionar las categorías
        const categoriesArray = this.dynamicForm.get('categories') as FormArray;
        this.clearFormArray(categoriesArray);

        if (element.categories && Array.isArray(element.categories)) {
          element.categories.forEach((option: any) => {
            const categoriesGroup = this.createCategory();
            categoriesGroup.patchValue(option);

            // Gestionar subcategorías
            const subcategoriesArray = categoriesGroup.get(
              'subcategories'
            ) as FormArray;
            this.clearFormArray(subcategoriesArray);

            if (option.subcategories && Array.isArray(option.subcategories)) {
              option.subcategories.forEach((row: any) => {
                subcategoriesArray.push(this.fb.control(row));
              });
            }

            categoriesArray.push(categoriesGroup);
          });
        }

        this.spinner = false;
      } else {
        this.spinner = true;
      }
    } else {
      this.spinner = true;
    }
  }

  private clearFormArray(formArray: FormArray): void {
    while (formArray.length) {
      formArray.removeAt(0);
    }
  }

  initializeFormValues(): void {
    const settings = this.dynamicForm.get('settings') as FormGroup;
    this.addNote = settings.get('add_note')?.value;
    this.required = settings.get('required')?.value;
  }

  // Handle controls

  reloadAllControls() {
    if (this.toggleButtons) {
      this.toggleButtons.forEach((toggleButton) => {
        toggleButton?.reloadComponent();
      });
    }
  }

  getToggleValues(values: any): void {
    let settings = this.dynamicForm.get('settings') as FormGroup; // access to a specific property.

    if (settings.controls.hasOwnProperty(values.name)) {
      // verify a property

      if (this.checkInfo(values)) {
        settings.patchValue({ [values.name]: values.state }); // modify value
        this.initializeFormValues();
      } else {
        return;
      }
    }
  }

  checkInfo(values: any): boolean {
    if (values.name === 'add_note' && values.state === false) {
      this.dynamicForm.patchValue({ ['note_text']: '' });
    }
    return true;
  }

  //Video URL

  addVideoUrl(controlName: string): void {
    this.loadUrlsData();
    this.videoUrlType = controlName;
    this.openVideoWindow = true;
  }

  loadUrlsData(): void {
    const storedQuestions = this.dashboardlsService.getDashboardOptions();

    if (storedQuestions && this.elementData.id) {
      this.dashboardOptions = storedQuestions;
      const element = storedQuestions.find(
        (e: any) => e.id === this.elementData.id
      );

      if (element) {
        this.dynamicForm.patchValue(element);
        const settings = this.dynamicForm.get('settings') as FormGroup;
        this.qMessage = settings.get('question_multimedia')?.value
          ? true
          : false;
      }
    }
  }

  closeVideoWindow(): void {
    this.openVideoWindow = false;
  }

  resetInputFile(controlName: string) {
    const settings = this.dynamicForm.get('settings') as FormGroup;
    settings.patchValue({ [controlName]: '' });
    this.qMessage = !this.qMessage;
  }

  onChangeSection(): void {
    this.changeSection = !this.changeSection;
  }

  onResetForm(): void {
    this.resetdynamicForm();
    this.resetFormState();
  }

  resetdynamicForm(): void {
    this.dynamicForm.reset({
      id: this.elementData.id || '',
      numeral: this.elementData.numeral || '',
      type: 'open',
      text: '',
      description: '',
      icon: 'open-q-icon',
      note_text: '',
      addedToBank: false,
      settings: this.fb.group({
        question_multimedia: '',
        required: false,
        add_note: false,
      }),
    });
  }

  resetFormState(): void {
    this.qMessage = false;
    this.initializeFormValues();
    this.reloadAllControls();
  }

  addToBank(): void {
    this.dynamicForm.patchValue({ ['addedToBank']: true });
    this.dataBankService.createBank(this.dynamicForm.value).subscribe(
      (response) => {
        console.log('Bank created', response);
      },
      (error) => {
        console.error('Error creating bank', error);
      }
    );
  }

  onSubmit(): void {
    if (this.dynamicForm.valid) {
      this.saveOpenData();
      this.refreshList.emit();
    }
  }

  ngOnDestroy(): void {
    if (this.formSubscription) {
      this.formSubscription.unsubscribe();
      this.saveOpenData();
      this.onResetForm();
    }
  }
}
