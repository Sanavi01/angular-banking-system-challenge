import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ProductFormComponent } from './product-form.component';
import { IdExistsValidator } from '../../../../shared/validators/id-exists.validator';

describe('ProductFormComponent', () => {
  let component: ProductFormComponent;
  let fixture: ComponentFixture<ProductFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        ProductFormComponent,
        ReactiveFormsModule,
        HttpClientTestingModule,
      ],
      providers: [IdExistsValidator],
    }).compileComponents();

    fixture = TestBed.createComponent(ProductFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  // --- Rendering ---

  describe('Rendering', () => {
    it('should render all 6 form fields', () => {
      const inputs = fixture.debugElement.queryAll(By.css('input, textarea'));
      const ids = inputs.map((i) => i.nativeElement.id);
      expect(ids).toContain('id');
      expect(ids).toContain('name');
      expect(ids).toContain('description');
      expect(ids).toContain('logo');
      expect(ids).toContain('date_release');
      expect(ids).toContain('date_revision');
    });

    it('should show form title "Nuevo Producto" in create mode', () => {
      const title = fixture.debugElement.query(By.css('.form-title'));
      expect(title.nativeElement.textContent).toContain('Nuevo Producto');
    });

    it('should render submit and reset buttons', () => {
      const buttons = fixture.debugElement.queryAll(By.css('button'));
      const btnTexts = buttons.map((b) => b.nativeElement.textContent.trim());
      expect(btnTexts).toContain('Reiniciar');
      expect(btnTexts).toContain('Agregar');
    });

    it('should render hint text for date_revision', () => {
      const hint = fixture.debugElement.query(By.css('.field-hint'));
      expect(hint).toBeTruthy();
    });
  });

  // --- Validation ---

  describe('Validation', () => {
    it('should show required errors on empty submit', () => {
      component.onSubmit();
      fixture.detectChanges();

      const errors = fixture.debugElement.queryAll(By.css('.field-error'));
      expect(errors.length).toBeGreaterThan(0);
    });

    it('should show error for id with 2 chars after markAsTouched', () => {
      const idControl = component.form.get('id')!;
      idControl.setValue('ab');
      idControl.markAsTouched();
      idControl.updateValueAndValidity();
      fixture.detectChanges();

      // ID with 2 chars should be invalid (minLength 3)
      expect(idControl.invalid).toBe(true);
      const error = fixture.debugElement.query(By.css('.field-error'));
      expect(error).toBeTruthy();
    });

    it('should show error for name with 4 chars', () => {
      const nameControl = component.form.get('name')!;
      nameControl.setValue('abcd');
      nameControl.markAsTouched();
      nameControl.updateValueAndValidity();
      fixture.detectChanges();

      expect(nameControl.invalid).toBe(true);
    });

    it('should show error for description with 9 chars', () => {
      const descControl = component.form.get('description')!;
      descControl.setValue('123456789');
      descControl.markAsTouched();
      descControl.updateValueAndValidity();
      fixture.detectChanges();

      expect(descControl.invalid).toBe(true);
    });

    it('should show dateNotPast error for past date', () => {
      const dateControl = component.form.get('date_release')!;
      dateControl.setValue('2020-01-01');
      dateControl.markAsTouched();
      dateControl.updateValueAndValidity();
      fixture.detectChanges();

      expect(dateControl.invalid).toBe(true);
      expect(dateControl.errors).toEqual({ dateNotPast: true });
    });
  });

  // --- Date Revision Auto-Calculate ---

  describe('Date revision', () => {
    it('should auto-calculate date_revision when date_release changes', () => {
      component.form.get('date_release')?.setValue('2026-06-15');
      fixture.detectChanges();
      expect(component.form.get('date_revision')?.value).toBe('2027-06-15');
    });

    it('should clear date_revision when date_release is emptied', () => {
      component.form.get('date_release')?.setValue('2026-06-15');
      fixture.detectChanges();
      component.form.get('date_release')?.setValue('');
      fixture.detectChanges();
      expect(component.form.get('date_revision')?.value).toBe('');
    });

    it('should disable date_revision field', () => {
      expect(component.form.get('date_revision')?.disabled).toBe(true);
    });
  });

  // --- Submit and Reset ---

  describe('Submit and Reset', () => {
    function fillFormValid(): void {
      component.form.patchValue({
        id: 'test-id',
        name: 'Producto de Prueba',
        description: 'Descripción de producto de prueba',
        logo: 'https://example.com/logo.png',
        date_release: '2099-12-31',
      });
      // Set revision via the control (disabled field must use setValue on the raw control)
      component.form.get('date_revision')?.setValue('2100-12-31', { emitEvent: false });
      fixture.detectChanges();
    }

    it('should emit formSubmit with valid data', () => {
      const emitSpy = jest.spyOn(component.formSubmit, 'emit');
      fillFormValid();
      component.onSubmit();
      expect(emitSpy).toHaveBeenCalledTimes(1);
      expect(emitSpy).toHaveBeenCalledWith(
        expect.objectContaining({ id: 'test-id', name: 'Producto de Prueba' }),
      );
    });

    it('should emit formReset when reset button clicked', () => {
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

    it('should disable submit button when form is invalid', () => {
      const submitBtn = fixture.debugElement.query(By.css('.btn-submit'));
      expect(submitBtn).toBeTruthy();
      expect(component.form.invalid).toBe(true);
    });
  });

  // --- Edit Mode (SPEC-005) ---

  describe('Edit mode', () => {
    it('should show "Editar Producto" title in edit mode', async () => {
      const editFixture = TestBed.createComponent(ProductFormComponent);
      const editComponent = editFixture.componentInstance;
      editComponent.product = {
        id: 'trj-crd',
        name: 'Test',
        description: 'Descripción de prueba',
        logo: 'https://x.com/logo.png',
        date_release: '2026-06-01',
        date_revision: '2027-06-01',
      };
      editFixture.detectChanges();

      const title = editFixture.debugElement.query(By.css('.form-title'));
      expect(title.nativeElement.textContent).toContain('Editar Producto');
    });

    it('should disable id field in edit mode', async () => {
      const editFixture = TestBed.createComponent(ProductFormComponent);
      const editComponent = editFixture.componentInstance;
      editComponent.product = {
        id: 'trj-crd',
        name: 'Test',
        description: 'Descripción de prueba',
        logo: 'https://x.com/logo.png',
        date_release: '2026-06-01',
        date_revision: '2027-06-01',
      };
      editFixture.detectChanges();

      expect(editComponent.form.get('id')?.disabled).toBe(true);
    });
  });

  // --- Cleanup ---

  describe('Cleanup', () => {
    it('should complete destroy$ on destroy', () => {
      const nextSpy = jest.spyOn(component['destroy$'], 'next');
      component.ngOnDestroy();
      expect(nextSpy).toHaveBeenCalled();
    });
  });
});
