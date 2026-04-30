/**
 * ProductForm — Logic Spec (puro, sin TestBed, sin DOM)
 *
 * Testea validaciones del FormGroup directamente.
 * No depende de Angular TestBed ni del componente.
 */
import { FormBuilder, Validators } from '@angular/forms';
import { PRODUCT_VALIDATORS } from '../../../../shared/validators/product-validators';
import { dateNotPastValidator } from '../../../../shared/validators/date-not-past.validator';

describe('ProductForm — Logic', () => {
  let fb: FormBuilder;
  let form: ReturnType<FormBuilder['group']>;

  beforeEach(() => {
    fb = new FormBuilder();
    form = fb.group({
      id: ['', PRODUCT_VALIDATORS.id],
      name: ['', PRODUCT_VALIDATORS.name],
      description: ['', PRODUCT_VALIDATORS.description],
      logo: ['', PRODUCT_VALIDATORS.logo],
      date_release: ['', [Validators.required, dateNotPastValidator()]],
      date_revision: ['', PRODUCT_VALIDATORS.date_revision],
    });
  });

  it('should have 6 controls initialized', () => {
    expect(form.get('id')).toBeTruthy();
    expect(form.get('name')).toBeTruthy();
    expect(form.get('description')).toBeTruthy();
    expect(form.get('logo')).toBeTruthy();
    expect(form.get('date_release')).toBeTruthy();
    expect(form.get('date_revision')).toBeTruthy();
  });

  it('should be invalid when empty', () => {
    expect(form.valid).toBe(false);
    expect(form.get('id')?.errors).toEqual({ required: true });
    expect(form.get('name')?.errors).toEqual({ required: true });
  });

  it('should validate id minlength (3 chars)', () => {
    const ctrl = form.get('id')!;
    ctrl.setValue('ab');
    ctrl.markAsTouched();

    expect(ctrl.errors).toEqual({
      minlength: { requiredLength: 3, actualLength: 2 },
    });
  });

  it('should accept id with exactly 3 chars', () => {
    const ctrl = form.get('id')!;
    ctrl.setValue('abc');
    expect(ctrl.errors).toBeNull();
  });

  it('should validate id maxlength (10 chars)', () => {
    const ctrl = form.get('id')!;
    ctrl.setValue('12345678901'); // 11 chars
    expect(ctrl.errors).toEqual({
      maxlength: { requiredLength: 10, actualLength: 11 },
    });
  });

  it('should validate name minlength (5 chars)', () => {
    const ctrl = form.get('name')!;
    ctrl.setValue('abcd');
    ctrl.markAsTouched();

    expect(ctrl.errors).toEqual({
      minlength: { requiredLength: 5, actualLength: 4 },
    });
  });

  it('should accept name with exactly 5 chars', () => {
    const ctrl = form.get('name')!;
    ctrl.setValue('abcde');
    expect(ctrl.errors).toBeNull();
  });

  it('should validate description minlength (10 chars)', () => {
    const ctrl = form.get('description')!;
    ctrl.setValue('123456789'); // 9 chars
    ctrl.markAsTouched();

    expect(ctrl.errors).toEqual({
      minlength: { requiredLength: 10, actualLength: 9 },
    });
  });

  it('should accept description with exactly 10 chars', () => {
    const ctrl = form.get('description')!;
    ctrl.setValue('1234567890'); // 10 chars
    expect(ctrl.errors).toBeNull();
  });

  it('should validate date_release is not in the past', () => {
    const ctrl = form.get('date_release')!;
    ctrl.setValue('2020-01-01');
    ctrl.markAsTouched();

    expect(ctrl.errors).toEqual({ dateNotPast: true });
  });

  it('should accept date_release equal to today or future', () => {
    const ctrl = form.get('date_release')!;
    ctrl.setValue('2099-12-31');
    expect(ctrl.errors).toBeNull();
  });

  it('should be valid when all fields are filled correctly', () => {
    form.patchValue({
      id: 'test-id',
      name: 'Producto de Prueba',
      description: 'Descripción de producto de prueba',
      logo: 'https://example.com/logo.png',
      date_release: '2099-12-31',
      date_revision: '2100-12-31',
    });
    expect(form.valid).toBe(true);
  });

  it('should mark field as touched after markAsTouched', () => {
    const ctrl = form.get('id')!;
    expect(ctrl.touched).toBe(false);
    ctrl.markAsTouched();
    expect(ctrl.touched).toBe(true);
  });
});
