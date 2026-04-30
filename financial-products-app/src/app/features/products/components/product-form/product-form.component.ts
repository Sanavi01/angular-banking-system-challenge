import {
  Component,
  Input,
  Output,
  EventEmitter,
  OnInit,
  OnDestroy,
  OnChanges,
  SimpleChanges,
  ChangeDetectionStrategy,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Product } from '../../../../core/models/product.model';
import { PRODUCT_VALIDATORS, PRODUCT_ERROR_MESSAGES } from '../../../../shared/validators/product-validators';
import { dateNotPastValidator } from '../../../../shared/validators/date-not-past.validator';
import { IdExistsValidator } from '../../../../shared/validators/id-exists.validator';
import { DateUtil } from '../../../../shared/utils/date.util';

@Component({
  selector: 'app-product-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './product-form.component.html',
  styleUrls: ['./product-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductFormComponent implements OnInit, OnDestroy, OnChanges {
  private destroy$ = new Subject<void>();

  @Input() product: Product | null = null;
  @Input() isEditMode = false;
  @Input() submitting = false;
  @Output() formSubmit = new EventEmitter<Product>();
  @Output() formReset = new EventEmitter<void>();

  form!: FormGroup;
  readonly errorMessages = PRODUCT_ERROR_MESSAGES;

  constructor(
    private fb: FormBuilder,
    readonly idExistsValidator: IdExistsValidator,
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      id: [
        { value: '', disabled: this.isEditMode },
        {
          validators: PRODUCT_VALIDATORS.id,
          asyncValidators: this.isEditMode
            ? []
            : [this.idExistsValidator.validate.bind(this.idExistsValidator)],
          updateOn: 'blur',
        },
      ],
      name: ['', PRODUCT_VALIDATORS.name],
      description: ['', PRODUCT_VALIDATORS.description],
      logo: ['', PRODUCT_VALIDATORS.logo],
      date_release: ['', [Validators.required, dateNotPastValidator()]],
      date_revision: [
        { value: '', disabled: true },
        PRODUCT_VALIDATORS.date_revision,
      ],
    });

    if (this.product) {
      this.form.patchValue(this.product);
    }

    this.form
      .get('date_release')
      ?.valueChanges.pipe(takeUntil(this.destroy$))
      .subscribe((value) => {
        const revisionDate = DateUtil.addOneYear(value);
        const dateRevisionControl = this.form.get('date_revision');
        if (revisionDate) {
          dateRevisionControl?.setValue(revisionDate);
        } else {
          dateRevisionControl?.setValue('');
        }
      });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['product'] && this.product && this.form) {
      this.form.patchValue(this.product);
    }
  }

  getErrorMessage(fieldName: string): string {
    const control = this.form.get(fieldName);
    if (!control || !control.errors) return '';

    const fieldErrors = this.errorMessages[fieldName];
    if (!fieldErrors) return '';

    const errorKey = Object.keys(control.errors)[0];
    return fieldErrors[errorKey] || '';
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.formSubmit.emit(this.form.getRawValue());
  }

  onReset(): void {
    this.form.reset();
    this.formReset.emit();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
