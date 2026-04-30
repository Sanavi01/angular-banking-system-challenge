import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ProductFormComponent } from './product-form.component';
import { IdExistsValidator } from '../../../../shared/validators/id-exists.validator';

describe('ProductFormComponent', () => {
  let component: ProductFormComponent;
  let fixture: ComponentFixture<ProductFormComponent>;
  let httpMock: HttpTestingController;

  // --- Helpers ---

  function createComponent(): void {
    fixture = TestBed.createComponent(ProductFormComponent);
    component = fixture.componentInstance;
  }

  function createEditComponent(): { comp: ProductFormComponent; fix: ComponentFixture<ProductFormComponent> } {
    const fix = TestBed.createComponent(ProductFormComponent);
    const comp = fix.componentInstance;
    comp.isEditMode = true;
    comp.product = {
      id: 'trj-crd',
      name: 'Test',
      description: 'Descripción de prueba',
      logo: 'https://x.com/logo.png',
      date_release: '2026-06-01',
      date_revision: '2027-06-01',
    };
    fix.detectChanges();
    return { comp, fix };
  }

  function fillFormValid(): void {
    component.form.patchValue({
      id: 'test-id',
      name: 'Producto de Prueba',
      description: 'Descripción de producto de prueba',
      logo: 'https://example.com/logo.png',
      date_release: '2099-12-31',
    });
    component.form.get('date_revision')?.setValue('2100-12-31', { emitEvent: false });
  }

  /** Flush pending async validator HTTP requests so the form stabilizes. */
  function flushAsyncValidator(): void {
    try {
      const req = httpMock.expectOne(() => true);
      req.flush(false);
    } catch (_) {
      // no pending request
    }
  }

  // --- Setup ---

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductFormComponent, ReactiveFormsModule, HttpClientTestingModule],
      providers: [IdExistsValidator],
    }).compileComponents();

    httpMock = TestBed.inject(HttpTestingController);
  });

  // =====================================================
  // FormGroup Logic (NO detectChanges, NO DOM queries)
  // =====================================================

  describe('FormGroup logic', () => {
    beforeEach(() => {
      createComponent();
      fixture.detectChanges(); // solo init
    });

    it('should have 6 controls initialized', () => {
      expect(component.form.get('id')).toBeTruthy();
      expect(component.form.get('name')).toBeTruthy();
      expect(component.form.get('description')).toBeTruthy();
      expect(component.form.get('logo')).toBeTruthy();
      expect(component.form.get('date_release')).toBeTruthy();
      expect(component.form.get('date_revision')).toBeTruthy();
    });

    it('should be invalid when empty', () => {
      expect(component.form.valid).toBe(false);
    });

    it('should mark all fields as touched on submit', () => {
      component.onSubmit();
      expect(component.form.get('id')?.touched).toBe(true);
      expect(component.form.get('name')?.touched).toBe(true);
    });

    it('should validate id minlength (3 chars)', () => {
      const ctrl = component.form.get('id')!;
      ctrl.setValue('ab');
      ctrl.markAsTouched();
      ctrl.updateValueAndValidity();

      expect(ctrl.invalid).toBe(true);
      expect(ctrl.errors).toEqual({
        minlength: { requiredLength: 3, actualLength: 2 },
      });
    });

    it('should validate name minlength (5 chars)', () => {
      const ctrl = component.form.get('name')!;
      ctrl.setValue('abcd');
      ctrl.markAsTouched();
      ctrl.updateValueAndValidity();

      expect(ctrl.invalid).toBe(true);
      expect(ctrl.errors).toEqual({
        minlength: { requiredLength: 5, actualLength: 4 },
      });
    });

    it('should validate description minlength (10 chars)', () => {
      const ctrl = component.form.get('description')!;
      ctrl.setValue('123456789');
      ctrl.markAsTouched();
      ctrl.updateValueAndValidity();

      expect(ctrl.invalid).toBe(true);
      expect(ctrl.errors).toEqual({
        minlength: { requiredLength: 10, actualLength: 9 },
      });
    });

    it('should validate date_release is not in the past', () => {
      const ctrl = component.form.get('date_release')!;
      ctrl.setValue('2020-01-01');
      ctrl.markAsTouched();
      ctrl.updateValueAndValidity();

      expect(ctrl.invalid).toBe(true);
      expect(ctrl.errors).toEqual({ dateNotPast: true });
    });

    it('should auto-calculate date_revision = date_release + 1 year', () => {
      component.form.get('date_release')?.setValue('2026-06-15');
      fixture.detectChanges(); // needed because valueChanges subscription
      expect(component.form.get('date_revision')?.value).toBe('2027-06-15');
    });

    it('should clear date_revision when date_release is emptied', () => {
      component.form.get('date_release')?.setValue('2026-06-15');
      fixture.detectChanges();
      component.form.get('date_release')?.setValue('');
      fixture.detectChanges();
      expect(component.form.get('date_revision')?.value).toBe('');
    });

    it('should have date_revision disabled', () => {
      expect(component.form.get('date_revision')?.disabled).toBe(true);
    });

    it('should be valid with correct data', () => {
      fillFormValid();
      // Flush the async ID verification request
      const req = httpMock.expectOne(() => true);
      req.flush(false);
      expect(component.form.valid).toBe(true);
    });

    it('should emit formSubmit with valid data', () => {
      const emitSpy = jest.spyOn(component.formSubmit, 'emit');
      fillFormValid();
      component.onSubmit();
      expect(emitSpy).toHaveBeenCalledTimes(1);
      expect(emitSpy).toHaveBeenCalledWith(
        expect.objectContaining({ id: 'test-id', name: 'Producto de Prueba' }),
      );
    });

    it('should emit formReset on reset', () => {
      const emitSpy = jest.spyOn(component.formReset, 'emit');
      component.onReset();
      expect(emitSpy).toHaveBeenCalledTimes(1);
    });

    it('should clear form values on reset', () => {
      fillFormValid();
      component.onReset();
      expect(component.form.get('id')?.value).toBeNull();
      expect(component.form.get('name')?.value).toBeNull();
    });
  });

  // =====================================================
  // DOM Rendering (data-testid selectors + detectChanges)
  // =====================================================

  describe('DOM rendering', () => {
    beforeEach(() => {
      createComponent();
      fixture.detectChanges();
    });

    it('should render form title', () => {
      const title = fixture.debugElement.query(By.css('[data-testid="form-title"]'));
      expect(title.nativeElement.textContent).toContain('Formulario de Registro');
    });

    it('should render all 6 form fields with data-testid', () => {
      const ids = ['field-id', 'field-name', 'field-description', 'field-logo', 'field-date_release', 'field-date_revision'];
      ids.forEach((testId) => {
        const el = fixture.debugElement.query(By.css(`[data-testid="${testId}"]`));
        expect(el).toBeTruthy();
      });
    });

    it('should render submit and reset buttons', () => {
      const resetBtn = fixture.debugElement.query(By.css('[data-testid="btn-reset"]'));
      const submitBtn = fixture.debugElement.query(By.css('[data-testid="btn-submit"]'));
      expect(resetBtn.nativeElement.textContent.trim()).toBe('Reiniciar');
      expect(submitBtn.nativeElement.textContent.trim()).toBe('Agregar');
    });

    it('should disable submit button when form is invalid', () => {
      const submitBtn = fixture.debugElement.query(By.css('[data-testid="btn-submit"]'));
      expect(component.form.invalid).toBe(true);
      expect(submitBtn.nativeElement.disabled).toBe(true);
    });

    it('should show field errors after invalid submit', () => {
      component.onSubmit();
      fixture.detectChanges();
      const errors = fixture.debugElement.queryAll(By.css('[data-testid^="error-"]'));
      expect(errors.length).toBeGreaterThan(0);
    });

    it('should show specific error for invalid id', () => {
      const ctrl = component.form.get('id')!;
      ctrl.setValue('ab');
      ctrl.markAsTouched();
      ctrl.updateValueAndValidity();
      flushAsyncValidator();
      fixture.detectChanges();

      const errorEl = fixture.debugElement.query(By.css('[data-testid="error-id"]'));
      expect(errorEl).toBeTruthy();
    });

    it('should show error for past date_release', () => {
      const ctrl = component.form.get('date_release')!;
      ctrl.setValue('2020-01-01');
      ctrl.markAsTouched();
      ctrl.updateValueAndValidity();
      fixture.detectChanges();

      const errorEl = fixture.debugElement.query(By.css('[data-testid="error-date_release"]'));
      expect(errorEl).toBeTruthy();
    });

    it('should render date_revision as disabled input', () => {
      const revisionInput = fixture.debugElement.query(By.css('[data-testid="field-date_revision"]'));
      expect(revisionInput.nativeElement.disabled).toBe(true);
    });

    describe('Edit mode', () => {
      it('should disable id field', () => {
        const { comp } = createEditComponent();
        expect(comp.form.get('id')?.disabled).toBe(true);
      });

      it('should show form title in edit mode', () => {
        const { fix } = createEditComponent();
        const title = fix.debugElement.query(By.css('[data-testid="form-title"]'));
        expect(title.nativeElement.textContent).toContain('Formulario de Registro');
      });
    });
  });

  // --- Cleanup ---

  describe('Cleanup', () => {
    beforeEach(() => {
      createComponent();
      fixture.detectChanges();
    });

    it('should complete destroy$ on destroy', () => {
      const nextSpy = jest.spyOn(component['destroy$'], 'next');
      component.ngOnDestroy();
      expect(nextSpy).toHaveBeenCalled();
    });
  });
});
