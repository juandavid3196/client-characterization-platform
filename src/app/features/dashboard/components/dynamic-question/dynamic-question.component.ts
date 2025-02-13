import {
  Component,
  EventEmitter,
  Input,
  Output,
  QueryList,
  SimpleChanges,
  ViewChildren,
} from '@angular/core';
import {
  AbstractControl,
  FormArray,
  FormBuilder,
  FormGroup,
  ValidationErrors,
} from '@angular/forms';
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
  categoryIndex!: number;
  subcategoryIndex!: number;

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
        question_video: '',
        question_image: '',
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
    this.onQuestionSelect();
  }

  //Validators

  // Validador para el iframe de YouTube
  validateIframeYoutube(control: any) {
    if (!control.value) return null;
    const iframeRegex =
      /<iframe.*src="https:\/\/www\.youtube\.com\/embed\/.*".*<\/iframe>/;
    return iframeRegex.test(control.value) ? null : { invalidIframe: true };
  }

  // Validador personalizado
  validateUrl(regex: RegExp) {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value;
      if (!value) {
        return null; // Campo vacío es válido
      }
      return regex.test(value) ? null : { invalidUrl: true }; // Aplica la validación solo si hay contenido
    };
  }

  // Handle categories

  createCategory(): FormGroup {
    return this.fb.group({
      title: [''],
      description: [''],
      category_video: ['', [this.validateIframeYoutube]],
      category_image: ['', [this.validateUrl(/https?:\/\/[^\s$.?#].[^\s]*$/)]],
      subcategories: this.fb.array([this.createSubcategory()]),
    });
  }

  get categories(): FormArray {
    return this.dynamicForm.get('categories') as FormArray;
  }

  addCategory(categoryIndex: number, event: Event) {
    event.stopPropagation();
    this.categories.insert(categoryIndex + 1, this.createCategory());
  }

  editCategory(index: number, field: string, event: Event) {
    const inputElement = event.target as HTMLInputElement;
    const newValue = inputElement.value;

    const category = this.categories.at(index);
    if (category) {
      category.patchValue({
        ...category.value,
        [field]: newValue,
      });
    }
  }

  deleteCategory(index: number, event: Event) {
    event.stopPropagation();
    if (this.categories.length === 1) {
      const optionGroup = this.categories.at(0) as FormGroup;
      optionGroup.patchValue({
        title: '',
        description: '',
        category_video: '',
        category_image: '',
      });
      const rowsArray = optionGroup.get('subcategories') as FormArray;
      while (rowsArray.length) {
        rowsArray.removeAt(0);
      }
      rowsArray.push(this.createSubcategory());
    } else {
      this.categories.removeAt(index);
    }
  }

  moveCategoryUp(categoryIndex: number, event: Event): void {
    event.stopPropagation();
    if (categoryIndex === 0) return;

    const categories = this.dynamicForm.get('categories') as FormArray;

    const category = categories.at(categoryIndex);
    const previousCategory = categories.at(categoryIndex - 1);

    categories.removeAt(categoryIndex);
    categories.removeAt(categoryIndex - 1);
    categories.insert(categoryIndex - 1, category);
    categories.insert(categoryIndex, previousCategory);
  }

  moveCategoryDown(caregoryIndex: number, event: Event): void {
    event.stopPropagation();
    const categories = this.dynamicForm.get('categories') as FormArray;

    if (caregoryIndex === categories.length - 1) return;

    const category = categories.at(caregoryIndex);
    const nextCategory = categories.at(caregoryIndex + 1);

    categories.removeAt(caregoryIndex + 1);
    categories.removeAt(caregoryIndex);
    categories.insert(caregoryIndex, nextCategory);
    categories.insert(caregoryIndex + 1, category);
  }

  showCategory(index: number): void {
    this.categoryIndex = index;
  }

  onQuestionSelect() {
    const categories = this.dynamicForm.get('categories') as FormArray;

    if (categories.length === 0) {
      categories.push(this.createCategory());
    }

    const firstCategory = categories.at(0).get('subcategories') as FormArray;
    if (firstCategory.length === 0) {
      firstCategory.push(this.createSubcategory());
    }
  }

  //Handle Subcategory

  createSubcategory(): FormGroup {
    return this.fb.group({
      sub_title: [''],
      sub_description: [''],
      subcategory_video: ['', [this.validateIframeYoutube]],
      subcategory_image: [
        '',
        [this.validateUrl(/https?:\/\/[^\s$.?#].[^\s]*$/)],
      ],
    });
  }

  getSubcategories(categoryIndex: number): FormArray {
    return this.categories.at(categoryIndex).get('subcategories') as FormArray;
  }

  addSubcategory(
    categoryIndex: number,
    subcategoryIndex: number,
    event: Event
  ) {
    event.stopPropagation();
    this.getSubcategories(categoryIndex).insert(
      subcategoryIndex + 1,
      this.createSubcategory()
    );
  }

  deleteSubcategory(
    categoryIndex: number,
    subcategoryIndex: number,
    event: Event
  ) {
    event.stopPropagation();
    if (this.getSubcategories(categoryIndex).length === 1) {
      const optionGroup = this.getSubcategories(categoryIndex).at(
        0
      ) as FormGroup;
      optionGroup.patchValue({
        sub_title: '',
        sub_description: '',
        subcategory_video: '',
        subcategory_image: '',
      });
    } else {
      this.getSubcategories(categoryIndex).removeAt(subcategoryIndex);
    }
  }

  editSubcategory(
    categoryIndex: number,
    subcategoryIndex: number,
    field: string,
    event: Event
  ) {
    const inputElement = event.target as HTMLInputElement;
    const newValue = inputElement.value;

    const subcategories = this.getSubcategories(categoryIndex);
    const subcategory = subcategories.at(subcategoryIndex);

    if (subcategory) {
      subcategory.patchValue({
        ...subcategory.value,
        [field]: newValue,
      });
    }
  }

  moveSubcategoryUp(
    caregoryIndex: number,
    subcategoryIndex: number,
    event: Event
  ): void {
    event.stopPropagation();
    if (subcategoryIndex === 0) return;

    const subcategories = this.getSubcategories(caregoryIndex);

    const subcategory = subcategories.at(subcategoryIndex);
    const previousSubcategory = subcategories.at(subcategoryIndex - 1);

    subcategories.removeAt(subcategoryIndex);
    subcategories.removeAt(subcategoryIndex - 1);
    subcategories.insert(subcategoryIndex - 1, subcategory);
    subcategories.insert(subcategoryIndex, previousSubcategory);
  }

  moveSubcategoryDown(
    caregoryIndex: number,
    subcategoryIndex: number,
    event: Event
  ): void {
    event.stopPropagation();
    const subcategories = this.getSubcategories(caregoryIndex);

    if (subcategoryIndex === subcategories.length - 1) return;

    const subcategory = subcategories.at(subcategoryIndex);
    const nextSubcategory = subcategories.at(subcategoryIndex + 1);

    subcategories.removeAt(subcategoryIndex + 1);
    subcategories.removeAt(subcategoryIndex);
    subcategories.insert(subcategoryIndex, nextSubcategory);
    subcategories.insert(subcategoryIndex + 1, subcategory);
  }

  showSubcategory(categoryIndex: number, subcategoryIndex: number): void {
    this.categoryIndex = categoryIndex;
    this.subcategoryIndex = subcategoryIndex;
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

    if (
      Array.isArray(storedQuestions) &&
      storedQuestions.length > 0 &&
      this.elementData?.id
    ) {
      this.dashboardOptions = storedQuestions;
      const element = storedQuestions.find(
        (e: any) => e.id === this.elementData.id
      );

      if (element) {
        this.dynamicForm.patchValue(element);

        // Configurar el estado de qMessage
        const settings = this.dynamicForm.get('settings') as FormGroup;
        this.qMessage =
          settings.get('question_video')?.value ||
          settings.get('question_image')?.value
            ? true
            : false;

        // Gestionar las categorías
        const categoriesArray = this.dynamicForm.get('categories') as FormArray;
        categoriesArray.clear();

        if (Array.isArray(element.categories)) {
          element.categories.forEach((option: any) => {
            const categoriesGroup = this.createCategory();
            categoriesGroup.patchValue({
              ...option,
              subcategories: undefined,
            });

            const subcategoriesArray = categoriesGroup.get(
              'subcategories'
            ) as FormArray;
            subcategoriesArray.clear();

            if (Array.isArray(option.subcategories)) {
              option.subcategories.forEach((row: any) => {
                const subcategoryGroup = this.fb.group({
                  sub_title: [row.sub_title || ''],
                  sub_description: [row.sub_description || ''],
                  subcategory_video: [row.subcategory_video || ''],
                  subcategory_image: [row.subcategory_image || ''],
                });
                subcategoriesArray.push(subcategoryGroup);
              });
            }

            categoriesArray.push(categoriesGroup);
          });
        } else {
          console.warn('categories no es un array:', element.categories);
        }

        this.spinner = false;
      } else {
        console.warn('Elemento no encontrado:', this.elementData.id);
        this.spinner = true;
      }
    } else {
      console.warn('Datos no disponibles en el local storage o id no válido.');
      this.spinner = true;
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
        this.qMessage =
          settings.get('question_video')?.value ||
          settings.get('question_image')?.value
            ? true
            : false;
      }
    }
  }

  closeVideoWindow(): void {
    this.openVideoWindow = false;
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
      type: 'dynamic',
      text: '',
      description: '',
      icon: 'dynamic-q-icon',
      note_text: '',
      addedToBank: false,
      categories: this.fb.array([this.createCategory()]),
      settings: this.fb.group({
        question_video: '',
        question_image: '',
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
